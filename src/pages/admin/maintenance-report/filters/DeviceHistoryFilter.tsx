// src/pages/admin/maintenance-report/filters/DeviceHistoryFilter.tsx

import { Form, Input, Button, DatePicker, Row, Col } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { IDeviceHistoryFilter } from "@/types/backend";
import { useEffect } from "react";

const { RangePicker } = DatePicker;

interface IProps {
    filter: IDeviceHistoryFilter;
    onChange: (filter: IDeviceHistoryFilter) => void;
    loading?: boolean;
}

interface IFormValues {
    deviceCode?: string;
    deviceName?: string;
    companyName?: string;
    departmentName?: string;
    dateRange?: [Dayjs, Dayjs];
}

const DeviceHistoryFilter = ({ filter, onChange, loading }: IProps) => {
    const [form] = Form.useForm<IFormValues>();

    // đồng bộ filter -> form
    useEffect(() => {
        form.setFieldsValue({
            deviceCode: filter.deviceCode,
            deviceName: filter.deviceName,
            companyName: filter.companyName,
            departmentName: filter.departmentName,
            dateRange:
                filter.fromDate && filter.toDate
                    ? [dayjs(filter.fromDate), dayjs(filter.toDate)]
                    : undefined,
        });
    }, [filter, form]);

    const handleFinish = (values: IFormValues) => {
        const next: IDeviceHistoryFilter = {
            deviceCode: values.deviceCode?.trim() || undefined,
            deviceName: values.deviceName?.trim() || undefined,
            companyName: values.companyName?.trim() || undefined,
            departmentName: values.departmentName?.trim() || undefined,
            fromDate: values.dateRange?.[0]
                ? values.dateRange[0].format("YYYY-MM-DD")
                : undefined,
            toDate: values.dateRange?.[1]
                ? values.dateRange[1].format("YYYY-MM-DD")
                : undefined,
        };

        onChange(next);
    };

    const handleReset = () => {
        form.resetFields();
        onChange({});
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Form.Item label="Mã thiết bị" name="deviceCode">
                        <Input placeholder="Nhập mã thiết bị" allowClear />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item label="Tên thiết bị" name="deviceName">
                        <Input placeholder="Nhập tên thiết bị" allowClear />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item label="Khoảng ngày bảo trì" name="dateRange">
                        <RangePicker
                            style={{ width: "100%" }}
                            allowEmpty={[true, true]}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Form.Item label="Công ty" name="companyName">
                        <Input placeholder="Nhập tên công ty" allowClear />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item label="Phòng ban" name="departmentName">
                        <Input placeholder="Nhập phòng ban" allowClear />
                    </Form.Item>
                </Col>

                <Col
                    xs={24}
                    md={8}
                    style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button onClick={handleReset}>Xóa bộ lọc</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default DeviceHistoryFilter;
