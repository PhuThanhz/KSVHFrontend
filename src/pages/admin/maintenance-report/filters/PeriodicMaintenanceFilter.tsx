// src/pages/admin/maintenance-report/filters/PeriodicMaintenanceFilter.tsx

import { Card, Form, Row, Col, Input, DatePicker, Button } from "antd";
import type { IPeriodicMaintenanceFilter } from "@/types/backend";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface IProps {
    filter: IPeriodicMaintenanceFilter;
    onChange: (next: IPeriodicMaintenanceFilter) => void;
    loading?: boolean;
}

const PeriodicMaintenanceFilter = ({ filter, onChange, loading }: IProps) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        const next: IPeriodicMaintenanceFilter = {
            companyId: values.companyId || undefined,
            departmentId: values.departmentId || undefined,
            deviceCode: values.deviceCode || undefined,
            deviceName: values.deviceName || undefined,

            startDate: values.dateRange
                ? dayjs(values.dateRange[0]).format("YYYY-MM-DD")
                : undefined,
            endDate: values.dateRange
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
                        <Form.Item label="Công ty" name="companyId">
                            <Input placeholder="Nhập ID công ty" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item label="Phòng ban" name="departmentId">
                            <Input placeholder="Nhập ID phòng ban" allowClear />
                        </Form.Item>
                    </Col>

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

export default PeriodicMaintenanceFilter;
