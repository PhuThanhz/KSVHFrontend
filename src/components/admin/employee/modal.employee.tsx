import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Select } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { IEmployee } from "@/types/backend";
import {
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
} from "@/hooks/useEmployees";
import { callFetchCompany, callFetchDepartment, callFetchPosition } from "@/config/api";
import { DebounceSelect } from "../debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IEmployee | null;
    setDataInit: (v: any) => void;
}

export interface ISelectItem {
    label: string;
    value: number | string;
}

const ModalEmployee = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createEmployee, isPending: isCreating } = useCreateEmployeeMutation();
    const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployeeMutation();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                employeeCode: dataInit.employeeCode,
                fullName: dataInit.fullName,
                phone: dataInit.phone,
                email: dataInit.email,
                company: {
                    label: dataInit.company?.name,
                    value: dataInit.company?.id,
                },
                department: {
                    label: dataInit.department?.name,
                    value: dataInit.department?.id,
                },
                position: {
                    label: dataInit.position?.name,
                    value: dataInit.position?.id,
                },
            });
        } else {
            form.resetFields();
        }
    }, [dataInit, form]);

    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    const submitEmployee = async (values: any) => {
        const payload = {
            employeeCode: values.employeeCode,
            fullName: values.fullName,
            phone: values.phone,
            email: values.email,
            departmentId: Number(values.department.value),
            positionId: Number(values.position.value),
            companyId: Number(values.company.value),
        };

        if (isEdit && dataInit?.id) {
            updateEmployee(
                { id: dataInit.id, payload },
                { onSuccess: () => handleReset() }
            );
        } else {
            createEmployee(payload, { onSuccess: () => handleReset() });
        }
    };

    async function fetchCompanyList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchCompany(`page=1&size=100&name=/${name}/i`);
        return res?.data?.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
        })) || [];
    }

    async function fetchDepartmentList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchDepartment(`page=1&size=100&name=/${name}/i`);
        return res?.data?.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
        })) || [];
    }

    async function fetchPositionList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchPosition(`page=1&size=100&name=/${name}/i`);
        return res?.data?.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
        })) || [];
    }

    return (
        <ModalForm
            title={isEdit ? "Cập nhật nhân viên" : "Tạo mới nhân viên"}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 700,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
                maskClosable: false,
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitEmployee}
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
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Email"
                        name="email"
                        placeholder="Nhập email"
                    />
                </Col>

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
                        />
                    </ProForm.Item>
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProForm.Item
                        name="department"
                        label="Phòng ban"
                        rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn phòng ban"
                            fetchOptions={fetchDepartmentList}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>

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
            </Row>
        </ModalForm>
    );
};

export default ModalEmployee;
