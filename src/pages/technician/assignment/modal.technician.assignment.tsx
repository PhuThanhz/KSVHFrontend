import { ModalForm, ProFormSelect, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { useRejectTechnicianAssignmentMutation } from "@/hooks/maintenance/useTechnicianAssignments";
import { callFetchRejectReason } from "@/config/api";
import type { IReqRejectAssignmentDTO } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    assignmentId: string | number | null;
}

/** Modal: Kỹ thuật viên từ chối nhận việc */
const ModalRejectAssignment = ({ openModal, setOpenModal, assignmentId }: IProps) => {
    const [form] = Form.useForm();
    const { mutate: rejectAssignment, isPending } = useRejectTechnicianAssignmentMutation();
    const [reasonOptions, setReasonOptions] = useState<{ label: string; value: string | number }[]>([]);

    const fetchReasonList = async (search?: string) => {
        try {
            const query = `page=1&size=100&filter=reasonType='ASSIGNMENT'${search ? ` and reasonName~'${search}'` : ""}`;
            const res = await callFetchRejectReason(query);

            if (res?.data?.result) {
                const options = res.data.result.map((r: any) => ({
                    label: r.reasonName,
                    value: r.id,
                }));
                setReasonOptions(options);
                return options;
            }
            return [];
        } catch {
            console.error("Không thể tải danh sách lý do từ chối");
            return [];
        }
    };

    /** Gửi yêu cầu từ chối */
    const handleSubmit = async (values: IReqRejectAssignmentDTO) => {
        if (!assignmentId) return;

        rejectAssignment(
            { id: assignmentId, payload: values },
            {
                onSuccess: () => {
                    form.resetFields();
                    setOpenModal(false);
                },
                onError: () => {
                    form.resetFields();
                },
            }
        );
    };

    return (
        <ModalForm<IReqRejectAssignmentDTO>
            title="Từ chối nhận việc"
            form={form}
            open={openModal}
            layout="vertical"
            onFinish={handleSubmit}
            modalProps={{
                destroyOnClose: true,
                maskClosable: false,
                width: isMobile ? "100%" : 600,
                confirmLoading: isPending,
                onCancel: () => setOpenModal(false),
                okText: "Xác nhận từ chối",
                cancelText: "Hủy",
            }}
        >
            <ProFormSelect
                name="reasonId"
                label="Lý do từ chối"
                placeholder="Chọn lý do từ chối"
                showSearch
                debounceTime={400}
                request={async ({ keyWords }) => {
                    const list = await fetchReasonList(keyWords || "");
                    return list;
                }}
                options={reasonOptions}
                rules={[{ required: true, message: "Vui lòng chọn lý do từ chối" }]}
            />

            <ProFormTextArea
                name="note"
                label="Ghi chú (nếu chọn 'Khác' thì bắt buộc)"
                placeholder="Nhập ghi chú nếu cần"
                fieldProps={{
                    rows: 4,
                }}
            />
        </ModalForm>
    );
};

export default ModalRejectAssignment;
