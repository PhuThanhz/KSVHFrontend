import { useState } from "react";
import {
    Modal,
    Select,
    Input,
    Typography,
    Form,
    Spin,
} from "antd";
import { useTechniciansQuery } from "@/hooks/user/useTechnicians";
import { useRequestSupportMutation } from "@/hooks/maintenance/useMaintenanceExecutions";
import { notify } from "@/components/common/notification/notify";

const { TextArea } = Input;
const { Title } = Typography;

interface Props {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId: string | null;
}

const ModalRequestSupport = ({ open, onClose, requestId }: Props) => {
    const [form] = Form.useForm();
    const { data, isFetching } = useTechniciansQuery("page=1&pageSize=100");
    const technicians = data?.result || [];

    const { mutateAsync: requestSupport, isPending } = useRequestSupportMutation();

    /** ==================== SUBMIT ==================== */
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (!requestId) {
                notify.error("Không xác định được phiếu yêu cầu!");
                return;
            }
            await requestSupport({
                requestId,
                data: {
                    supporterId: values.supporterId,
                    reason: values.reason.trim(),
                },
            });
            onClose(false);
            form.resetFields();
        } catch (err: any) {
            if (err?.errorFields) return;
        }
    };

    return (
        <Modal
            open={open}
            title={<Title level={4}>Gửi yêu cầu hỗ trợ</Title>}
            okText="Gửi yêu cầu"
            cancelText="Hủy"
            onCancel={() => {
                form.resetFields();
                onClose(false);
            }}
            confirmLoading={isPending}
            onOk={handleSubmit}
            centered
            destroyOnClose
        >
            {isFetching ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin tip="Đang tải danh sách kỹ thuật viên..." />
                </div>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ supporterId: undefined, reason: "" }}
                >
                    <Form.Item
                        label="Kỹ thuật viên hỗ trợ"
                        name="supporterId"
                        rules={[
                            { required: true, message: "Vui lòng chọn kỹ thuật viên hỗ trợ!" },
                        ]}
                    >
                        <Select
                            placeholder="Chọn kỹ thuật viên"
                            showSearch
                            optionFilterProp="label"
                            options={technicians.map((t) => ({
                                label: `${t.fullName} (${t.phone || "Không có SĐT"})`,
                                value: t.id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Lý do / ghi chú"
                        name="reason"
                        rules={[
                            { required: true, message: "Vui lòng nhập lý do cần hỗ trợ!" },
                            {
                                min: 5,
                                message: "Lý do phải có ít nhất 5 ký tự!",
                            },
                        ]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Nhập lý do cần hỗ trợ..."
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default ModalRequestSupport;
