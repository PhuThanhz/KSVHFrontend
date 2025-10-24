import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import type { IPermission } from "@/types/backend";
import { ALL_MODULES } from "@/config/permissions";
import { useEffect } from "react";
import {
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
} from "@/hooks/usePermissions";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IPermission | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalPermission = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    // 🟢 React Query mutation hooks
    const createPermission = useCreatePermissionMutation();
    const updatePermission = useUpdatePermissionMutation();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue(dataInit);
        }
    }, [dataInit]);

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    const submitPermission = async (valuesForm: any) => {
        const { name, apiPath, method, module } = valuesForm;

        const payload: IPermission = { name, apiPath, method, module };

        if (dataInit?.id) {
            // Cập nhật
            await updatePermission.mutateAsync(
                { permission: payload, id: dataInit.id },
                {
                    onSuccess: () => {
                        handleReset();
                        reloadTable();
                    },
                }
            );
        } else {
            //  Tạo mới
            await createPermission.mutateAsync(payload, {
                onSuccess: () => {
                    handleReset();
                    reloadTable();
                },
            });
        }
    };

    return (
        <ModalForm
            title={dataInit?.id ? "Cập nhật Permission" : "Tạo mới Permission"}
            open={openModal}
            form={form}
            onFinish={submitPermission}
            initialValues={dataInit?.id ? dataInit : {}}
            scrollToFirstError
            preserve={false}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 900,
                keyboard: false,
                maskClosable: false,
                okText: dataInit?.id ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading:
                    createPermission.isPending || updatePermission.isPending,
            }}
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên Permission"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                        placeholder="Nhập name"
                    />
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="API Path"
                        name="apiPath"
                        rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
                        placeholder="Nhập path"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSelect
                        name="method"
                        label="Method"
                        valueEnum={{
                            GET: "GET",
                            POST: "POST",
                            PUT: "PUT",
                            PATCH: "PATCH",
                            DELETE: "DELETE",
                        }}
                        placeholder="Chọn method"
                        rules={[{ required: true, message: "Vui lòng chọn method!" }]}
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSelect
                        name="module"
                        label="Thuộc Module"
                        valueEnum={ALL_MODULES}
                        placeholder="Chọn module"
                        rules={[{ required: true, message: "Vui lòng chọn module!" }]}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalPermission;
