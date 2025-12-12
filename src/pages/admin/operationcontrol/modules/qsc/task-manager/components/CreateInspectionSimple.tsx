import React, { useState } from "react";
import { Card, Select, Button, Input, message, Tag, Row, Space, Form } from "antd";
import { ShopOutlined, FileTextOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  onCancel: () => void;
  onCreate: (newInspection: any) => void;
  stores: any[];
  checklistTemplates: any[];
}

const CreateInspectionSimple: React.FC<Props> = ({
  onCancel,
  onCreate,
  stores,
  checklistTemplates,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const { selectedStoreId, selectedChecklistId, note } = values;

      const store = stores.find((s) => s.id === selectedStoreId);
      const checklist = checklistTemplates.find((c) => c.id === selectedChecklistId);

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
        qscId: null,
        qscName: null,
        status: "Chờ phân công",
        createdDate: new Date().toISOString().split("T")[0],
        dueDate: null,
        completedDate: null,
        score: null,
        note,
      };

      setLoading(true);
      // Simulate async operation
      setTimeout(() => {
        onCreate(newInspection);
        message.success("Tạo phiếu kiểm tra mới thành công!");
        setLoading(false);
        form.resetFields();
      }, 1000);
    } catch (error) {
      message.error("Vui lòng điền đầy đủ thông tin!");
    }
  };

  return (
    <Card
      title={
        <span style={{ fontWeight: 600, fontSize: 18, color: "#1890ff" }}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          Tạo phiếu kiểm tra
        </span>
      }
      style={{
        marginTop: 24,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: 600,
        margin: "24px auto",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          selectedStoreId: null,
          selectedChecklistId: null,
          note: "",
        }}
      >
        <Form.Item
          label={
            <span style={{ fontWeight: 500, fontSize: 16 }}>
              <ShopOutlined style={{ marginRight: 8, color: "#52c41a" }} />
              Nhà hàng <span style={{ color: "red" }}>*</span>
            </span>
          }
          name="selectedStoreId"
          rules={[{ required: true, message: "Vui lòng chọn nhà hàng!" }]}
          style={{ marginBottom: 24 }}
        >
          <Select
            showSearch
            placeholder="Chọn nhà hàng"
            style={{ width: "100%" }}
            filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {stores
              .filter((s) => s.status === "active")
              .map((store) => (
                <Option key={store.id} value={store.id}>
                  {store.name} <Tag color="blue" style={{ marginLeft: 8 }}>{store.brand}</Tag>
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <span style={{ fontWeight: 500, fontSize: 16 }}>
              <FileTextOutlined style={{ marginRight: 8, color: "#faad14" }} />
              Biểu mẫu <span style={{ color: "red" }}>*</span>
            </span>
          }
          name="selectedChecklistId"
          rules={[{ required: true, message: "Vui lòng chọn biểu mẫu!" }]}
          style={{ marginBottom: 24 }}
        >
          <Select
            placeholder="Chọn biểu mẫu kiểm tra"
            style={{ width: "100%" }}
          >
            {checklistTemplates.map((tpl) => (
              <Option key={tpl.id} value={tpl.id}>
                {tpl.code} - {tpl.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 500, fontSize: 16 }}>Ghi chú</span>}
          name="note"
          style={{ marginBottom: 32 }}
        >
          <TextArea
            rows={4}
            placeholder="Ghi chú thêm (tuỳ chọn)"
            style={{ borderRadius: 6 }}
          />
        </Form.Item>

        <Row justify="end">
          <Space>
            <Button onClick={onCancel} size="large">
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={handleCreate}
              loading={loading}
              size="large"
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            >
              Tạo phiếu
            </Button>
          </Space>
        </Row>
      </Form>
    </Card>
  );
};

export default CreateInspectionSimple;
