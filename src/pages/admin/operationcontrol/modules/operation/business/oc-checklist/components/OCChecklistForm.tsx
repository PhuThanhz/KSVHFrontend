import React, { useState, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Radio,
  Input,
  Collapse,
  Button,
  Form,
  message,
  Divider,
  Progress,
  Alert,
  Upload,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import {
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  SaveOutlined,
  WarningOutlined,
  RightOutlined,
  CameraOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { ocChecklistData } from "../data/ocChecklistData";
import type { ChecklistCategory } from "../data/ocChecklistData";
import ChecklistHeader from "./ChecklistHeader";
import OCChecklistResult from "./OCChecklistResult";

const { Text, Title } = Typography;
const { TextArea } = Input;

interface OCChecklistFormProps {
  restaurant: {
    name: string;
    location: string;
  };
  onClose: () => void;
}

interface ResultRow {
  key: string | number;
  title: string;
  rate: number | string;
  yes: number | string;
  no: number | string;
  na: number | string;
  earned: number | string;
  missed: number | string;
  percent: number;
  rank: string;
}

const OCChecklistForm: React.FC<OCChecklistFormProps> = ({ restaurant }) => {
  const [form] = Form.useForm();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, UploadFile[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [activeKey, setActiveKey] = useState<string[]>(["I"]);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string>("");
  const [highlightUnanswered, setHighlightUnanswered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleSelect = (id: string, value: string) => {
    if (isLocked) return;
    setAnswers((prev) => ({ ...prev, [id]: value }));
    
    // Nếu chọn NO, mở modal chụp/upload ảnh
    if (value === "no") {
      setCurrentItemId(id);
      setCameraModalVisible(true);
    }
  };

  // Hàm mở camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      message.error("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  // Hàm chụp ảnh
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file: UploadFile = {
              uid: Date.now().toString(),
              name: `photo_${currentItemId}_${Date.now()}.jpg`,
              status: "done",
              url: URL.createObjectURL(blob),
              
            };
            
            setImages((prev) => ({
              ...prev,
              [currentItemId]: [...(prev[currentItemId] || []), file],
            }));
            
            message.success("Đã chụp ảnh thành công!");
            stopCamera();
            setCameraModalVisible(false);
          }
        }, "image/jpeg");
      }
    }
  };

  // Dừng camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Handle upload file
  const handleUploadChange = (itemId: string, fileList: UploadFile[]) => {
    setImages((prev) => ({ ...prev, [itemId]: fileList }));
  };

  // Xóa ảnh
  const handleRemoveImage = (itemId: string, file: UploadFile) => {
    setImages((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || []).filter((f) => f.uid !== file.uid),
    }));
  };

  // ===== Tính kết quả từng phần =====
  const calculateResult = (category: ChecklistCategory) => {
    let rate = 0, yes = 0, no = 0, na = 0, earned = 0, missed = 0;

    category.sections.forEach((section) =>
      section.items.forEach((item) => {
        rate += item.weight;
        const val = answers[item.id];
        if (val === "yes") {
          yes++;
          earned += item.weight;
        } else if (val === "no") {
          no++;
          missed += item.weight;
        } else if (val === "na") {
          na++;
        }
      })
    );

    const percent = rate ? (earned / rate) * 100 : 0;
    let rank = "Kém (SBT)";
    if (percent >= 90) rank = "SAT";
    else if (percent >= 80) rank = "Đạt yêu cầu (OT)";
    else if (percent >= 70) rank = "Không đạt (BT)";

    return { rate, yes, no, na, earned, missed, percent, rank };
  };

  const results = ocChecklistData.map((cat) => ({
    ...calculateResult(cat),
    title: cat.title,
  }));

  const totalEarned = results.reduce((a, b) => a + b.earned, 0);
  const totalRate = results.reduce((a, b) => a + b.rate, 0);
  const totalPercent = totalRate ? (totalEarned / totalRate) * 100 : 0;

  const totalRank =
    totalPercent >= 90 ? "SAT" :
    totalPercent >= 80 ? "Đạt yêu cầu (OT)" :
    totalPercent >= 70 ? "Không đạt (BT)" : "Kém (SBT)";

  // ===== Tiến độ =====
  const totalQuestions = ocChecklistData.reduce(
    (acc, cat) => acc + cat.sections.reduce((a, s) => a + s.items.length, 0),
    0
  );
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  const getRankColor = (rank: string) => {
    if (rank === "SAT") return "#52c41a";
    if (rank.includes("OT")) return "#1890ff";
    if (rank.includes("BT")) return "#faad14";
    return "#ff4d4f";
  };

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      setHighlightUnanswered(true);
      
      // Tìm câu hỏi đầu tiên chưa trả lời
      let firstUnanswered: string | null = null;
      let firstCategory: string | null = null;
      
      for (const category of ocChecklistData) {
        for (const section of category.sections) {
          for (const item of section.items) {
            if (!answers[item.id]) {
              firstUnanswered = item.id;
              firstCategory = category.id;
              break;
            }
          }
          if (firstUnanswered) break;
        }
        if (firstUnanswered) break;
      }
      
      if (firstUnanswered && firstCategory) {
        // Mở collapse của category đó
        if (!activeKey.includes(firstCategory)) {
          setActiveKey([...activeKey, firstCategory]);
        }
        
        // Scroll đến câu hỏi chưa trả lời
        setTimeout(() => {
          const element = document.getElementById(`item-${firstUnanswered}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.style.animation = "pulse 1s ease-in-out 3";
          }
        }, 300);
      }
      
      message.warning({
        content: (
          <span>
            <WarningOutlined /> Vui lòng hoàn thành tất cả câu hỏi. 
            Còn <strong>{totalQuestions - answeredCount}/{totalQuestions}</strong> câu chưa trả lời
          </span>
        ),
        duration: 4,
      });
      return;
    }

    // Kiểm tra câu NO có ảnh chưa
    const noAnswersWithoutImages = Object.entries(answers)
      .filter(([id, value]) => value === "no" && (!images[id] || images[id].length === 0));
    
    if (noAnswersWithoutImages.length > 0) {
      Modal.confirm({
        title: "Cảnh báo: Thiếu ảnh minh chứng",
        content: `Có ${noAnswersWithoutImages.length} câu trả lời NO chưa có ảnh. Bạn có muốn tiếp tục không?`,
        okText: "Tiếp tục",
        cancelText: "Quay lại",
        onOk: () => {
          setIsLocked(true);
          setShowResults(true);
          setHighlightUnanswered(false);
          message.success("Đã lưu đánh giá thành công!");
          setTimeout(() => {
            document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        },
      });
      return;
    }

    setIsLocked(true);
    setShowResults(true);
    setHighlightUnanswered(false);

    message.success("Đã lưu đánh giá thành công!");
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  // ===== Table columns =====
  const columns: ColumnsType<ResultRow> = [
    { title: "Phần", dataIndex: "title", key: "title", width: "22%", render: (text) => <Text strong>{text}</Text> },
    { title: "Tổng điểm", dataIndex: "rate", align: "center", width: "10%" },
    { title: "YES", dataIndex: "yes", align: "center", width: "8%" },
    { title: "NO", dataIndex: "no", align: "center", width: "10%" },
    { title: "N/A", dataIndex: "na", align: "center", width: "8%" },
    { title: "Điểm đạt", dataIndex: "earned", align: "center", width: "10%" },
    { title: "Điểm mất", dataIndex: "missed", align: "center", width: "10%" },
    {
      title: "Tỷ lệ đạt",
      dataIndex: "percent",
      align: "center",
      width: "10%",
      render: (v: number) => (
        <Text strong style={{ color: getRankColor(
          v >= 90 ? "SAT" : v >= 80 ? "OT" : v >= 70 ? "BT" : "SBT"
        ) }}>
          {v ? `${v.toFixed(0)}%` : "-"}
        </Text>
      ),
    },
    {
      title: "Xếp loại",
      dataIndex: "rank",
      align: "center",
      width: "12%",
      render: (r: string) => (
        <Tag color={getRankColor(r)} style={{ fontWeight: 600 }}>{r}</Tag>
      ),
    },
  ];

  const dataSource: ResultRow[] = [
    ...results.map((r, i) => ({ key: i, ...r })),
    {
      key: "total", title: "TỔNG KẾT", rate: totalRate,
      yes: "-", no: "-", na: "-", earned: totalEarned,
      missed: "-", percent: totalPercent, rank: totalRank,
    },
  ];

  // ===== Icon map =====
  const iconMap: Record<string, React.ReactNode> = {
    I: <DollarOutlined style={{ fontSize: 18, color: "#1890ff" }} />,
    II: <ShoppingOutlined style={{ fontSize: 18, color: "#52c41a" }} />,
    III: <TeamOutlined style={{ fontSize: 18, color: "#fa8c16" }} />,
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", paddingBottom: 80 }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { 
              box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
              border-color: #ff4d4f;
            }
            50% { 
              box-shadow: 0 0 0 10px rgba(255, 77, 79, 0);
              border-color: #ff7875;
            }
          }
          
          .unanswered-highlight {
            border: 2px solid #ff4d4f !important;
            background: #fff1f0 !important;
          }
          
          .enhanced-collapse .ant-collapse-header {
            background: #fafafa !important;
            border-radius: 8px !important;
            margin-bottom: 8px !important;
            padding: 16px 20px !important;
            border: 1px solid #e8e8e8 !important;
            transition: all 0.3s ease !important;
          }
          
          .enhanced-collapse .ant-collapse-header:hover {
            background: #f0f0f0 !important;
            border-color: #1890ff !important;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1) !important;
          }
          
          .enhanced-collapse .ant-collapse-item-active .ant-collapse-header {
            background: #e6f7ff !important;
            border-color: #1890ff !important;
          }
          
          .enhanced-collapse .ant-collapse-content {
            border-top: none !important;
          }
        `}
      </style>

      {/* MODAL CHỤP/UPLOAD ẢNH */}
      <Modal
        title={
          <Space>
            <CameraOutlined />
            <span>Chụp hoặc tải ảnh lên (Câu {currentItemId})</span>
          </Space>
        }
        open={cameraModalVisible}
        onCancel={() => {
          stopCamera();
          setCameraModalVisible(false);
        }}
        width={700}
        footer={null}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          {/* Nút chụp ảnh */}
          {!stream ? (
            <Button 
              type="primary" 
              icon={<CameraOutlined />} 
              onClick={startCamera}
              size="large"
              block
            >
              Mở Camera
            </Button>
          ) : (
            <div>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <Row gutter={16}>
                <Col span={12}>
                  <Button 
                    type="primary" 
                    icon={<CameraOutlined />}
                    onClick={capturePhoto}
                    size="large"
                    block
                  >
                    Chụp ảnh
                  </Button>
                </Col>
                <Col span={12}>
                  <Button 
                    onClick={() => {
                      stopCamera();
                    }}
                    size="large"
                    block
                  >
                    Đóng Camera
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          <Divider>Hoặc</Divider>

          {/* Upload từ thư viện */}
          <Upload
            listType="picture-card"
            fileList={images[currentItemId] || []}
            onChange={({ fileList }) => handleUploadChange(currentItemId, fileList)}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Chỉ cho phép tải lên file ảnh!");
              }
              return false; // Prevent auto upload
            }}
            multiple
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
            </div>
          </Upload>

          <Button
            type="primary"
            onClick={() => {
              stopCamera();
              setCameraModalVisible(false);
            }}
            size="large"
            block
          >
            Xong
          </Button>
        </Space>
      </Modal>

      <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>

        {/* CHỈ HIỆN FORM KHI CHƯA LOCK */}
        {!isLocked && (
          <>
            {/* THÔNG TIN */}
            <ChecklistHeader 
              restaurant={restaurant}
              form={form}
               isLocked={isLocked}
            />
            {/* TIẾN ĐỘ - STICKY */}
            {answeredCount > 0 && (
              <Card 
                style={{ 
                  marginBottom: 24,
                  position: 'sticky',
                  top: 16,
                  zIndex: 100,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <Row>
                  <Col span={16}>
                    <Row justify="space-between">
                      <Text strong style={{ fontSize: 15 }}>Tiến độ hoàn thành</Text>
                      <Text strong style={{ fontSize: 15 }}>{answeredCount}/{totalQuestions} câu hỏi</Text>
                    </Row>

                    <Progress
                      percent={progressPercent}
                      strokeColor={{ "0%": "#1890ff", "100%": "#52c41a" }}
                      status={answeredCount === totalQuestions ? "success" : "active"}
                      strokeWidth={12}
                    />
                  </Col>

                  <Col span={8}>
                    <Row justify="space-around" align="middle">
                      <Space direction="vertical" align="center">
                        <Text strong style={{ color: "#52c41a", fontSize: 24 }}>
                          {Object.values(answers).filter(v => v === "yes").length}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>YES</Text>
                      </Space>

                      <Divider type="vertical" style={{ height: 50 }} />

                      <Space direction="vertical" align="center">
                        <Text strong style={{ color: "#ff4d4f", fontSize: 24 }}>
                          {Object.values(answers).filter(v => v === "no").length}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>NO</Text>
                      </Space>

                      <Divider type="vertical" style={{ height: 50 }} />

                      <Space direction="vertical" align="center">
                        <Text strong style={{ color: "#8c8c8c", fontSize: 24 }}>
                          {Object.values(answers).filter(v => v === "na").length}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>N/A</Text>
                      </Space>
                    </Row>
                  </Col>
                </Row>
              </Card>
            )}

            {/* ALERT */}
            {answeredCount > 0 && answeredCount < totalQuestions && (
              <Alert
                message={<Space><WarningOutlined /> <Text strong>Chưa hoàn thành</Text></Space>}
                description={`Vui lòng trả lời ${totalQuestions - answeredCount} câu hỏi còn lại`}
                type="warning"
                style={{ marginBottom: 24 }}
                closable
              />
            )}

            {/* CHECKLIST */}
            {ocChecklistData.map((category) => {
              const categoryResult = calculateResult(category);

              return (
                <Card key={category.id} style={{ marginBottom: 24 }}
                  title={
                    <Space>
                      {iconMap[category.id]}
                      <Text strong style={{ fontSize: 16 }}>{category.title}</Text>
                      {answeredCount > 0 && (
                        <Tag color={categoryResult.percent >= 90 ? "green" :
                                    categoryResult.percent >= 80 ? "blue" : "orange"}>
                          {categoryResult.earned}/{categoryResult.rate} điểm
                        </Tag>
                      )}
                    </Space>
                  }
                >
                  <Collapse
                    activeKey={activeKey}
                    onChange={(keys) => setActiveKey(keys as string[])}
                    expandIcon={({ isActive }) => (
                      <div style={{
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: isActive ? '#1890ff' : '#f0f0f0',
                        transition: 'all 0.3s ease',
                      }}>
                        <RightOutlined 
                          rotate={isActive ? 90 : 0} 
                          style={{ 
                            color: isActive ? '#fff' : '#595959',
                            fontSize: 12,
                            transition: 'all 0.3s ease'
                          }} 
                        />
                      </div>
                    )}
                    ghost
                    className="enhanced-collapse"
                  >
                    {category.sections.map((section) => {
                      const sectionItems = section.items;
                      const answeredInSection = sectionItems.filter(item => answers[item.id]).length;
                      const totalInSection = sectionItems.length;
                      const sectionProgress = totalInSection > 0 ? (answeredInSection / totalInSection) * 100 : 0;
                      
                      return (
                      <Collapse.Panel 
                        header={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: 24 }}>
                            <Space>
                              <Text strong style={{ fontSize: 15 }}>{section.title}</Text>
                              <Tag color="blue" style={{ fontSize: 12 }}>
                                {totalInSection} câu hỏi
                              </Tag>
                            </Space>
                            <Space size={12}>
                              {answeredInSection > 0 && (
                                <Tag color={sectionProgress === 100 ? "success" : "processing"} style={{ fontSize: 12, fontWeight: 600 }}>
                                  {answeredInSection}/{totalInSection}
                                </Tag>
                              )}
                              <Progress 
                                type="circle" 
                                percent={sectionProgress} 
                                size={32}
                                strokeWidth={8}
                                format={(percent) => percent === 100 ? '✓' : `${Math.round(percent || 0)}%`}
                                strokeColor={sectionProgress === 100 ? "#52c41a" : "#1890ff"}
                                style={{ marginLeft: 8 }}
                              />
                            </Space>
                          </div>
                        }
                        key={section.id}
                      >
                        <Space direction="vertical" style={{ width: "100%" }} size={16}>
                          {section.items.map((item) => {
                            const isUnanswered = !answers[item.id];
                            const hasNoAnswer = answers[item.id] === "no";
                            const hasImages = images[item.id] && images[item.id].length > 0;
                            
                            return (
                            <Card 
                              key={item.id} 
                              id={`item-${item.id}`}
                              size="small"
                              className={highlightUnanswered && isUnanswered ? "unanswered-highlight" : ""}
                              style={{
                                transition: "all 0.3s ease",
                                border: highlightUnanswered && isUnanswered ? "2px solid #ff4d4f" : undefined,
                              }}
                            >
                              <Row justify="space-between" align="middle">
                                <Col>
                                  <Space>
                                    <Tag color="blue" style={{ fontSize: 13 }}>{item.id}</Tag>
                                    {item.critical && <Tag color="red" style={{ fontSize: 13, fontWeight: 600 }}>CRITICAL</Tag>}
                                    {highlightUnanswered && isUnanswered && (
                                      <Tag color="red" icon={<WarningOutlined />} style={{ fontSize: 13, fontWeight: 600 }}>
                                        Chưa trả lời
                                      </Tag>
                                    )}
                                    <Text type="secondary" style={{ fontSize: 13 }}>
                                      Trọng số: <Text strong>{item.weight}</Text>
                                    </Text>
                                  </Space>
                                </Col>

                                <Col>
                                  <Radio.Group
                                    disabled={isLocked}
                                    onChange={(e) => handleSelect(item.id, e.target.value)}
                                    value={answers[item.id]}
                                  >
                                    <Radio.Button
                                      value="yes"
                                      style={{
                                        height: 40,
                                        fontWeight: 600,
                                        fontSize: 14,
                                        padding: "0 20px",
                                        borderRadius: 6,
                                        background: answers[item.id] === "yes" ? "#f6ffed" : "white",
                                        borderColor: answers[item.id] === "yes" ? "#52c41a" : "#d9d9d9",
                                        color: answers[item.id] === "yes" ? "#52c41a" : "#595959",
                                        marginRight: 8,
                                      }}
                                    >
                                      YES
                                    </Radio.Button>

                                    <Radio.Button
                                      value="no"
                                      style={{
                                        height: 40,
                                        fontWeight: 600,
                                        fontSize: 14,
                                        padding: "0 20px",
                                        borderRadius: 6,
                                        background: answers[item.id] === "no" ? "#fff1f0" : "white",
                                        borderColor: answers[item.id] === "no" ? "#ff4d4f" : "#d9d9d9",
                                        color: answers[item.id] === "no" ? "#ff4d4f" : "#595959",
                                        marginRight: 8,
                                      }}
                                    >
                                      NO
                                    </Radio.Button>

                                    <Radio.Button
                                      value="na"
                                      style={{
                                        height: 40,
                                        fontWeight: 600,
                                        fontSize: 14,
                                        padding: "0 20px",
                                        borderRadius: 6,
                                        background: answers[item.id] === "na" ? "#fafafa" : "white",
                                        borderColor: answers[item.id] === "na" ? "#8c8c8c" : "#d9d9d9",
                                        color: answers[item.id] === "na" ? "#8c8c8c" : "#595959",
                                      }}
                                    >
                                      N/A
                                    </Radio.Button>
                                  </Radio.Group>
                                </Col>
                              </Row>

                              <div
                                style={{
                                  marginTop: 16,
                                  padding: "16px 20px",
                                  background: "#fafafa",
                                  borderRadius: 6,
                                  borderLeft: item.critical ? "4px solid #ff4d4f" : "4px solid #1890ff",
                                }}
                              >
                                <Text style={{ 
                                  whiteSpace: "pre-line",
                                  fontSize: 15,
                                  lineHeight: 1.8,
                                  color: '#262626'
                                }}>
                                  {item.text}
                                </Text>
                              </div>

                              <TextArea
                                disabled={isLocked}
                                rows={3}
                                placeholder="Nhập ghi chú..."
                                value={notes[item.id] ?? ""}
                                onChange={(e) =>
                                  setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                                }
                                style={{ marginTop: 12, fontSize: 14 }}
                              />

                              {/* Hiển thị ảnh đã chụp/upload */}
                              {hasNoAnswer && (
                                <div style={{ marginTop: 16 }}>
                                  <Space direction="vertical" style={{ width: "100%" }}>
                                    <Text strong style={{ color: hasImages ? "#52c41a" : "#ff4d4f" }}>
                                      {hasImages 
                                        ? `✓ Đã có ${images[item.id].length} ảnh minh chứng` 
                                        : "⚠ Chưa có ảnh minh chứng"}
                                    </Text>
                                    
                                    {hasImages && (
                                      <div style={{ 
                                        display: "flex", 
                                        gap: 8, 
                                        flexWrap: "wrap",
                                        marginTop: 8 
                                      }}>
                                        {images[item.id].map((file) => (
                                          <div
                                            key={file.uid}
                                            style={{
                                              position: "relative",
                                              width: 100,
                                              height: 100,
                                              borderRadius: 8,
                                              overflow: "hidden",
                                              border: "1px solid #d9d9d9",
                                            }}
                                          >
                                            <img
                                              src={file.url || file.thumbUrl}
                                              alt="evidence"
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                              }}
                                            />
                                            {!isLocked && (
                                              <Button
                                                type="primary"
                                                danger
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                style={{
                                                  position: "absolute",
                                                  top: 4,
                                                  right: 4,
                                                }}
                                                onClick={() => handleRemoveImage(item.id, file)}
                                              />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {!isLocked && (
                                      <Button
                                        icon={<CameraOutlined />}
                                        onClick={() => {
                                          setCurrentItemId(item.id);
                                          setCameraModalVisible(true);
                                        }}
                                        style={{ marginTop: 8 }}
                                      >
                                        {hasImages ? "Thêm ảnh" : "Chụp/Tải ảnh"}
                                      </Button>
                                    )}
                                  </Space>
                                </div>
                              )}
                            </Card>
                          )})}
                        </Space>
                      </Collapse.Panel>
                    )})}
                  </Collapse>
                </Card>
              );
            })}

            {/* LƯU */}
            {!isLocked && (
              <Card style={{ marginTop: 24 }}>
                <Row justify="center">
                  <Space direction="vertical" align="center">
                    <Text style={{ fontSize: 15 }}>
                      {answeredCount === totalQuestions
                        ? "Đã hoàn thành tất cả câu hỏi"
                        : `Còn ${totalQuestions - answeredCount}/${totalQuestions} câu chưa trả lời`}
                    </Text>

                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={handleSubmit}
                      size="large"
                      style={{ height: 44, fontSize: 15, fontWeight: 600 }}
                    >
                      Lưu đánh giá
                    </Button>
                  </Space>
                </Row>
              </Card>
            )}
          </>
        )}

        {/* KẾT QUẢ */}
        {showResults && (
          <div id="results-section">
            <OCChecklistResult
              results={results}
              totalRate={totalRate}
              totalEarned={totalEarned}
              totalPercent={totalPercent}
              totalRank={totalRank}
              columns={columns}
              dataSource={dataSource}
              getRankColor={getRankColor}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default OCChecklistForm;