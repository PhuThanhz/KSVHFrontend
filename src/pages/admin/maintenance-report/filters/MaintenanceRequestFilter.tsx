import { Card, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import type { IRequestMaintenanceFilter } from "@/types/backend";
import { callFetchCompany, callFetchDepartment } from "@/config/api";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface IProps {
    value: IRequestMaintenanceFilter;
    onChange: (filter: IRequestMaintenanceFilter) => void;
    loading?: boolean;
}

interface IFormValues {
    dateRange?: [Dayjs, Dayjs];
    companyId?: number | string;
    departmentId?: number | string;
    maintenanceType?: string;
    status?: string;
    priorityLevel?: string;
    keyword?: string;
}

const MaintenanceRequestFilter = ({ value, onChange }: IProps) => {
    const [form] = Form.useForm<IFormValues>();

    const [companies, setCompanies] = useState<{ label: string; value: number }[]>([]);
    const [departments, setDepartments] = useState<{ label: string; value: number }[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>();

    /* ======================= FETCH DATA ======================= */
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
        setCompanies(
            res?.data?.result?.map((c: any) => ({
                label: c.name,
                value: c.id,
            })) || []
        );
    };

    const fetchDepartments = async (companyId: number | string) => {
        const res = await callFetchDepartment(`companyId=${companyId}&page=0&size=1000`);
        setDepartments(
            res?.data?.result?.map((d: any) => ({
                label: d.name,
                value: d.id,
            })) || []
        );
    };

    /* ======================= APPLY / RESET ======================= */
    const applyFilter = () => {
        const values = form.getFieldsValue();
        onChange({
            companyName:
                companies.find((x) => x.value === values.companyId)?.label || undefined,
            departmentName:
                departments.find((x) => x.value === values.departmentId)?.label || undefined,
            maintenanceType: values.maintenanceType || undefined,
            status: values.status || undefined,
            priorityLevel: values.priorityLevel || undefined,
            keyword: values.keyword?.trim() || undefined,
            fromDate: values.dateRange?.[0]?.format("YYYY-MM-DD"),
            toDate: values.dateRange?.[1]?.format("YYYY-MM-DD"),
        });
    };

    const handleReset = () => {
        form.resetFields();
        setSelectedCompanyId(undefined);
        onChange({});
    };

    /* ======================= RENDER ======================= */
    return (
        <Card size="small" style={{ marginBottom: 16 }} title="Bộ lọc báo cáo yêu cầu bảo trì">
            <Form form={form} layout="vertical">
                <Row gutter={12}>
                    {/* Công ty */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Công ty" name="companyId">
                            <Select
                                allowClear
                                placeholder="Chọn công ty"
                                options={companies}
                                onChange={(v) => setSelectedCompanyId(v)}
                            />
                        </Form.Item>
                    </Col>

                    {/* Phòng ban */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Phòng ban / Nhà hàng" name="departmentId">
                            <Select
                                allowClear
                                placeholder="Chọn phòng ban"
                                options={departments}
                                disabled={!selectedCompanyId}
                            />
                        </Form.Item>
                    </Col>

                    {/* Loại bảo trì */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Loại bảo trì" name="maintenanceType">
                            <Select allowClear placeholder="Chọn loại bảo trì">
                                <Option value="DOT_XUAT">Đột xuất</Option>
                                <Option value="DINH_KY">Định kỳ</Option>
                                <Option value="SUA_CHUA">Sửa chữa</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Trạng thái */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Trạng thái" name="status">
                            <Select allowClear placeholder="Chọn trạng thái">
                                <Option value="CHO_PHAN_CONG">Chờ phân công</Option>
                                <Option value="DANG_BAO_TRI">Đang bảo trì</Option>
                                <Option value="HOAN_THANH">Hoàn thành</Option>
                                <Option value="HUY">Hủy</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    {/* Mức độ ưu tiên */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Mức độ ưu tiên" name="priorityLevel">
                            <Select allowClear placeholder="Chọn mức độ ưu tiên">
                                <Option value="KHAN_CAP">Khẩn cấp</Option>
                                <Option value="CAO">Cao</Option>
                                <Option value="TRUNG_BINH">Trung bình</Option>
                                <Option value="THAP">Thấp</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Khoảng ngày tạo phiếu */}
                    <Col xl={6} lg={8} md={8}>
                        <Form.Item label="Khoảng ngày tạo phiếu" name="dateRange">
                            <RangePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>

                    {/* Từ khóa */}
                    <Col xl={12} lg={8} md={8}>
                        <Form.Item label="Từ khóa" name="keyword">
                            <Input allowClear placeholder="Mã phiếu / tên thiết bị..." />
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

export default MaintenanceRequestFilter;
