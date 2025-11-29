import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import type { IMaterialSupplier } from "@/types/backend";
import {
    useCreateMaterialSupplierMutation,
    useUpdateMaterialSupplierMutation,
} from "@/hooks/useMaterialSuppliers";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IMaterialSupplier | null;
    setDataInit: (v: any) => void;
}

const ModalMaterialSupplier = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createSupplier, isPending: isCreating } = useCreateMaterialSupplierMutation();
    const { mutate: updateSupplier, isPending: isUpdating } = useUpdateMaterialSupplierMutation();

    // local state giữ dữ liệu hiện tại (đảm bảo initialValues hoạt động đúng)
    const [currentSupplier, setCurrentSupplier] = useState<IMaterialSupplier | null>(null);

    /** ==================== Set dữ liệu khi mở modal ==================== */
    useEffect(() => {
        if (dataInit?.id) {
            setCurrentSupplier(dataInit);
            form.setFieldsValue({
                supplierCode: dataInit.supplierCode,
                supplierName: dataInit.supplierName,
                representative: dataInit.representative,
                phone: dataInit.phone,
                email: dataInit.email,
                address: dataInit.address,
            });
        } else {
            setCurrentSupplier(null);
            form.resetFields();
        }
    }, [dataInit, form]);

    /** ==================== Reset modal ==================== */
    const handleReset = () => {
        form.resetFields();
        setCurrentSupplier(null);
        setDataInit(null);
        setOpenModal(false);
    };

    /** ==================== Submit form ==================== */
    const handleSubmit = async (values: IMaterialSupplier) => {
        const payload: IMaterialSupplier = {
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
            title={isEdit ? "Cập nhật nhà cung cấp vật tư" : "Tạo mới nhà cung cấp vật tư"}
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
            // ✅ Dùng initialValues để đảm bảo form tự fill ngay khi mở
            initialValues={
                currentSupplier
                    ? {
                        supplierCode: currentSupplier.supplierCode,
                        supplierName: currentSupplier.supplierName,
                        representative: currentSupplier.representative,
                        phone: currentSupplier.phone,
                        email: currentSupplier.email,
                        address: currentSupplier.address,
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
                        name="supplierName"
                        rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp" }]}
                        placeholder="Nhập tên nhà cung cấp"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Người đại diện"
                        name="representative"
                        placeholder="Nhập tên người đại diện"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText label="Số điện thoại" name="phone" placeholder="Nhập số điện thoại" />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText label="Email" name="email" placeholder="Nhập email" />
                </Col>

                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProFormText label="Địa chỉ" name="address" placeholder="Nhập địa chỉ nhà cung cấp" />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalMaterialSupplier;
