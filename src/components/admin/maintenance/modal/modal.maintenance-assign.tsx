import { useState } from "react";
import { Modal, Select, Button, Form, message } from "antd";
import { useAssignTechnicianManualMutation } from "@/hooks/useMaintenanceRequests";
import { useQuery } from "@tanstack/react-query";
import { callFetchEmployee } from "@/config/api";

const { Option } = Select;

interface ModalAssignTechnicianProps {
    open: boolean;
    requestId: string | null;
    onClose: () => void;
    onSuccess?: () => void;
}

const ModalAssignTechnician = ({
    open,
    requestId,
    onClose,
    onSuccess,
}: ModalAssignTechnicianProps) => {
    const [form] = Form.useForm();
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const { mutateAsync: assignTechnician } = useAssignTechnicianManualMutation();

    // Fetch danh sách kỹ thuật viên
    const { data: employees, isLoading } = useQuery({
        queryKey: ["technicians"],
        queryFn: async () => {
            const res = await callFetchEmployee("page=1&pageSize=100&role=TECHNICIAN");
            return res.data?.result ?? [];
        },
    });

    const handleSubmit = async (values: { technicianId: string }) => {
        if (!requestId) return;
        try {
            setLoadingSubmit(true);
            await assignTechnician({ requestId, technicianId: values.technicianId });
            message.success("Gán kỹ thuật viên thành công");
            onSuccess?.();
            onClose();
        } catch (err: any) {
            message.error(err.message || "Không thể gán kỹ thuật viên");
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Phân công kỹ thuật viên"
            onCancel={onClose}
            footer={null}
            width={400}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Chọn kỹ thuật viên"
                    name="technicianId"
                    rules={[{ required: true, message: "Vui lòng chọn kỹ thuật viên" }]}
                >
                    <Select
                        showSearch
                        loading={isLoading}
                        placeholder="Chọn kỹ thuật viên"
                        optionFilterProp="children"
                    >
                        {employees?.map((item: any) => (
                            <Option key={item.id} value={item.id}>
                                {item.fullName} ({item.employeeCode})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loadingSubmit}
                    >
                        {loadingSubmit ? "Đang gán..." : "Xác nhận gán"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAssignTechnician;
