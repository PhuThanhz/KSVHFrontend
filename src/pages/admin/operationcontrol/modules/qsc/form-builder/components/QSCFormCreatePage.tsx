import React, { useState } from "react";
import { 
  Input, 
  Button, 
  Card, 
  Space, 
  Switch, 
  InputNumber, 
  Typography, 
  Tooltip,
  Badge,
  Divider,
  Tag
} from "antd";
import { 
  PlusOutlined, 
  DeleteOutlined, 
  CopyOutlined, 
  HolderOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import { 
  GripVertical, 
  Image, 
  FileText, 
  CheckSquare, 
  Circle, 
  Star, 
  Camera, 
  Video, 
  Type, 
  AlignLeft, 
  Heading 
} from "lucide-react";
import FormSidebar from "./FormSidebar";
import { FormBuilderHeader } from "./FormBuilderHeader";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import type {
  QuestionItem,
  QuestionType,
} from "../../../../types/form";
import YesNoNAQuestion from "./questions/YesNoNAQuestion";

const { TextArea } = Input;
const { Text } = Typography;

type ElementType = QuestionType | "title" | "description" | "image" | "video";

interface QSCFormCreatePageProps {
  onClose: () => void;
}

interface MediaElement {
  id: string;
  type: "image" | "video";
  url: string;
}

interface TextElement {
  id: string;
  type: "title" | "description";
  content: string;
}

type FormElement = QuestionItem | MediaElement | TextElement;

interface SectionItem {
  id: string;
  title: string;
  description: string;
  elements: FormElement[];
}

interface FormData {
  title: string;
  description: string;
  sections: SectionItem[];
}

const QSCFormCreatePage: React.FC<QSCFormCreatePageProps> = ({ onClose }) => {
  const elementRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [formData, setFormData] = useState<FormData>({
    title: "Biểu mẫu không có tiêu đề",
    description: "",
    sections: [
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        elements: [],
      },
    ],
  });
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [focusedSection, setFocusedSection] = useState(0);

  /* =======================
     HELPER FUNCTIONS
  ======================= */
  const getQuestionCount = (section: SectionItem): number => {
    return section.elements.filter(el => !("content" in el) && !("url" in el)).length;
  };

  const getElementTypeLabel = (element: FormElement): string => {
    if ("content" in element) {
      return element.type === "title" ? "Tiêu đề" : "Mô tả";
    } else if ("url" in element) {
      return element.type === "image" ? "Hình ảnh" : "Video";
    } else {
      const question = element as QuestionItem;
      const typeLabels: Record<QuestionType, string> = {
        yes_no_na: "Có/Không/N/A",
        multiple_choice: "Nhiều lựa chọn",
        checkboxes: "Hộp kiểm",
        short_answer: "Câu trả lời ngắn",
        paragraph: "Đoạn văn",
        image_upload: "Tải ảnh lên",
        rating: "Đánh giá sao"
      };
      return typeLabels[question.type] || "Câu hỏi";
    }
  };

  /* =======================
     SECTION HANDLERS
  ======================= */
  const addSection = () => {
    const newIndex = formData.sections.length;

    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          id: Date.now().toString(),
          title: "",
          description: "",
          elements: [],
        },
      ],
    });

    setFocusedSection(newIndex);
  };

  const updateSection = (sectionIndex: number, field: keyof SectionItem, value: any) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      [field]: value,
    };
    setFormData({ ...formData, sections: newSections });
  };

  const deleteSection = (sectionIndex: number) => {
    const newSections = formData.sections.filter((_, i) => i !== sectionIndex);
    setFormData({ ...formData, sections: newSections });
  };

  /* =======================
     ELEMENT HANDLERS
  ======================= */
  const addElement = (sectionIndex: number, type: ElementType) => {
    const newSections = [...formData.sections];
    let newElement: FormElement;

    if (type === "title" || type === "description") {
      newElement = {
        id: Date.now().toString(),
        type,
        content: "",
      } as TextElement;
    } else if (type === "image" || type === "video") {
      newElement = {
        id: Date.now().toString(),
        type,
        url: "",
      } as MediaElement;
    } else {
      newElement = {
        id: Date.now().toString(),
        type: type as QuestionType,
        title: "",
        description: "",
        required: false,

        // ===== QC CORE =====
        answer: undefined,
        score: 1,
        achievedScore: 0,
        notAchievedReason: "",
        evidenceImages: [],

        options:
          type === "multiple_choice" || type === "checkboxes"
            ? ["Tùy chọn 1"]
            : undefined,

        maxRating: type === "rating" ? 5 : undefined,
      } as QuestionItem;
    }

    newSections[sectionIndex].elements.push(newElement);
    setFormData({ ...formData, sections: newSections });
    setFocusedElement(newElement.id);
  };

  const updateElement = (
    sectionIndex: number,
    elementIndex: number,
    field: string,
    value: any
  ) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].elements[elementIndex] = {
      ...newSections[sectionIndex].elements[elementIndex],
      [field]: value,
    };
    setFormData({ ...formData, sections: newSections });
  };

  const duplicateElement = (sectionIndex: number, elementIndex: number) => {
    const newSections = [...formData.sections];
    const elementToCopy = { ...newSections[sectionIndex].elements[elementIndex] };
    elementToCopy.id = Date.now().toString();
    newSections[sectionIndex].elements.splice(elementIndex + 1, 0, elementToCopy);
    setFormData({ ...formData, sections: newSections });
  };

  const deleteElement = (sectionIndex: number, elementIndex: number) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].elements.splice(elementIndex, 1);
    setFormData({ ...formData, sections: newSections });
  };

  const addOption = (sectionIndex: number, elementIndex: number) => {
    const newSections = [...formData.sections];
    const element = newSections[sectionIndex].elements[elementIndex] as QuestionItem;
    if (element.options) {
      element.options.push(`Tùy chọn ${element.options.length + 1}`);
      setFormData({ ...formData, sections: newSections });
    }
  };

  const updateOption = (sectionIndex: number, elementIndex: number, optionIndex: number, value: string) => {
    const newSections = [...formData.sections];
    const element = newSections[sectionIndex].elements[elementIndex] as QuestionItem;
    if (element.options) {
      element.options[optionIndex] = value;
      setFormData({ ...formData, sections: newSections });
    }
  };

  const deleteOption = (sectionIndex: number, elementIndex: number, optionIndex: number) => {
    const newSections = [...formData.sections];
    const element = newSections[sectionIndex].elements[elementIndex] as QuestionItem;
    if (element.options && element.options.length > 1) {
      element.options.splice(optionIndex, 1);
      setFormData({ ...formData, sections: newSections });
    }
  };

  /* =======================
     SAVE FORM
  ======================= */
  const handleSave = () => {
    console.log("Form Data:", formData);
    alert("Biểu mẫu đã được lưu! Kiểm tra console để xem dữ liệu.");
  };

  /* =======================
     RENDER ELEMENT BY TYPE
  ======================= */
  const renderElement = (element: FormElement, sectionIndex: number, elementIndex: number) => {
    if ("content" in element) {
      // Text elements
      if (element.type === "title") {
        return (
          <Input
            value={element.content}
            onChange={(e) => updateElement(sectionIndex, elementIndex, "content", e.target.value)}
            placeholder="Nhập tiêu đề..."
            style={{ 
              fontSize: 24, 
              fontWeight: 600,
              padding: "8px 0",
              color: "#262626"
            }}
            bordered={false}
          />
        );
      } else {
        return (
          <TextArea
            value={element.content}
            onChange={(e) => updateElement(sectionIndex, elementIndex, "content", e.target.value)}
            placeholder="Nhập mô tả..."
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ 
              fontSize: 14,
              color: "#262626",
              lineHeight: "1.6"
            }}
            bordered={false}
          />
        );
      }
    } else if ("url" in element) {
      // Media elements
      return (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Input
            value={element.url}
            onChange={(e) => updateElement(sectionIndex, elementIndex, "url", e.target.value)}
            placeholder={element.type === "image" ? "Nhập URL hình ảnh..." : "Nhập URL video..."}
            prefix={element.type === "image" ? <PictureOutlined style={{ color: "#1890ff" }} /> : <VideoCameraOutlined style={{ color: "#1890ff" }} />}
            size="large"
            style={{ 
              fontSize: 14,
              color: "#262626"
            }}
          />
          {element.url && (
            <div style={{ 
              borderRadius: 8, 
              overflow: "hidden", 
              border: "1px solid #d9d9d9",
              background: "#fafafa",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
            }}>
              {element.type === "image" ? (
                <img src={element.url} alt="Preview" style={{ width: "100%", display: "block" }} />
              ) : (
                <div style={{ 
                  aspectRatio: "16/9", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  background: "#f5f5f5"
                }}>
                  <Video className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>
          )}
        </Space>
      );
    } else {
      // Question elements
      const question = element as QuestionItem;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ 
            background: "#fafafa",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #f0f0f0"
          }}>
            <Input
              value={question.title}
              onChange={(e) => updateElement(sectionIndex, elementIndex, "title", e.target.value)}
              placeholder="Nhập câu hỏi..."
              className="question-input"
              style={{ 
                fontSize: 16, 
                fontWeight: 600,
                padding: 0,
                color: "#262626",
                background: "transparent"
              }}
              bordered={false}
              suffix={question.required ? <span style={{ color: "#ff4d4f", fontSize: 18, fontWeight: "bold" }}>*</span> : null}
            />
          </div>

          {question.description !== undefined && (
            <div style={{
              paddingLeft: 16,
              borderLeft: "3px solid #e8e8e8"
            }}>
              <Input
                value={question.description}
                onChange={(e) => updateElement(sectionIndex, elementIndex, "description", e.target.value)}
                placeholder="Thêm mô tả câu hỏi (không bắt buộc)"
                className="question-desc-input"
                style={{ 
                  fontSize: 14, 
                  color: "#262626",
                  padding: 0,
                  background: "transparent"
                }}
                bordered={false}
              />
            </div>
          )}

          <div style={{ 
            background: "#ffffff",
            padding: "16px",
            borderRadius: 8,
            border: "1px solid #e8e8e8"
          }}>
            {renderQuestionPreview(question, sectionIndex, elementIndex)}
          </div>

          {question.type === "rating" && (
            <div style={{ 
              paddingTop: 16, 
              borderTop: "1px solid #e8e8e8",
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <Text style={{ fontSize: 14, color: "#262626", fontWeight: 500 }}>Số sao tối đa:</Text>
              <InputNumber
                min={3}
                max={10}
                value={question.maxRating || 5}
                onChange={(value) => updateElement(sectionIndex, elementIndex, "maxRating", value)}
                style={{ width: 80 }}
              />
            </div>
          )}
          <style>{`
            .question-input::placeholder,
            .question-desc-input::placeholder {
              color: #595959 !important;
              opacity: 1;
            }
          `}</style>
        </div>
      );
    }
  };

  const renderQuestionPreview = (question: QuestionItem, sectionIndex: number, elementIndex: number) => {
    switch (question.type) {
      case "yes_no_na":
        return (
          <YesNoNAQuestion
            question={question}
            sectionIndex={sectionIndex}
            elementIndex={elementIndex}
            updateElement={updateElement}
          />
        );

      case "multiple_choice":
        return (
          <MultipleChoiceQuestion
            question={question}
            sectionIndex={sectionIndex}
            elementIndex={elementIndex}
            updateOption={updateOption}
            addOption={addOption}
            deleteOption={deleteOption}
          />
        );

      case "short_answer":
        return (
          <div>
            <Input 
              placeholder="Người dùng sẽ nhập câu trả lời ngắn tại đây..." 
              disabled 
              size="large"
              className="preview-input"
              style={{ 
                background: "#f5f5f5",
                color: "#595959",
                cursor: "not-allowed"
              }}
            />
            <style>{`
              .preview-input::placeholder {
                color: #8c8c8c !important;
                opacity: 1;
              }
            `}</style>
          </div>
        );

      case "paragraph":
        return (
          <div>
            <TextArea 
              placeholder="Người dùng sẽ nhập câu trả lời dài tại đây..." 
              rows={4} 
              disabled
              className="preview-textarea"
              style={{ 
                background: "#f5f5f5",
                color: "#595959",
                cursor: "not-allowed",
                fontSize: 14
              }}
            />
            <style>{`
              .preview-textarea::placeholder {
                color: #8c8c8c !important;
                opacity: 1;
              }
            `}</style>
          </div>
        );

      case "image_upload":
        return (
          <div style={{ 
            border: "2px dashed #d9d9d9", 
            borderRadius: 8, 
            padding: 40, 
            textAlign: "center",
            background: "#fafafa",
            transition: "all 0.3s"
          }}>
            <Camera className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <Text strong style={{ fontSize: 14, color: "#595959", display: "block", marginBottom: 4 }}>
              Nhấn để tải ảnh lên
            </Text>
            <Text style={{ fontSize: 12, color: "#8c8c8c" }}>
              Hỗ trợ JPG, PNG (tối đa 10MB)
            </Text>
          </div>
        );

      case "rating":
        return (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {Array.from({ length: question.maxRating || 5 }).map((_, idx) => (
              <Star 
                key={idx} 
                className="w-8 h-8 text-gray-300 cursor-pointer transition-all hover:text-yellow-400 hover:scale-110" 
                style={{ transition: "all 0.2s" }}
              />
            ))}
            <Text style={{ marginLeft: 8, color: "#8c8c8c", fontSize: 13 }}>
              Người dùng chọn từ 1-{question.maxRating || 5} sao
            </Text>
          </div>
        );

      default:
        return null;
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", flexDirection: "column" }}>
      <FormBuilderHeader
        formTitle={formData.title}
        onBack={onClose}
        onSave={handleSave}
        onPreview={() => {
          console.log("Preview form");
        }}
        isSaving={false}
        lastSaved="vài giây trước"
      />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px 24px", overflowY: "auto" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* HEADER */}
          <Card 
            style={{ 
              borderRadius: 12,
              borderTop: "8px solid #1890ff",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}
            bodyStyle={{ padding: "40px 40px 32px" }}
          >
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Biểu mẫu không có tiêu đề"
              className="form-title-input"
              style={{ 
                fontSize: 32, 
                fontWeight: 600, 
                marginBottom: 16,
                padding: "8px 0",
                color: "#262626"
              }}
              bordered={false}
            />
            <TextArea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Thêm mô tả cho biểu mẫu của bạn..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{ 
                fontSize: 14, 
                color: "#262626"
              }}
              bordered={false}
            />
            <style>{`
              .form-title-input::placeholder {
                color: #595959 !important;
                opacity: 1;
              }
            `}</style>
          </Card>

          {/* SECTIONS */}
          {formData.sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
              onClick={() => setFocusedSection(sectionIndex)}
            >
              {/* Section Header */}
              {(section.title || section.description || sectionIndex > 0) && (
                <Card
                  style={{
                    borderRadius: 12,
                    border: focusedSection === sectionIndex ? "2px solid #1890ff" : "1px solid #e8e8e8",
                    boxShadow: focusedSection === sectionIndex 
                      ? "0 4px 12px rgba(24,144,255,0.15)" 
                      : "0 2px 4px rgba(0,0,0,0.04)",
                    transition: "all 0.3s"
                  }}
                  bodyStyle={{ padding: "28px 32px" }}
                  extra={
                    <Badge 
                      count={getQuestionCount(section)} 
                      showZero
                      style={{ 
                        backgroundColor: '#52c41a',
                        boxShadow: '0 0 0 1px #fff'
                      }}
                      title={`${getQuestionCount(section)} câu hỏi`}
                    >
                      <QuestionCircleOutlined style={{ fontSize: 20, color: '#8c8c8c' }} />
                    </Badge>
                  }
                >
                  <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Tag color="blue">Phần {sectionIndex + 1}</Tag>
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, "title", e.target.value)}
                        placeholder="Tiêu đề phần"
                        className="section-title-input"
                        style={{ 
                          fontSize: 20, 
                          fontWeight: 500,
                          flex: 1,
                          padding: "4px 0",
                          color: "#262626"
                        }}
                        bordered={false}
                      />
                    </div>
                    
                    <TextArea
                      value={section.description}
                      onChange={(e) => updateSection(sectionIndex, "description", e.target.value)}
                      placeholder="Thêm mô tả cho phần này..."
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      style={{ 
                        fontSize: 14, 
                        color: "#262626"
                      }}
                      bordered={false}
                    />
                    
                    {formData.sections.length > 1 && (
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(sectionIndex);
                        }}
                        size="small"
                      >
                        Xóa phần này
                      </Button>
                    )}
                  </Space>
                  <style>{`
                    .section-title-input::placeholder {
                      color: #595959 !important;
                      opacity: 1;
                    }
                  `}</style>
                </Card>
              )}

              {/* Elements */}
              {section.elements.map((element, elementIndex) => {
                const isQuestion = !("content" in element) && !("url" in element);
                const questionNumber = isQuestion 
                  ? section.elements.slice(0, elementIndex).filter(el => !("content" in el) && !("url" in el)).length + 1
                  : null;

                return (
                  <Badge.Ribbon 
                    key={element.id} 
                    text={
                      <Space size={4}>
                        <HolderOutlined />
                        {isQuestion && <Text style={{ color: 'white', fontSize: 12 }}>Câu {questionNumber}</Text>}
                      </Space>
                    }
                    color={focusedElement === element.id ? "#1890ff" : "#8c8c8c"}
                  >
                    <Card
                      ref={(el) => {
                        elementRefs.current[element.id] = el;
                      }}
                      style={{
                        borderRadius: 12,
                        border: focusedElement === element.id ? "2px solid #1890ff" : "1px solid #e8e8e8",
                        cursor: "pointer",
                        boxShadow: focusedElement === element.id 
                          ? "0 4px 12px rgba(24,144,255,0.15)" 
                          : "0 2px 4px rgba(0,0,0,0.04)",
                        transition: "all 0.3s",
                        background: "#ffffff"
                      }}
                      bodyStyle={{ padding: "28px 32px" }}
                      onClick={() => setFocusedElement(element.id)}
                    >
                      <Space direction="vertical" style={{ width: "100%" }} size="middle">
                        {/* Element Type Tag */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Tag color="geekblue" style={{ margin: 0 }}>
                            {getElementTypeLabel(element)}
                          </Tag>
                          <GripVertical className="w-5 h-5 text-gray-300 cursor-move" />
                        </div>

                        {/* Element Content */}
                        <div>
                          {renderElement(element, sectionIndex, elementIndex)}
                        </div>
                      </Space>

                      {/* Element Actions */}
                      <Divider style={{ margin: "24px 0 16px" }} />
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space size="small">
                          <Tooltip title="Nhân bản">
                            <Button
                              icon={<CopyOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateElement(sectionIndex, elementIndex);
                              }}
                              size="middle"
                            />
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteElement(sectionIndex, elementIndex);
                              }}
                              size="middle"
                            />
                          </Tooltip>
                        </Space>

                        {"required" in element && (
                          <Space size="small">
                            <Text style={{ fontSize: 14, color: "#595959" }}>Bắt buộc</Text>
                            <Switch
                              checked={element.required}
                              onChange={(checked) => {
                                updateElement(sectionIndex, elementIndex, "required", checked);
                              }}
                            />
                          </Space>
                        )}
                      </div>
                    </Card>
                  </Badge.Ribbon>
                );
              })}

              {/* Empty Section Message */}
              {section.elements.length === 0 && (
                <Card
                  style={{
                    borderRadius: 12,
                    border: "2px dashed #d9d9d9",
                    background: "#fafafa",
                    textAlign: "center"
                  }}
                  bodyStyle={{ padding: "40px 32px" }}
                >
                  <QuestionCircleOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
                  <Text style={{ fontSize: 14, color: "#8c8c8c", display: "block" }}>
                    Phần này chưa có câu hỏi nào. Nhấn vào nút bên phải để thêm câu hỏi.
                  </Text>
                </Card>
              )}
            </div>
          ))}
          
          <div style={{ height: 96 }}></div>
        </div>
      </div>

      {/* Sidebar */}
      <FormSidebar
        onAddElement={(type) => {
          if (type === "section") {
            addSection();
            return;
          }

          addElement(focusedSection, type);
        }}
      />
    </div>
  );
};

export default QSCFormCreatePage;