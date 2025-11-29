import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { IWarehouse } from "@/types/backend";
import { useCreateWarehouseMutation, useUpdateWarehouseMutation } from "@/hooks/useWarehouses";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IWarehouse | null;
    setDataInit: (v: any) => void;
}

const ModalWarehouse = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createWarehouse, isPending: isCreating } = useCreateWarehouseMutation();
    const { mutate: updateWarehouse, isPending: isUpdating } = useUpdateWarehouseMutation();

    /** ================== Auto fill khi mở modal ================== */
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                warehouseName: dataInit.warehouseName,
                address: dataInit.address,
            });
        } else {
            form.resetFields();
        }
    }, [dataInit, form]);

    /** ================== Reset modal ================== */
    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    /** ================== Submit form ================== */
    const submitWarehouse = async (values: any) => {
        const payload: IWarehouse = {
            id: dataInit?.id,
            warehouseName: values.warehouseName,
            address: values.address,
        };

        if (isEdit) {
            updateWarehouse(payload, { onSuccess: () => handleReset() });
        } else {
            createWarehouse(payload, { onSuccess: () => handleReset() });
        }
    };

    return (
        <ModalForm
            title={isEdit ? "Cập nhật kho" : "Tạo mới kho"}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 600,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
                maskClosable: false,
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitWarehouse}
            initialValues={
                dataInit?.id
                    ? {
                        warehouseName: dataInit.warehouseName,
                        address: dataInit.address,
                    }
                    : {}
            }
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText
                        label="Tên kho"
                        name="warehouseName"
                        rules={[{ required: true, message: "Vui lòng nhập tên kho" }]}
                        placeholder="Nhập tên kho"
                    />
                </Col>
                <Col span={24}>
                    <ProFormText
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ kho" }]}
                        placeholder="Nhập địa chỉ kho"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalWarehouse;
