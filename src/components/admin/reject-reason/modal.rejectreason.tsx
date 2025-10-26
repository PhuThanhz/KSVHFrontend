import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { IRejectReason } from "@/types/backend";
import { useCreateRejectReasonMutation, useUpdateRejectReasonMutation } from "@/hooks/useRejectReasons";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IRejectReason | null;
    setDataInit: (v: any) => void;
}

const ModalRejectReason = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createReason, isPending: isCreating } = useCreateRejectReasonMutation();
    const { mutate: updateReason, isPending: isUpdating } = useUpdateRejectReasonMutation();

    /** ================== Gán dữ liệu khi mở modal ================== */
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                reasonType: dataInit.reasonType,
                reasonName: dataInit.reasonName,
                description: dataInit.description,
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
    const submitRejectReason = async (values: any) => {
        const payload: IRejectReason = {
            id: dataInit?.id,
            reasonType: values.reasonType,
            reasonName: values.reasonName,
            description: values.description,
        };

        if (isEdit) {
            updateReason(payload, { onSuccess: () => handleReset() });
        } else {
            createReason(payload, { onSuccess: () => handleReset() });
        }
    };

    return (
        <ModalForm
            title={isEdit ? "Cập nhật lý do từ chối" : "Tạo mới lý do từ chối"}
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
            onFinish={submitRejectReason}
            initialValues={
                dataInit?.id
                    ? {
                        reasonType: dataInit.reasonType,
                        reasonName: dataInit.reasonName,
                        description: dataInit.description,
                    }
                    : {}
            }
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSelect
                        label="Loại lý do"
                        name="reasonType"
                        rules={[{ required: true, message: "Vui lòng chọn loại lý do" }]}
                        placeholder="Chọn loại lý do"
                        options={[
                            { label: "Phân công (ASSIGNMENT)", value: "ASSIGNMENT" },
                            { label: "Kế hoạch (PLAN)", value: "PLAN" },
                            { label: "Nghiệm thu (ACCEPTANCE)", value: "ACCEPTANCE" },
                        ]}
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên lý do"
                        name="reasonName"
                        rules={[{ required: true, message: "Vui lòng nhập tên lý do" }]}
                        placeholder="Nhập tên lý do"
                    />
                </Col>

                <Col span={24}>
                    <ProFormTextArea
                        label="Mô tả chi tiết"
                        name="description"
                        placeholder="Nhập mô tả chi tiết (nếu có)"
                        fieldProps={{ rows: 3 }}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalRejectReason;
