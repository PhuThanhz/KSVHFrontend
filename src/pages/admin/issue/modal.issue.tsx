import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { IIssue } from "@/types/backend";
import {
    useCreateIssueMutation,
    useUpdateIssueMutation,
} from "@/hooks/useIssues";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IIssue | null;
    setDataInit: (v: any) => void;
}

const ModalIssue = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createIssue, isPending: isCreating } = useCreateIssueMutation();
    const { mutate: updateIssue, isPending: isUpdating } = useUpdateIssueMutation();

    /** ==================== Set dữ liệu khi mở modal ==================== */
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                issueName: dataInit.issueName,
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
    const handleSubmit = async (values: IIssue) => {
        const payload: IIssue = {
            ...values,
            id: dataInit?.id,
        };

        if (isEdit) {
            updateIssue(payload, { onSuccess: handleReset });
        } else {
            createIssue(payload, { onSuccess: handleReset });
        }
    };

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật vấn đề" : "Tạo mới vấn đề"}
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
            onFinish={handleSubmit}
            initialValues={
                dataInit?.id
                    ? {
                        issueName: dataInit.issueName,
                    }
                    : {}
            }
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText
                        label="Tên vấn đề"
                        name="issueName"
                        rules={[{ required: true, message: "Vui lòng nhập tên vấn đề" }]}
                        placeholder="Nhập tên vấn đề"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalIssue;
