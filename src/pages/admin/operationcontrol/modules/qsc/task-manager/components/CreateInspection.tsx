import React, { useState } from "react";
import {
  Button,
  Steps,
  Radio,
  Card,
  Space,
  Tag,
  Row,
  Col,
  DatePicker,
  Divider,
  Input,
  message,
} from "antd";
import {
  ShopOutlined,
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Step } = Steps;
const { TextArea } = Input;

interface Props {
  onCancel: () => void;
  onCreate: (newInspection: any) => void;
  stores: any[];
  qscStaff: any[];
  checklistTemplates: any[];
}

const CreateInspection: React.FC<Props> = ({
  onCancel,
  onCreate,
  stores,
  qscStaff,
  checklistTemplates,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null);
  const [selectedQscId, setSelectedQscId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<any>(null);
  const [note, setNote] = useState("");

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedStoreId(null);
    setSelectedChecklistId(null);
    setSelectedQscId(null);
    setDueDate(null);
    setNote("");
  };

  const handleNext = () => {
    if (currentStep === 0 && !selectedStoreId)
      return message.error("Vui lòng chọn nhà hàng");
    if (currentStep === 1 && !selectedChecklistId)
      return message.error("Vui lòng chọn biểu mẫu kiểm tra");
    if (currentStep === 2 && (!selectedQscId || !dueDate))
      return message.error("Vui lòng chọn QC và deadline");

    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleCreate = () => {
    const store = stores.find((s) => s.id === selectedStoreId);
    const checklist = checklistTemplates.find((c) => c.id === selectedChecklistId);
    const qsc = qscStaff.find((q) => q.id === selectedQscId);

    const newInspection = {
      id: Date.now(),
      code: `PKT-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      storeId: selectedStoreId,
      storeName: store?.name || "",
      brand: store?.brand || "",
      checklistCode: checklist?.code || "",
      checklistName: checklist?.name || "",
      qscId: selectedQscId,
      qscName: qsc?.name || "",
      status: "Đang kiểm tra",
      createdDate: new Date().toISOString().split("T")[0],
      dueDate: dueDate?.format("YYYY-MM-DD") || "",
      completedDate: null,
      score: null,
      note,
    };

    onCreate(newInspection);
    message.success("Tạo phiếu kiểm tra thành công!");
    resetForm();
    onCancel();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Radio.Group
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            style={{ width: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {stores
                .filter((s) => s.status === "active")
                .map((store) => (
                  <Card
                    key={store.id}
                    hoverable
                    onClick={() => setSelectedStoreId(store.id)}
                    style={{
                      border:
                        selectedStoreId === store.id
                          ? "2px solid #1890ff"
                          : "1px solid #d9d9d9",
                    }}
                  >
                    <Radio value={store.id}>
                      <b>{store.name}</b>{" "}
                      <Tag color="blue" style={{ marginLeft: 8 }}>
                        {store.brand}
                      </Tag>
                    </Radio>
                  </Card>
                ))}
            </Space>
          </Radio.Group>
        );

      case 1:
        return (
          <Radio.Group
            value={selectedChecklistId}
            onChange={(e) => setSelectedChecklistId(e.target.value)}
            style={{ width: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {checklistTemplates.map((tpl) => (
                <Card
                  key={tpl.id}
                  hoverable
                  onClick={() => setSelectedChecklistId(tpl.id)}
                  style={{
                    border:
                      selectedChecklistId === tpl.id
                        ? "2px solid #1890ff"
                        : "1px solid #d9d9d9",
                  }}
                >
                  <Radio value={tpl.id}>
                    <b>{tpl.code}</b> - {tpl.name}
                    <div style={{ color: "#666" }}>{tpl.description}</div>
                    <Space style={{ marginTop: 6 }}>
                      <Tag color="geekblue">{tpl.category}</Tag>
                      <span style={{ fontSize: 12, color: "#666" }}>
                        <FileTextOutlined /> {tpl.items} tiêu chí
                      </span>
                      <span style={{ fontSize: 12, color: "#666" }}>
                        <ClockCircleOutlined /> {tpl.estimateTime}
                      </span>
                    </Space>
                  </Radio>
                </Card>
              ))}
            </Space>
          </Radio.Group>
        );

      case 2:
        return (
          <div>
            <Radio.Group
              value={selectedQscId}
              onChange={(e) => setSelectedQscId(e.target.value)}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {qscStaff.map((qsc) => (
                  <Card
                    key={qsc.id}
                    hoverable
                    onClick={() => setSelectedQscId(qsc.id)}
                    style={{
                      border:
                        selectedQscId === qsc.id
                          ? "2px solid #1890ff"
                          : "1px solid #d9d9d9",
                    }}
                  >
                    <Radio value={qsc.id}>
                      <Row justify="space-between">
                        <Col>
                          <b>{qsc.name}</b>{" "}
                          <Tag color="purple">{qsc.code}</Tag>
                        </Col>
                        <Col style={{ color: "#666", fontSize: 12 }}>
                          Đang làm: {qsc.activeTask} / Hoàn thành:{" "}
                          {qsc.completedTask}
                        </Col>
                      </Row>
                    </Radio>
                  </Card>
                ))}
              </Space>
            </Radio.Group>

            <Divider />

            <DatePicker
              style={{ width: "100%", marginBottom: 16 }}
              placeholder="Chọn deadline"
              format="YYYY-MM-DD"
              value={dueDate}
              onChange={setDueDate}
            />

            <TextArea
              rows={3}
              placeholder="Ghi chú (tuỳ chọn)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card style={{ marginTop: 24 }}>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Chọn nhà hàng" icon={<ShopOutlined />} />
        <Step title="Chọn biểu mẫu" icon={<FileTextOutlined />} />
        <Step title="Phân công QC" icon={<UserOutlined />} />
      </Steps>

      <div style={{ minHeight: 400, maxHeight: 500, overflowY: "auto" }}>
        {renderStepContent()}
      </div>

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => { resetForm(); onCancel(); }}>Hủy</Button>
        <Space>
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)}>Quay lại</Button>
          )}
          {currentStep < 2 ? (
            <Button type="primary" onClick={handleNext}>
              Tiếp theo
            </Button>
          ) : (
            <Button type="primary" onClick={handleCreate}>
              Tạo phiếu
            </Button>
          )}
        </Space>
      </div>
    </Card>
  );
};

export default CreateInspection;
