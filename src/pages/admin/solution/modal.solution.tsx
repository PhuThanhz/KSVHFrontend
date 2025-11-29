import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { ISolution } from "@/types/backend";
import { useCreateSolutionMutation, useUpdateSolutionMutation } from "@/hooks/useSolutions";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ISolution | null;
    setDataInit: (v: any) => void;
}

const ModalSolution = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createSolution, isPending: isCreating } = useCreateSolutionMutation();
    const { mutate: updateSolution, isPending: isUpdating } = useUpdateSolutionMutation();

    /** ================== Gán dữ liệu khi mở modal ================== */
    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                solutionName: dataInit.solutionName,
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
    const submitSolution = async (values: any) => {
        const payload: ISolution = {
            id: dataInit?.id,
            solutionName: values.solutionName,
        };

        if (isEdit) {
            updateSolution(payload, { onSuccess: () => handleReset() });
        } else {
            createSolution(payload, { onSuccess: () => handleReset() });
        }
    };

    return (
        <ModalForm
            title={isEdit ? "Cập nhật phương án xử lý" : "Tạo mới phương án xử lý"}
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
            onFinish={submitSolution}
            initialValues={
                dataInit?.id
                    ? { solutionName: dataInit.solutionName }
                    : {}
            }
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText
                        label="Tên phương án xử lý"
                        name="solutionName"
                        rules={[{ required: true, message: "Vui lòng nhập tên phương án xử lý" }]}
                        placeholder="Nhập tên phương án"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalSolution;
