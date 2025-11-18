// src/pages/admin/maintenance-report/filters/MaintenanceRequestFilter.tsx

import { Form, Input, Button, DatePicker, Row, Col } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect } from "react";
import type { IRequestMaintenanceFilter } from "@/types/backend";

const { RangePicker } = DatePicker;

interface IProps {
    filter: IRequestMaintenanceFilter;
    onChange: (filter: IRequestMaintenanceFilter) => void;
    loading?: boolean;
}

interface IFormValues {
    dateRange?: [Dayjs, Dayjs];
    companyName?: string;
    departmentName?: string;
    maintenanceType?: string;
    status?: string;
    priorityLevel?: string;
    keyword?: string;
}

const MaintenanceRequestFilter = ({ filter, onChange, loading }: IProps) => {
    const [form] = Form.useForm<IFormValues>();

    // Đồng bộ form khi filter bên ngoài thay đổi (ví dụ reset từ parent)
    useEffect(() => {
        const values: IFormValues = {
            companyName: filter.companyName,
            departmentName: filter.departmentName,
            maintenanceType: filter.maintenanceType,
            status: filter.status,
            priorityLevel: filter.priorityLevel,
            keyword: filter.keyword,
            dateRange:
                filter.fromDate && filter.toDate
                    ? [dayjs(filter.fromDate), dayjs(filter.toDate)]
                    : undefined,
        };
        form.setFieldsValue(values);
    }, [filter, form]);

    const handleFinish = (values: IFormValues) => {
        const next: IRequestMaintenanceFilter = {
            companyName: values.companyName?.trim() || undefined,
            departmentName: values.departmentName?.trim() || undefined,
            maintenanceType: values.maintenanceType?.trim() || undefined,
            status: values.status?.trim() || undefined,
            priorityLevel: values.priorityLevel?.trim() || undefined,
            keyword: values.keyword?.trim() || undefined,
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
        <Form<IFormValues>
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            style={{ marginBottom: 16 }}
        >
            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Form.Item label="Khoảng ngày tạo phiếu" name="dateRange">
                        <RangePicker
                            style={{ width: "100%" }}
                            allowEmpty={[true, true]}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item label="Công ty" name="companyName">
                        <Input placeholder="Nhập tên công ty" allowClear />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item label="Phòng ban / Nhà hàng" name="departmentName">
                        <Input placeholder="Nhập phòng ban" allowClear />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Form.Item label="Loại bảo trì" name="maintenanceType">
                        <Input placeholder="Nhập loại bảo trì" allowClear />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item label="Trạng thái" name="status">
                        <Input placeholder="Nhập trạng thái" allowClear />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item label="Mức độ ưu tiên" name="priorityLevel">
                        <Input placeholder="Nhập mức độ ưu tiên" allowClear />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16} align="bottom">
                <Col xs={24} md={16}>
                    <Form.Item label="Từ khóa" name="keyword">
                        <Input placeholder="Mã phiếu / tên thiết bị..." allowClear />
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
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default MaintenanceRequestFilter;
