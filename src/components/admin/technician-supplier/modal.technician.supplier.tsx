import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { ITechnicianSupplier } from "@/types/backend";
import {
    useCreateTechnicianSupplierMutation,
    useUpdateTechnicianSupplierMutation,
} from "@/hooks/useTechnicianSuppliers";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ITechnicianSupplier | null;
    setDataInit: (v: any) => void;
}

const ModalTechnicianSupplier = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createSupplier, isPending: isCreating } = useCreateTechnicianSupplierMutation();
    const { mutate: updateSupplier, isPending: isUpdating } = useUpdateTechnicianSupplierMutation();

    /** ==================== Set dữ liệu khi mở modal ==================== */
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                supplierCode: dataInit.supplierCode,
                name: dataInit.name,
                phone: dataInit.phone,
                email: dataInit.email,
                address: dataInit.address,
            });
        } else {
            form.resetFields();
        }
    }, [dataInit, form]);

    /** ==================== Reset modal ==================== */
    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    /** ==================== Submit form ==================== */
    const handleSubmit = async (values: ITechnicianSupplier) => {
        const payload: ITechnicianSupplier = {
            ...values,
            id: dataInit?.id,
        };

        if (isEdit) {
            updateSupplier(payload, { onSuccess: handleReset });
        } else {
            createSupplier(payload, { onSuccess: handleReset });
        }
    };

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật nhà cung cấp kỹ thuật viên" : "Tạo mới nhà cung cấp kỹ thuật viên"}
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
            onFinish={handleSubmit}
            initialValues={
                dataInit?.id
                    ? {
                        supplierCode: dataInit.supplierCode,
                        name: dataInit.name,
                        phone: dataInit.phone,
                        email: dataInit.email,
                        address: dataInit.address,
                    }
                    : {}
            }
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Mã nhà cung cấp"
                        name="supplierCode"
                        disabled={isEdit}
                        rules={[{ required: true, message: "Vui lòng nhập mã nhà cung cấp" }]}
                        placeholder="Nhập mã nhà cung cấp"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên nhà cung cấp"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp" }]}
                        placeholder="Nhập tên nhà cung cấp"
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
                    <ProFormText
                        label="Địa chỉ"
                        name="address"
                        placeholder="Nhập địa chỉ nhà cung cấp"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalTechnicianSupplier;
