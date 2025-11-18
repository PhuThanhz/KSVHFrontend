// src/pages/admin/maintenance-report/filters/TechnicianActivityFilter.tsx

import { Card, Form, Row, Col, Input, DatePicker, Button } from "antd";
import type { ITechnicianActivityFilter } from "@/types/backend";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface IProps {
    filter: ITechnicianActivityFilter;
    onChange: (next: ITechnicianActivityFilter) => void;
    loading?: boolean;
}

const TechnicianActivityFilter = ({ filter, onChange, loading }: IProps) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        const next: ITechnicianActivityFilter = {

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
                        <Form.Item label="Tên kỹ thuật viên" name="technicianName">
                            <Input placeholder="Nhập tên kỹ thuật viên" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item label="Công ty" name="companyName">
                            <Input placeholder="Nhập công ty" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item label="Phòng ban" name="departmentName">
                            <Input placeholder="Nhập phòng ban" allowClear />
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

export default TechnicianActivityFilter;
