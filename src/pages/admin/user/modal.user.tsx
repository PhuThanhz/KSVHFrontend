import { useEffect, useState } from "react";
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
} from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import type { IUser } from "@/types/backend";
import { DebounceSelect } from "@/components/common/debouce.select";
import { useCreateUserMutation, useUpdateUserMutation } from "@/hooks/user/useUsers";
import { callFetchRole } from "@/config/api";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
}

export interface IRoleSelect {
    label?: string;
    value: string | number;
    key?: string | number;
}

const ModalUser = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [selectedRole, setSelectedRole] = useState<IRoleSelect | null>(null);
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createUser, isPending: isCreating } = useCreateUserMutation();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();

    /** Prefill form khi edit */
    useEffect(() => {
        if (dataInit?.id && dataInit.role) {
            const roleItem = {
                label: dataInit.role.name,
                value: dataInit.role.id,
                key: dataInit.role.id,
            };
            setSelectedRole(roleItem);

            form.setFieldsValue({
                email: dataInit.email,
                name: dataInit.name,
                address: dataInit.address,
                role: roleItem,
                accountType: dataInit.accountTypeDisplay || "",
            });
        } else {
            setSelectedRole(null);
            form.resetFields();
        }
    }, [dataInit, form]);

    /** Reset modal */
    const handleReset = () => {
        form.resetFields();
        setSelectedRole(null);
        setDataInit(null);
        setOpenModal(false);
    };

    /** Gọi API create / update */
    const submitUser = async (valuesForm: any) => {
        const { name, email, password, address, role, accountType } = valuesForm;

        const payload: IUser = dataInit?.id
            ? {
                id: dataInit.id,
                name,
                address,
                role: { id: Number(role?.value) },
                accountTypeDisplay: accountType, // dùng cho update
            }
            : {
                name,
                email,
                password,
                address,
                role: { id: Number(role?.value) },
                accountTypeDisplay: accountType, // dùng cho create
            };

        if (isEdit) {
            updateUser(payload, {
                onSuccess: () => handleReset(),
            });
        } else {
            createUser(payload, {
                onSuccess: () => handleReset(),
            });
        }
    };

    /** Lấy danh sách vai trò */
    async function fetchRoleList(name: string): Promise<IRoleSelect[]> {
        const res = await callFetchRole(`page=1&size=100&name=/${name}/i`);
        if (res?.data) {
            return res.data.result.map((item: any) => ({
                label: item.name,
                value: item.id,
            }));
        }
        return [];
    }

    return (
        <ModalForm
            title={isEdit ? "Cập nhật User" : "Tạo mới User"}
            open={openModal}
            modalProps={{
                onCancel: () => handleReset(),
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 700,
                keyboard: false,
                maskClosable: false,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitUser}
            initialValues={
                dataInit?.id
                    ? {
                        ...dataInit,
                        role: {
                            label: dataInit.role?.name,
                            value: dataInit.role?.id,
                        },
                        accountType: dataInit.accountTypeDisplay || "",
                    }
                    : {}
            }
        >
            <Row gutter={[16, 8]}>
                {/* Email */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Email"
                        name="email"
                        disabled={isEdit}
                        rules={[
                            { required: !isEdit, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}
                        placeholder="Nhập email"
                    />
                </Col>

                {/* Mật khẩu */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText.Password
                        label="Mật khẩu"
                        name="password"
                        disabled={isEdit}
                        rules={[{ required: !isEdit, message: "Vui lòng nhập mật khẩu" }]}
                        placeholder="Nhập mật khẩu"
                    />
                </Col>

                {/* Tên hiển thị */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên hiển thị"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                        placeholder="Nhập tên hiển thị"
                    />
                </Col>

                {/* Vai trò */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProForm.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn vai trò"
                            fetchOptions={fetchRoleList}
                            value={selectedRole as any}
                            onChange={(newValue: any) =>
                                setSelectedRole(newValue as IRoleSelect)
                            }
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>

                {/* Loại tài khoản */}
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSelect
                        label="Loại tài khoản"
                        name="accountType"
                        placeholder="Chọn loại tài khoản"
                        rules={[{ required: true, message: "Vui lòng chọn loại tài khoản" }]}
                        options={[
                            { label: "Quản trị hệ thống", value: "ADMIN_SYSTEM" },
                            { label: "Quản trị chi nhánh", value: "ADMIN_SUB" },
                            { label: "Nhân viên", value: "EMPLOYEE" },
                            { label: "Kỹ thuật viên", value: "TECHNICIAN" },
                            { label: "Khách hàng", value: "CUSTOMER" },
                        ]}
                    />
                </Col>

                {/* Địa chỉ */}
                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProFormText
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                        placeholder="Nhập địa chỉ"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalUser;
