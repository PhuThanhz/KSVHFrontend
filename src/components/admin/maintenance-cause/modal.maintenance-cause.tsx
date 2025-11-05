import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { IMaintenanceCause } from "@/types/backend";
import {
    useCreateMaintenanceCauseMutation,
    useUpdateMaintenanceCauseMutation,
} from "@/hooks/useMaintenanceCause";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IMaintenanceCause | null;
    setDataInit: (v: any) => void;
}

const ModalMaintenanceCause = ({
    openModal,
    setOpenModal,
    dataInit,
    setDataInit,
}: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createCause, isPending: isCreating } =
        useCreateMaintenanceCauseMutation();
    const { mutate: updateCause, isPending: isUpdating } =
        useUpdateMaintenanceCauseMutation();

    /** ==================== Prefill dữ liệu khi mở modal ==================== */
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                causeName: dataInit.causeName,
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
    const submitMaintenanceCause = async (valuesForm: any) => {
        const payload: IMaintenanceCause = dataInit?.id
            ? {
                id: dataInit.id,
                causeName: valuesForm.causeName,
            }
            : {
                causeName: valuesForm.causeName,
            };

        if (isEdit) {
            updateCause(payload, { onSuccess: () => handleReset() });
        } else {
            createCause(payload, { onSuccess: () => handleReset() });
        }

        return true;
    };

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật nguyên nhân hư hỏng" : "Tạo mới nguyên nhân hư hỏng"}
            open={openModal}
            modalProps={{
                onCancel: () => handleReset(),
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 600,
                keyboard: false,
                maskClosable: false,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitMaintenanceCause}
            initialValues={
                dataInit?.id
                    ? {
                        ...dataInit,
                    }
                    : {}
            }
        >
            <Row gutter={16}>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProFormText
                        label="Tên nguyên nhân"
                        name="causeName"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên nguyên nhân hư hỏng" },
                        ]}
                        placeholder="Nhập tên nguyên nhân hư hỏng"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalMaintenanceCause;
