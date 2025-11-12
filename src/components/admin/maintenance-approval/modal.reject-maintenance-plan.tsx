import { ModalForm, ProFormSelect, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { callFetchRejectReason } from "@/config/api";
import { useRejectPlanMutation } from "@/hooks/useMaintenanceApprovals";
import type { IReqRejectPlanDTO } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    planId: string | number | null;
    onSuccess?: () => void;
}

const ModalRejectMaintenancePlan = ({ openModal, setOpenModal, planId, onSuccess }: IProps) => {
    const [form] = Form.useForm();
    const [reasonOptions, setReasonOptions] = useState<{ label: string; value: string | number }[]>([]);
    const { mutateAsync: rejectPlan, isPending } = useRejectPlanMutation();

    const fetchReasonList = async (search?: string) => {
        try {
            const query = `page=1&size=100&filter=reasonType='PLAN'${search ? ` and reasonName~'${search}'` : ""
                }`;
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
            console.error("Không thể tải danh sách lý do từ chối kế hoạch");
            return [];
        }
    };

    const handleSubmit = async (values: IReqRejectPlanDTO) => {
        if (!planId) return;
        try {
            await rejectPlan({ planId: String(planId), data: values });
            form.resetFields();
            setOpenModal(false);
            onSuccess?.();
        } catch (err: any) {
        }
    };

    return (
        <ModalForm<IReqRejectPlanDTO>
            title="Từ chối kế hoạch bảo trì"
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
                name="rejectReasonId"
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
                fieldProps={{ rows: 4 }}
            />
        </ModalForm>
    );
};

export default ModalRejectMaintenancePlan;
