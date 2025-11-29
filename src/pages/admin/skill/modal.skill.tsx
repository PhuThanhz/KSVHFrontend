import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { ISkill } from "@/types/backend";
import { useCreateSkillMutation, useUpdateSkillMutation } from "@/hooks/useSkills";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ISkill | null;
    setDataInit: (v: any) => void;
}

const ModalSkill = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createSkill, isPending: isCreating } = useCreateSkillMutation();
    const { mutate: updateSkill, isPending: isUpdating } = useUpdateSkillMutation();

    // Reset hoặc set dữ liệu khi mở modal
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                techniqueName: dataInit.techniqueName,
            });
        } else {
            form.resetFields();
        }
    }, [dataInit, form]);

    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    const submitSkill = async (values: any) => {
        const payload: ISkill = {
            id: dataInit?.id,
            techniqueName: values.techniqueName,
        };

        if (isEdit) {
            updateSkill(payload, { onSuccess: () => handleReset() });
        } else {
            createSkill(payload, { onSuccess: () => handleReset() });
        }
    };

    return (
        <ModalForm
            title={isEdit ? "Cập nhật kỹ năng" : "Tạo mới kỹ năng"}
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
            onFinish={submitSkill}
            initialValues={
                dataInit?.id
                    ? { techniqueName: dataInit.techniqueName }
                    : {}
            }
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText
                        label="Tên kỹ năng"
                        name="techniqueName"
                        rules={[{ required: true, message: "Vui lòng nhập tên kỹ năng" }]}
                        placeholder="Nhập tên kỹ năng"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalSkill;
