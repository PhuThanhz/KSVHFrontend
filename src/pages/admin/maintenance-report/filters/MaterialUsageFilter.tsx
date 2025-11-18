// src/pages/admin/maintenance-report/filters/MaterialUsageFilter.tsx

import { Card, Form, Row, Col, Input, DatePicker, Select, Button } from "antd";
import dayjs from "dayjs";
import type { IMaterialUsageFilter } from "@/types/backend";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface IProps {
    filter: IMaterialUsageFilter;
    onChange: (next: IMaterialUsageFilter) => void;
    loading?: boolean;
}

const MaterialUsageFilter = ({ filter, onChange, loading }: IProps) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        const next: IMaterialUsageFilter = {
            materialType: values.materialType || undefined,
            warehouseName: values.warehouseName || undefined,
            unitName: values.unitName || undefined,
            fromDate: values.dateRange
                ? dayjs(values.dateRange[0]).format("YYYY-MM-DD")
                : undefined,
            toDate: values.dateRange
                ? dayjs(values.dateRange[1]).format("YYYY-MM-DD")
                : undefined,
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
                        <Form.Item label="Loại vật tư" name="materialType">
                            <Input placeholder="Nhập loại vật tư" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item label="Kho" name="warehouseName">
                            <Input placeholder="Nhập tên kho" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item label="Đơn vị" name="unitName">
                            <Input placeholder="Nhập đơn vị tính" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item label="Khoảng thời gian" name="dateRange">
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
                            Lọc dữ liệu
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default MaterialUsageFilter;
