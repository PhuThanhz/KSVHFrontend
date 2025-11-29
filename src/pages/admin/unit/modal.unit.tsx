import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { IUnit } from "@/types/backend";
import { useCreateUnitMutation, useUpdateUnitMutation } from "@/hooks/useUnits";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUnit | null;
    setDataInit: (v: any) => void;
}

const ModalUnit = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createUnit, isPending: isCreating } = useCreateUnitMutation();
    const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnitMutation();

    /** ================== Auto-fill khi mở modal ================== */
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                name: dataInit.name,
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
    const submitUnit = async (values: any) => {
        const payload: IUnit = {
            id: dataInit?.id,
            name: values.name,
        };

        if (isEdit) {
            updateUnit(payload, { onSuccess: () => handleReset() });
        } else {
            createUnit(payload, { onSuccess: () => handleReset() });
        }
    };

    return (
        <ModalForm
            title={isEdit ? "Cập nhật đơn vị" : "Tạo mới đơn vị"}
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
            onFinish={submitUnit}
            /** ✅ Auto-fill khi update */
            initialValues={
                dataInit?.id
                    ? {
                        name: dataInit.name,
                    }
                    : {}
            }
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText
                        label="Tên đơn vị"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên đơn vị" }]}
                        placeholder="Nhập tên đơn vị"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalUnit;
