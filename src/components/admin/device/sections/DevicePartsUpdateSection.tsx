import React from "react";
import { Input, InputNumber, Button, Form, Typography, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export type PartRow = { partCode: string; partName: string; quantity: number };

interface IProps {
    value?: PartRow[];
    onChange?: (v: PartRow[]) => void;
}

const { Title, Text } = Typography;

const DevicePartsUpdateSection: React.FC<IProps> = ({ value = [], onChange }) => {
    const parts = Array.isArray(value) ? value : [];

    const onChangeRow = (idx: number, key: keyof PartRow, val: string | number) => {
        const next = parts.map((p, i) =>
            i === idx ? { ...p, [key]: key === "quantity" ? Number(val || 1) : String(val) } : p
        );
        onChange?.(next);
    };

    const addRow = () => onChange?.([...parts, { partCode: "", partName: "", quantity: 1 }]);
    const removeRow = (idx: number) => {
        const next = parts.filter((_, i) => i !== idx);
        onChange?.(next);
    };

    return (
        <div className="ant-card ant-card-bordered" style={{ padding: 20 }}>
            <Title level={5} style={{ marginBottom: 16 }}>
                Linh kiện / Vật tư
            </Title>

            {parts.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "12px 0",
                        color: "#999",
                        border: "1px dashed #ddd",
                        borderRadius: 6,
                        marginBottom: 12,
                    }}
                >
                    Chưa có linh kiện nào
                </div>
            )}

            {parts.map((row, idx) => (
                <div
                    key={idx}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gap: 16,
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <div style={{ gridColumn: "span 5" }}>
                        <Form.Item
                            label={<Text strong>Mã linh kiện</Text>}
                            style={{ marginBottom: 8 }}
                        >
                            <Input
                                placeholder="Nhập mã linh kiện"
                                value={row.partCode}
                                onChange={(e) => onChangeRow(idx, "partCode", e.target.value)}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ gridColumn: "span 5" }}>
                        <Form.Item
                            label={<Text strong>Tên linh kiện</Text>}
                            style={{ marginBottom: 8 }}
                        >
                            <Input
                                placeholder="Nhập tên linh kiện"
                                value={row.partName}
                                onChange={(e) => onChangeRow(idx, "partName", e.target.value)}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                        <Form.Item
                            label={<Text strong>Số lượng</Text>}
                            style={{ marginBottom: 8 }}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: "100%" }}
                                value={row.quantity}
                                onChange={(val) => onChangeRow(idx, "quantity", val || 1)}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ gridColumn: "span 12" }}>
                        <Button
                            type="link"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => removeRow(idx)}
                        >
                            Xóa dòng này
                        </Button>
                        <Divider style={{ margin: "8px 0" }} />
                    </div>
                </div>
            ))}

            <Button
                block
                icon={<PlusOutlined />}
                onClick={addRow}
                style={{
                    marginTop: 8,
                    borderStyle: "dashed",
                    height: 40,
                }}
            >
                Thêm linh kiện
            </Button>
        </div>
    );
};

export default DevicePartsUpdateSection;
