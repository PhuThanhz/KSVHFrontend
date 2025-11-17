import { Col, Row, Card, Button, Input } from "antd";
import { ProFormText, ProFormDigit, ProForm } from "@ant-design/pro-components";
import { DebounceSelect } from "@/components/admin/debouce.select";
import type { ISelectItem } from "./types";
import ManagerPickerModal from "./ManagerPickerModal";
import { useState } from "react";

interface DeviceSpecsAndManagementProps {
    form: any;
    selectedSupplier: ISelectItem | null;
    setSelectedSupplier: (v: ISelectItem | null) => void;
    selectedCompany: ISelectItem | null;
    setSelectedCompany: (v: ISelectItem | null) => void;
    selectedDepartment: ISelectItem | null;
    setSelectedDepartment: (v: ISelectItem | null) => void;
    selectedManager: ISelectItem | null;
    setSelectedManager: (v: ISelectItem | null) => void;
    fetchSupplierList: (name: string) => Promise<ISelectItem[]>;
    fetchCompanyList: (name: string) => Promise<ISelectItem[]>;
    fetchDepartmentList: (name: string) => Promise<ISelectItem[]>;
    fetchManagerList: (name: string) => Promise<ISelectItem[]>;
    departmentKey?: string | number;
}

const DeviceSpecsAndManagement = ({
    form,
    selectedSupplier,
    setSelectedSupplier,
    selectedCompany,
    setSelectedCompany,
    selectedDepartment,
    setSelectedDepartment,
    selectedManager,
    setSelectedManager,
    fetchSupplierList,
    fetchCompanyList,
    fetchDepartmentList,
    departmentKey,
}: DeviceSpecsAndManagementProps) => {
    const [openManagerPicker, setOpenManagerPicker] = useState(false);

    return (
        <>
            <Card size="small" title="Thông số kỹ thuật" bordered={false} style={{ background: "#fafafa" }}>
                <Row gutter={[16, 8]}>
                    <Col lg={8} md={12} sm={24} xs={24}>
                        <ProFormText label="Nhãn hiệu" name="brand" placeholder="Nhập tên nhãn hiệu" />
                    </Col>
                    <Col lg={8} md={12} sm={24} xs={24}>
                        <ProFormText label="Model" name="modelDesc" placeholder="Nhập số Model" />
                    </Col>
                    <Col lg={8} md={12} sm={24} xs={24}>
                        <ProFormText label="Công suất" name="powerCapacity" placeholder="Nhập công suất" />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormDigit label="Chiều dài (cm)" name="length" min={0} placeholder="Dài" />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormDigit label="Chiều rộng (cm)" name="width" min={0} placeholder="Rộng" />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormDigit label="Chiều cao (cm)" name="height" min={0} placeholder="Cao" />
                    </Col>
                </Row>
            </Card>

            <Card size="small" title="Đơn vị quản lý" bordered={false} style={{ background: "#fafafa" }}>
                <Row gutter={[16, 8]}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item name="supplier" label="Nhà cung cấp" rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}>
                            <DebounceSelect
                                allowClear
                                showSearch
                                placeholder="Chọn nhà cung cấp"
                                fetchOptions={fetchSupplierList}
                                value={selectedSupplier}
                                onChange={(v: any) => setSelectedSupplier(v as ISelectItem)}
                                style={{ width: "100%" }}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item name="company" label="Công ty" rules={[{ required: true, message: "Vui lòng chọn công ty" }]}>
                            <DebounceSelect
                                allowClear
                                showSearch
                                placeholder="Chọn công ty"
                                fetchOptions={fetchCompanyList}
                                value={selectedCompany}
                                onChange={(v: any) => setSelectedCompany(v as ISelectItem)}
                                style={{ width: "100%" }}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item name="department" label="Phòng ban / Nhà hàng" rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}>
                            <DebounceSelect
                                key={departmentKey ?? "no-company"}
                                allowClear
                                showSearch
                                placeholder={selectedCompany ? "Chọn phòng ban / nhà hàng" : "Chọn công ty trước"}
                                fetchOptions={fetchDepartmentList}
                                value={selectedDepartment}
                                onChange={(v: any) => setSelectedDepartment(v as ISelectItem)}
                                style={{ width: "100%" }}
                                disabled={!selectedCompany}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item name="manager" label="Nhân viên quản lý" rules={[{ required: true, message: "Vui lòng chọn nhân viên quản lý" }]}>
                            <Input
                                readOnly
                                placeholder="Chọn nhân viên quản lý"
                                value={selectedManager?.label ?? ""}
                                onClick={() => setOpenManagerPicker(true)}
                                addonAfter={<Button type="link" onClick={() => setOpenManagerPicker(true)}>Chọn</Button>}
                            />
                        </ProForm.Item>

                        <ManagerPickerModal
                            open={openManagerPicker}
                            onClose={() => setOpenManagerPicker(false)}
                            onSelect={(v) => {
                                setSelectedManager(v);
                                form.setFieldsValue({ manager: v });
                            }}
                        />
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default DeviceSpecsAndManagement;