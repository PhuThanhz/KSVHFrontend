import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import type { IEmployee } from "@/types/backend";
import {
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
} from "@/hooks/user/useEmployees";
import {
    callFetchCompany,
    callFetchDepartment,
    callFetchPosition,
    callFetchEmployee,
} from "@/config/api";
import { DebounceSelect } from "../../../components/common/debouce.select";
import { useState } from "react";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IEmployee | null;
    setDataInit: (v: any) => void;
}

export interface ISelectItem {
    key?: string;
    label: React.ReactNode;
    value: string | number;
}

const ModalEmployee = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    // Nếu có dữ liệu sẵn thì dùng id công ty đó, nếu không thì null
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
        dataInit?.company?.id ? Number(dataInit.company.id) : null
    );

    const { mutate: createEmployee, isPending: isCreating } = useCreateEmployeeMutation();
    const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployeeMutation();

    /** ==================== Submit form ==================== */
    const submitEmployee = async (values: any) => {
        const payload = {
            id: dataInit?.id,
            employeeCode: values.employeeCode,
            fullName: values.fullName,
            phone: values.phone,
            email: values.email,
            companyId: Number(values.company?.value),
            departmentId: Number(values.department?.value),
            positionId: Number(values.position?.value),
            supervisorId: values.supervisor?.value ?? null,      // ← THÊM VÀO ĐÂY
        };

        if (isEdit && dataInit?.id) {
            updateEmployee(payload, {
                onSuccess: () => handleClose(),
            });
        } else {
            createEmployee(payload, {
                onSuccess: () => handleClose(),
            });
        }
    };

    /** ==================== Đóng modal ==================== */
    const handleClose = () => {
        setDataInit(null);
        setOpenModal(false);
        form.resetFields();
        setSelectedCompanyId(null);
    };

    /** ==================== Fetch danh sách chọn ==================== */
    async function fetchCompanyList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchCompany(`page=1&size=100&name=/${name}/i`);
        return (
            res?.data?.result?.map((item: any) => ({
                label: item.name,
                value: item.id,
            })) || []
        );
    }

    async function fetchDepartmentList(name: string): Promise<ISelectItem[]> {
        if (!selectedCompanyId) return [];
        const res = await callFetchDepartment(
            `page=1&size=100&name=/${name}/i&companyId=${selectedCompanyId}`
        );
        const list =
            res?.data?.result?.map((item: any) => ({
                label: item.name,
                value: item.id,
            })) || [];
        return list.length ? list : [];
    }

    async function fetchPositionList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchPosition(`page=1&size=100&name=/${name}/i`);
        return (
            res?.data?.result?.map((item: any) => ({
                label: item.name,
                value: item.id,
            })) || []
        );
    }

    /** ==================== Fetch Supervisor ==================== */
    async function fetchSupervisorList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchEmployee(`page=1&size=100&fullName=/${name}/i`);

        return (
            res?.data?.result
                ?.filter((emp: any) => emp.id !== dataInit?.id) // không cho tự chọn chính mình
                ?.map((item: any) => ({
                    label: item.fullName,
                    value: item.id,
                })) || []
        );
    }

    /** ==================== Khi chọn công ty ==================== */
    const handleCompanyChange = (value: any) => {
        const companyId = value?.value ? Number(value.value) : null;
        setSelectedCompanyId(companyId);
        // reset phòng ban khi đổi công ty
        form.setFieldsValue({ department: undefined });
    };

    /** ==================== Dữ liệu khởi tạo ==================== */
    const initialValues = isEdit
        ? {
            employeeCode: dataInit?.employeeCode,
            fullName: dataInit?.fullName,
            phone: dataInit?.phone,
            email: dataInit?.email,
            company: dataInit?.company
                ? { label: dataInit.company.name, value: dataInit.company.id }
                : undefined,
            department: dataInit?.department
                ? { label: dataInit.department.name, value: dataInit.department.id }
                : undefined,
            position: dataInit?.position
                ? { label: dataInit.position.name, value: dataInit.position.id }
                : undefined,
            supervisor: dataInit?.supervisor
                ? {
                    label: dataInit.supervisor.fullName,
                    value: dataInit.supervisor.id,
                }
                : undefined,                                  // ← THÊM INITIAL VALUES
        }
        : {};

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật nhân viên" : "Tạo mới nhân viên"}
            open={openModal}
            form={form}
            onFinish={submitEmployee}
            initialValues={initialValues}
            modalProps={{
                onCancel: handleClose,
                afterClose: () => form.resetFields(),
                destroyOnClose: true,
                width: isMobile ? "100%" : 700,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
                maskClosable: false,
            }}
            scrollToFirstError
            preserve={false}
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Mã nhân viên"
                        name="employeeCode"
                        disabled={isEdit}
                        rules={[{ required: true, message: "Vui lòng nhập mã nhân viên" }]}
                        placeholder="Nhập mã nhân viên"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                        placeholder="Nhập họ và tên"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Số điện thoại"
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Email"
                        name="email"
                        placeholder="Nhập email"
                        rules={[{ required: true, message: "Vui lòng nhập email" }]}
                    />
                </Col>

                {/* Chọn công ty */}
                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProForm.Item
                        name="company"
                        label="Công ty"
                        rules={[{ required: true, message: "Vui lòng chọn công ty" }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn công ty"
                            fetchOptions={fetchCompanyList}
                            style={{ width: "100%" }}
                            onChange={handleCompanyChange}
                        />
                    </ProForm.Item>
                </Col>

                {/* Chọn phòng ban */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProForm.Item
                        name="department"
                        label="Phòng ban"
                        rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
                    >
                        <DebounceSelect
                            key={selectedCompanyId ?? "no-company"}
                            allowClear
                            showSearch
                            placeholder={
                                selectedCompanyId
                                    ? "Chọn phòng ban"
                                    : "Chọn công ty trước"
                            }
                            fetchOptions={fetchDepartmentList}
                            style={{ width: "100%" }}
                            disabled={!selectedCompanyId}
                        />
                    </ProForm.Item>
                </Col>

                {/* Chức vụ */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProForm.Item
                        name="position"
                        label="Chức vụ"
                        rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn chức vụ"
                            fetchOptions={fetchPositionList}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>

                {/* Người quản lý */}
                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProForm.Item
                        name="supervisor"
                        label="Người quản lý"
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn người quản lý"
                            fetchOptions={fetchSupervisorList}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalEmployee;
