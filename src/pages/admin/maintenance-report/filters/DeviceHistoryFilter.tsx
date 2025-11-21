// src/pages/admin/maintenance-report/filters/DeviceHistoryFilter.tsx

import { Card, Col, Form, Input, Row, DatePicker, Select } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import type { IDeviceHistoryFilter } from "@/types/backend";
import { callFetchCompany, callFetchDepartment } from "@/config/api";

const { RangePicker } = DatePicker;

interface IProps {
    filter: IDeviceHistoryFilter;
    onChange: (filter: IDeviceHistoryFilter) => void;
}

interface IFormValues {
    deviceCode?: string;
    deviceName?: string;
    companyId?: number;
    departmentId?: number;
    dateRange?: [Dayjs, Dayjs];
}

const DeviceHistoryFilter = ({ filter, onChange }: IProps) => {
    const [form] = Form.useForm<IFormValues>();

    const [companies, setCompanies] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(
        filter.companyName ? Number(filter.companyName) : undefined
    );

    /* ======================= LOAD DATA ======================= */
    useEffect(() => {
        fetchCompanies();
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
        const data = res?.data?.result ?? [];

        setCompanies(
            data.map((c: any) => ({
                label: c.name,
                value: Number(c.id),
                name: c.name,
            }))
        );
    };

    const fetchDepartments = async (companyId: number) => {
        const res = await callFetchDepartment(`companyId=${companyId}&page=0&size=1000`);
        const data = res?.data?.result ?? [];

        setDepartments(
            data.map((d: any) => ({
                label: d.name,
                value: Number(d.id),
                name: d.name,
            }))
        );
    };

    /* ======================= APPLY FILTER ======================= */
    const applyFilter = () => {
        const all = form.getFieldsValue();

        const companyName = companies.find((c) => c.value === all.companyId)?.name;
        const departmentName = departments.find((d) => d.value === all.departmentId)?.name;

        const next: IDeviceHistoryFilter = {
            deviceCode: all.deviceCode?.trim() || undefined,
            deviceName: all.deviceName?.trim() || undefined,
            companyName,
            departmentName,
            fromDate: all.dateRange?.[0]?.format("YYYY-MM-DD"),
            toDate: all.dateRange?.[1]?.format("YYYY-MM-DD"),
        };

        onChange(next);
    };

    /* ======================= RESET ======================= */
    const handleReset = () => {
        form.resetFields();
        setSelectedCompanyId(undefined);
        setDepartments([]);
        onChange({});
    };

    /* ======================= INITIAL DATE ======================= */
    const initialDateRange =
        filter.fromDate && filter.toDate
            ? [dayjs(filter.fromDate), dayjs(filter.toDate)]
            : undefined;

    /* ======================= RENDER ======================= */
    return (
        <Card size="small" style={{ marginBottom: 16 }} title="Bộ lọc lịch sử bảo trì thiết bị">
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    dateRange: initialDateRange,
                }}
            >
                <Row gutter={12}>
                    {/* Mã thiết bị */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Mã thiết bị" name="deviceCode">
                            <Input allowClear placeholder="Nhập mã thiết bị" />
                        </Form.Item>
                    </Col>

                    {/* Tên thiết bị */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Tên thiết bị" name="deviceName">
                            <Input allowClear placeholder="Nhập tên thiết bị" />
                        </Form.Item>
                    </Col>

                    {/* Công ty */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Công ty" name="companyId">
                            <Select
                                allowClear
                                placeholder="Chọn công ty"
                                options={companies}
                                onChange={(v) => {
                                    setSelectedCompanyId(v ?? undefined);
                                }}
                                showSearch
                            />
                        </Form.Item>
                    </Col>

                    {/* Phòng ban */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Phòng ban" name="departmentId">
                            <Select
                                allowClear
                                placeholder="Chọn phòng ban"
                                options={departments}
                                disabled={!selectedCompanyId}
                                showSearch
                            />
                        </Form.Item>
                    </Col>

                    {/* Thời gian */}
                    <Col xl={8} lg={12} md={12}>
                        <Form.Item label="Khoảng thời gian" name="dateRange">
                            <RangePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Buttons */}
                <Row justify="end" gutter={12}>
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

export default DeviceHistoryFilter;
