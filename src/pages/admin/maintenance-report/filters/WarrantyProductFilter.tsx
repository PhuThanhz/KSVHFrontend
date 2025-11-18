// src/pages/admin/maintenance-report/filters/WarrantyProductFilter.tsx

import { Card, Form, Row, Col, Input, DatePicker, Button } from "antd";
import type { IWarrantyProductFilter } from "@/types/backend";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface IProps {
    filter: IWarrantyProductFilter;
    onChange: (next: IWarrantyProductFilter) => void;
    loading?: boolean;
}

const WarrantyProductFilter = ({ filter, onChange, loading }: IProps) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        const next: IWarrantyProductFilter = {
            customerName: values.customerName || undefined,

        };
        onChange(next);
    };

    const handleReset = () => {
        form.resetFields();
        onChange({});
    };

    return (
        <Card size="small">
            <Form
                layout="vertical"
                form={form}
                initialValues={filter}
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item label="Mã thiết bị" name="deviceCode">
                            <Input placeholder="Nhập mã thiết bị" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item label="Tên thiết bị" name="deviceName">
                            <Input placeholder="Nhập tên thiết bị" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item label="Khách hàng" name="customerName">
                            <Input placeholder="Nhập tên khách hàng" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item label="Thời gian bảo hành" name="dateRange">
                            <RangePicker format="YYYY-MM-DD" allowClear />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end">
                    <Col>
                        <Button onClick={handleReset} style={{ marginRight: 8 }}>
                            Xóa lọc
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lọc
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default WarrantyProductFilter;
