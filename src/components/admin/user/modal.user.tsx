import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Switch } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import type { IUser } from "@/types/backend";
import { DebounceSelect } from "../debouce.select";
import { useCreateUserMutation, useUpdateUserMutation } from "@/hooks/useUsers";
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
                role: { label: dataInit.role.name, value: dataInit.role.id },
                active: dataInit.active ?? true,
            });
        } else {
            setSelectedRole(null);
            form.resetFields();
        }
    }, [dataInit, form]);

    const handleReset = () => {
        form.resetFields();
        setSelectedRole(null);
        setDataInit(null);
        setOpenModal(false);
    };

    const submitUser = async (valuesForm: any) => {
        const { name, email, password, address, role, active } = valuesForm;
        const payload: IUser = dataInit?.id
            ? {
                id: dataInit.id,
                name,
                address,
                active,
                role: { id: Number(role?.value) },
            }
            : {
                name,
                email,
                password,
                address,
                role: { id: Number(role?.value) },
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
                    }
                    : {}
            }
        >
            <Row gutter={16}>
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

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText.Password
                        label="Mật khẩu"
                        name="password"
                        disabled={isEdit}
                        rules={[{ required: !isEdit, message: "Vui lòng nhập mật khẩu" }]}
                        placeholder="Nhập mật khẩu"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên hiển thị"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                        placeholder="Nhập tên hiển thị"
                    />
                </Col>

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

                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProFormText
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                        placeholder="Nhập địa chỉ"
                    />
                </Col>

                {isEdit && (
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="active"
                            label="Trạng thái kích hoạt"
                            valuePropName="checked"
                        >
                            <Switch />
                        </ProForm.Item>
                    </Col>
                )}
            </Row>
        </ModalForm>
    );
};

export default ModalUser;
