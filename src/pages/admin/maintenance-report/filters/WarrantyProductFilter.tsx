import { Card, Col, DatePicker, Form, Input, Row, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import type { IWarrantyProductFilter } from "@/types/backend";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface IProps {
    value: IWarrantyProductFilter;
    onChange: (filter: IWarrantyProductFilter) => void;
    loading?: boolean;
}

interface IFormValues {
    customerName?: string;
    customerCode?: string;
    city?: string;
    ward?: string;
    deviceType?: string;
    solution?: string;
    dateRange?: [Dayjs, Dayjs];
}

const WarrantyProductFilter = ({ value, onChange, loading }: IProps) => {
    const [form] = Form.useForm<IFormValues>();

    const applyFilter = () => {
        const values = form.getFieldsValue();

        onChange({
            customerCode: values.customerCode?.trim() || undefined,
            customerName: values.customerName?.trim() || undefined,
            city: values.city?.trim() || undefined,
            ward: values.ward?.trim() || undefined,
            deviceType: values.deviceType || undefined,
            solution: values.solution?.trim() || undefined,
            startDate: values.dateRange?.[0]?.format("YYYY-MM-DD"),
            endDate: values.dateRange?.[1]?.format("YYYY-MM-DD"),
        });
    };

    const handleReset = () => {
        form.resetFields();
        onChange({});
    };

    return (
        <Card
            size="small"
            style={{ marginBottom: 16 }}
            title="Bộ lọc báo cáo bảo hành sản phẩm"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    customerCode: value.customerCode,
                    customerName: value.customerName,
                    city: value.city,
                    ward: value.ward,
                    deviceType: value.deviceType,
                    solution: value.solution,
                    dateRange:
                        value.startDate && value.endDate
                            ? [dayjs(value.startDate), dayjs(value.endDate)]
                            : undefined,
                }}
            >
                <Row gutter={12}>
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Mã khách hàng" name="customerCode">
                            <Input allowClear placeholder="Nhập mã khách hàng" />
                        </Form.Item>
                    </Col>

                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Tên khách hàng" name="customerName">
                            <Input allowClear placeholder="Nhập tên khách hàng" />
                        </Form.Item>
                    </Col>

                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Thành phố" name="city">
                            <Input allowClear placeholder="Nhập thành phố" />
                        </Form.Item>
                    </Col>

                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Phường / xã" name="ward">
                            <Input allowClear placeholder="Nhập phường hoặc xã" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Loại thiết bị" name="deviceType">
                            <Select
                                allowClear
                                placeholder="Chọn loại thiết bị"
                            >
                                <Option value="LOAI1">Loại 1</Option>
                                <Option value="LOAI2">Loại 2</Option>
                                <Option value="LOAI3">Loại 3</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Giải pháp / hướng xử lý" name="solution">
                            <Input allowClear placeholder="Nhập từ khóa giải pháp" />
                        </Form.Item>
                    </Col>

                    <Col xl={12} lg={8} md={8}>
                        <Form.Item label="Khoảng thời gian mua / bảo hành" name="dateRange">
                            <RangePicker
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD"
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end" gutter={8}>
                    <Col>
                        <button
                            type="button"
                            style={{
                                padding: "6px 16px",
                                borderRadius: 6,
                                border: "1px solid #ccc",
                                background: "#fff",
                            }}
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Đặt lại
                        </button>
                    </Col>
                    <Col>
                        <button
                            type="button"
                            style={{
                                padding: "6px 20px",
                                borderRadius: 6,
                                background: "#1677ff",
                                color: "#fff",
                                border: "none",
                                fontWeight: 600,
                            }}
                            onClick={applyFilter}
                            disabled={loading}
                        >
                            Áp dụng
                        </button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default WarrantyProductFilter;
