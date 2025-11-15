import { ModalForm, ProFormSelect, ProFormTextArea } from "@ant-design/pro-components";
import { Form } from "antd";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import type { IReqAcceptanceRejectDTO } from "@/types/backend";
import { callFetchRejectReason } from "@/config/api";
import { useRejectAcceptanceMutation } from "@/hooks/useAcceptance";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    requestId: string | number | null;
    onSuccess?: () => void;
}

const ModalRejectAcceptance = ({
    openModal,
    setOpenModal,
    requestId,
    onSuccess,
}: IProps) => {
    const [form] = Form.useForm();
    const [reasonOptions, setReasonOptions] = useState<
        { label: string; value: string | number }[]
    >([]);

    const { mutateAsync: rejectAcceptance, isPending } = useRejectAcceptanceMutation();

    /** Load danh sách lý do từ chối */
    const fetchReasonList = async (search?: string) => {
        try {
            const query = `page=1&size=100&filter=reasonType='ACCEPTANCE'${search ? ` and reasonName~'${search}'` : ""
                }`;

            const res = await callFetchRejectReason(query);

            if (res?.data?.result) {
                const list = res.data.result.map((r: any) => ({
                    label: r.reasonName,
                    value: r.id,
                }));
                setReasonOptions(list);
                return list;
            }
            return [];
        } catch {
            return [];
        }
    };

    /** Submit */
    const handleSubmit = async (values: IReqAcceptanceRejectDTO) => {
        if (!requestId) return;

        try {
            await rejectAcceptance({
                requestId: String(requestId),
                payload: {
                    rejectReasonId: values.rejectReasonId,
                    note: values.note,
                },
            });

            form.resetFields();
            setOpenModal(false);
            onSuccess?.();
        } catch { }
    };

    return (
        <ModalForm<IReqAcceptanceRejectDTO>
            title="Từ chối nghiệm thu"
            open={openModal}
            form={form}
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
            {/* Lý do từ chối */}
            <ProFormSelect
                name="rejectReasonId"
                label="Lý do từ chối"
                placeholder="Chọn lý do từ chối"
                showSearch
                debounceTime={400}
                request={async ({ keyWords }) => {
                    return await fetchReasonList(keyWords || "");
                }}
                options={reasonOptions}
                rules={[{ required: true, message: "Vui lòng chọn lý do từ chối" }]}
            />

            {/* Ghi chú */}
            <ProFormTextArea
                name="note"
                label="Ghi chú"
                placeholder="Nhập ghi chú nếu cần"
                fieldProps={{ rows: 4 }}
            />
        </ModalForm>
    );
};

export default ModalRejectAcceptance;
