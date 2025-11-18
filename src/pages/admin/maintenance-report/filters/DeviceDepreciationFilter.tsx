// src/pages/admin/maintenance-report/filters/DeviceDepreciationFilter.tsx

import { Card, Col, DatePicker, Form, Row, Select } from "antd";
import type { IDeviceDepreciationFilter } from "@/types/backend";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface IProps {
    value: IDeviceDepreciationFilter;
    onChange: (value: IDeviceDepreciationFilter) => void;
}

const statusOptions = [
    { label: "Tất cả", value: undefined },
    { label: "Đang hoạt động", value: "Đang hoạt động" },
    { label: "Thanh lý", value: "Thanh lý" },
    { label: "Lưu kho", value: "Lưu kho" },
];

const DeviceDepreciationFilter = ({ value, onChange }: IProps) => {
    const [form] = Form.useForm();

    const handleValuesChange = (_: any, allValues: any) => {
        const range: [Dayjs, Dayjs] | undefined = allValues.dateRange;

        const next: IDeviceDepreciationFilter = {
            ...value,
            companyId: allValues.companyId,
            departmentId: allValues.departmentId,
            deviceTypeId: allValues.deviceTypeId,
            status: allValues.status,
            startDate: range?.[0]?.format("YYYY-MM-DD"),
            endDate: range?.[1]?.format("YYYY-MM-DD"),
        };

        onChange(next);
    };

    const initialDateRange: [Dayjs, Dayjs] | undefined =
        value.startDate && value.endDate
            ? [dayjs(value.startDate), dayjs(value.endDate)]
            : undefined;

    return (
        <Card
            size="small"
            style={{ marginBottom: 16 }}
            title="Bộ lọc khấu hao thiết bị"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    companyId: value.companyId,
                    departmentId: value.departmentId,
                    deviceTypeId: value.deviceTypeId,
                    status: value.status,
                    dateRange: initialDateRange,
                }}
                onValuesChange={handleValuesChange}
            >
                <Row gutter={12}>
                    <Col xl={4} lg={6} md={8} sm={12} xs={24}>
                        <Form.Item label="Công ty" name="companyId">
                            <Select
                                allowClear
                                placeholder="Chọn công ty (ID)"
                                options={[
                                    // Tùy bạn map từ API sang, tạm để trống
                                ]}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>

                    <Col xl={4} lg={6} md={8} sm={12} xs={24}>
                        <Form.Item label="Phòng ban" name="departmentId">
                            <Select
                                allowClear
                                placeholder="Chọn phòng ban (ID)"
                                options={[]}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>

                    <Col xl={4} lg={6} md={8} sm={12} xs={24}>
                        <Form.Item label="Loại thiết bị" name="deviceTypeId">
                            <Select
                                allowClear
                                placeholder="Chọn loại thiết bị"
                                options={[]}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>

                    <Col xl={4} lg={6} md={8} sm={12} xs={24}>
                        <Form.Item label="Trạng thái" name="status">
                            <Select
                                allowClear
                                placeholder="Tất cả trạng thái"
                                options={statusOptions}
                            />
                        </Form.Item>
                    </Col>

                    <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                        <Form.Item label="Khoảng thời gian khấu hao" name="dateRange">
                            <RangePicker
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default DeviceDepreciationFilter;
