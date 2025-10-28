import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useMemo } from "react";
import type { ICustomer } from "@/types/backend";
import {
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
} from "@/hooks/useCustomers";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICustomer | null;
    setDataInit: (v: any) => void;
}

const ModalCustomer = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createCustomer, isPending: isCreating } = useCreateCustomerMutation();
    const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomerMutation();

    /** ==================== Đóng modal & reset ==================== */
    const handleClose = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    /** ==================== Dữ liệu ban đầu cho Form ==================== */
    const initialValues = useMemo(() => {
        if (!dataInit) return {};
        return {
            customerCode: dataInit.customerCode || "",
            name: dataInit.name || "",
            phone: dataInit.phone || "",
            email: dataInit.email || "",
            address: dataInit.address || "",
        };
    }, [dataInit]);

    /** ==================== Submit Form ==================== */
    const submitCustomer = async (values: any) => {
        const payload = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
        };

        if (isEdit && dataInit?.id) {
            updateCustomer(
                { id: dataInit.id, ...payload },
                { onSuccess: () => handleClose() }
            );
        } else {
            createCustomer(payload, { onSuccess: () => handleClose() });
        }
    };

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật khách hàng" : "Thêm mới khách hàng"}
            open={openModal}
            form={form}
            initialValues={initialValues}
            onFinish={submitCustomer}
            scrollToFirstError
            preserve={false}
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
        >
            <Row gutter={16}>
                {isEdit && (
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Mã khách hàng"
                            name="customerCode"
                            disabled
                            placeholder="Tự động sinh"
                        />
                    </Col>
                )}

                <Col lg={isEdit ? 12 : 24} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên khách hàng"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
                        placeholder="Nhập tên khách hàng"
                    />
                </Col>

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
                    <ProFormText
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                pattern: /^(0|\+84)(\d{9,10})$/,
                                message: "Số điện thoại không hợp lệ",
                            },
                        ]}
                        placeholder="Nhập số điện thoại"
                    />
                </Col>

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

export default ModalCustomer;
