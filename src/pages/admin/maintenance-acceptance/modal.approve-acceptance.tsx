import {
    ModalForm,
    ProFormTextArea
} from "@ant-design/pro-components";
import { Form, Row, Col, Radio, Rate } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { IReqAcceptanceApproveDTO } from "@/types/backend";
import { useApproveAcceptanceMutation } from "@/hooks/useAcceptance";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    requestId?: string | null;
}

const ModalApproveAcceptance = ({ openModal, setOpenModal, requestId }: IProps) => {
    const [form] = Form.useForm();

    const { mutate: approve, isPending } = useApproveAcceptanceMutation();

    const handleReset = () => {
        form.resetFields();
        setOpenModal(false);
    };

    const submit = async (values: IReqAcceptanceApproveDTO) => {
        if (!requestId) return;

        approve(
            {
                requestId,
                payload: values,
            },
            {
                onSuccess: () => handleReset(),
            }
        );
    };

    useEffect(() => {
        if (!openModal) form.resetFields();
    }, [openModal]);

    return (
        <ModalForm
            title="Đồng ý nghiệm thu"
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                maskClosable: false,
                width: isMobile ? "100%" : 600,
                okText: "Xác nhận nghiệm thu",
                cancelText: "Hủy",
                confirmLoading: isPending,
            }}
            form={form}
            onFinish={submit}
            preserve={false}
        >
            <Row gutter={16}>
                {/* Rating sao */}
                <Col span={24}>
                    <Form.Item
                        name="rating"
                        label="Mức độ hài lòng với dịch vụ"
                        rules={[{ required: true, message: "Vui lòng đánh giá" }]}
                    >
                        <Rate allowClear={false} />
                    </Form.Item>
                </Col>

                <Form.Item
                    name="isOnTime"
                    label="Thời gian xử lý có hợp lý?"
                    initialValue={true}
                    rules={[{ required: true }]}
                >
                    <Radio.Group>
                        <Radio value={true}>Có</Radio>
                        <Radio value={false}>Không</Radio>
                    </Radio.Group>
                </Form.Item>


                {/* Kỹ thuật viên chuyên nghiệp */}
                <Col span={24}>
                    <Form.Item
                        name="isProfessional"
                        label="Kỹ thuật viên làm việc chuyên nghiệp?"
                        initialValue={true}
                        rules={[{ required: true }]}
                    >
                        <Radio.Group>
                            <Radio value={true}>Có</Radio>
                            <Radio value={false}>Không</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>

                {/* Thiết bị hoạt động tốt */}
                <Col span={24}>
                    <Form.Item
                        name="isDeviceWorking"
                        label="Thiết bị hoạt động ổn định"
                        initialValue={true}
                        rules={[{ required: true }]}
                    >
                        <Radio.Group>
                            <Radio value={true}>Có</Radio>
                            <Radio value={false}>Không</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>

                {/* Comment */}
                <Col span={24}>
                    <ProFormTextArea
                        name="comment"
                        label="Góp ý thêm (nếu có)"
                        placeholder="Góp ý thêm (nếu có)"
                        fieldProps={{ rows: 3 }}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalApproveAcceptance;
