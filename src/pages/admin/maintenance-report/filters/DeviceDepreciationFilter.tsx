import { Card, Col, DatePicker, Form, Row, Select } from "antd";
import type { IDeviceDepreciationFilter } from "@/types/backend";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import {
    callFetchCompany,
    callFetchDepartment,
    callFetchDeviceType,
} from "@/config/api";

const { RangePicker } = DatePicker;

interface IProps {
    value: IDeviceDepreciationFilter;
    onChange: (value: IDeviceDepreciationFilter) => void;
}

const statusOptions = [
    { label: "Tất cả", value: undefined },
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Thanh lý", value: "LIQUIDATED" },
    { label: "Lưu kho", value: "STORAGE" },
];

const DeviceDepreciationFilter = ({ value, onChange }: IProps) => {
    const [form] = Form.useForm();

    const [companies, setCompanies] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [deviceTypes, setDeviceTypes] = useState<any[]>([]);

    const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(
        value.companyId != null ? Number(value.companyId) : undefined
    );
    /* ============================================================
     * LOAD INITIAL DATA
     * ============================================================ */
    useEffect(() => {
        fetchCompanies();
        fetchDeviceTypes();
    }, []);

    useEffect(() => {
        if (selectedCompanyId) {
            fetchDepartments(selectedCompanyId);
        } else {
            setDepartments([]);
            form.setFieldsValue({ departmentId: undefined });
        }
    }, [selectedCompanyId]);

    const fetchCompanies = async () => {
        const res = await callFetchCompany("page=0&size=1000");
        setCompanies(res?.data?.result?.map((c: any) => ({
            label: c.name,
            value: c.id,
        })) || []);
    };

    const fetchDepartments = async (companyId: number | string) => {
        const res = await callFetchDepartment(`companyId=${companyId}&page=0&size=1000`);
        setDepartments(res?.data?.result?.map((d: any) => ({
            label: d.name,
            value: d.id,
        })) || []);
    };

    const fetchDeviceTypes = async () => {
        const res = await callFetchDeviceType("page=0&size=1000");
        setDeviceTypes(res?.data?.result?.map((t: any) => ({
            label: t.typeName,
            value: t.id,
        })) || []);
    };

    const initialDateRange: [Dayjs, Dayjs] | undefined =
        value.startDate && value.endDate
            ? [dayjs(value.startDate), dayjs(value.endDate)]
            : undefined;

    /* ============================================================
     * APPLY FILTERS
     * ============================================================ */
    const applyFilter = () => {
        const allValues = form.getFieldsValue();
        const range = allValues.dateRange;

        onChange({
            companyId: allValues.companyId,
            departmentId: allValues.departmentId,
            deviceTypeId: allValues.deviceTypeId,
            status: allValues.status,
            startDate: range?.[0]?.format("YYYY-MM-DD"),
            endDate: range?.[1]?.format("YYYY-MM-DD"),
        });
    };

    /* ============================================================
     * RENDER
     * ============================================================ */
    return (
        <Card size="small" style={{ marginBottom: 16 }} title="Bộ lọc báo cáo khấu hao thiết bị">
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
            >
                <Row gutter={12}>
                    {/* Công ty */}
                    <Col xl={4} lg={6} md={8} sm={12}>
                        <Form.Item label="Công ty" name="companyId">
                            <Select
                                allowClear
                                placeholder="Chọn công ty"
                                options={companies}
                                onChange={(v) => {
                                    setSelectedCompanyId(v);
                                }}
                            />
                        </Form.Item>
                    </Col>

                    {/* Phòng ban */}
                    <Col xl={4} lg={6} md={8} sm={12}>
                        <Form.Item label="Phòng ban" name="departmentId">
                            <Select
                                allowClear
                                placeholder="Chọn phòng ban"
                                options={departments}
                                disabled={!selectedCompanyId}
                            />
                        </Form.Item>
                    </Col>

                    {/* Loại thiết bị */}
                    <Col xl={4} lg={6} md={8} sm={12}>
                        <Form.Item label="Loại thiết bị" name="deviceTypeId">
                            <Select allowClear placeholder="Chọn loại thiết bị" options={deviceTypes} />
                        </Form.Item>
                    </Col>

                    {/* Trạng thái */}
                    <Col xl={4} lg={6} md={8} sm={12}>
                        <Form.Item label="Trạng thái" name="status">
                            <Select allowClear placeholder="Chọn trạng thái" options={statusOptions} />
                        </Form.Item>
                    </Col>

                    {/* Khoảng thời gian */}
                    <Col xl={8} lg={12} md={12} sm={24}>
                        <Form.Item label="Khoảng thời gian đưa vào sử dụng" name="dateRange">
                            <RangePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Buttons */}
                <Row justify="end" gutter={12} style={{ marginTop: 8 }}>
                    <Col>
                        <button
                            type="button"
                            style={{
                                padding: "6px 16px",
                                borderRadius: 6,
                                border: "1px solid #ccc",
                                background: "#fff",
                            }}
                            onClick={() => {
                                form.resetFields();
                                setSelectedCompanyId(undefined);
                                onChange({
                                    companyId: undefined,
                                    departmentId: undefined,
                                    deviceTypeId: undefined,
                                    status: undefined,
                                    startDate: undefined,
                                    endDate: undefined,
                                });
                            }}
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
                        >
                            Áp dụng
                        </button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default DeviceDepreciationFilter;
