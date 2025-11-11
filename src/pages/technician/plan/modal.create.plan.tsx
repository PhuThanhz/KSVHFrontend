import {
    ModalForm,
    ProFormTextArea,
    ProFormSwitch,
    ProFormList,
    ProFormText,
    ProFormCheckbox,
} from "@ant-design/pro-components";
import { Form, Spin } from "antd";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useCreateMaintenancePlanMutation } from "@/hooks/useMaintenancePlans";
import {
    callFetchSurveyedMaintenanceDetail,
    callFetchSolution,
} from "@/config/api";
import type { IReqMaintenancePlanDTO, ISolution } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    maintenanceRequestId?: string | null;
}

// ✅ mở rộng type cho form (thêm 2 field readonly)
type MaintenancePlanFormValues = IReqMaintenancePlanDTO & {
    readonlyRequestCode?: string;
    readonlyDeviceCode?: string;
};

const ModalCreateMaintenancePlan = ({
    openModal,
    setOpenModal,
    maintenanceRequestId,
}: IProps) => {
    const [form] = Form.useForm<MaintenancePlanFormValues>();
    const { mutate: createPlan, isPending } = useCreateMaintenancePlanMutation();
    const [loading, setLoading] = useState(false);
    const [solutionOptions, setSolutionOptions] = useState<
        { label: string; value: number | string }[]
    >([]);
    const [useMaterial, setUseMaterial] = useState(false);

    const fetchSolutions = async () => {
        try {
            const res = await callFetchSolution("page=1&size=50&sort=createdAt,asc");
            if (res?.data?.result) {
                const options = res.data.result.map((s: ISolution) => ({
                    label: s.solutionName,
                    value: s.id!,
                }));
                setSolutionOptions(options);
            }
        } catch {
            console.error("Không thể tải danh sách phương án");
        }
    };

    useEffect(() => {
        const fetchDetail = async () => {
            if (!maintenanceRequestId || !openModal) return;
            try {
                setLoading(true);
                const res = await callFetchSurveyedMaintenanceDetail(maintenanceRequestId);
                if (res?.data) {
                    const { requestCode, device } = res.data;
                    form.setFieldsValue({
                        maintenanceRequestId,
                        note: "",
                    });
                    // ✅ 2 field chỉ để hiển thị
                    form.setFieldValue("readonlyRequestCode", requestCode);
                    form.setFieldValue("readonlyDeviceCode", device?.deviceCode);
                }
            } catch (err) {
                console.error("Không thể tải chi tiết phiếu khảo sát", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSolutions();
        fetchDetail();
    }, [maintenanceRequestId, openModal, form]);

    const handleSubmit = async (values: MaintenancePlanFormValues) => {
        if (!maintenanceRequestId) return;

        const payload: IReqMaintenancePlanDTO = {
            maintenanceRequestId,
            solutionIds: values.solutionIds || [],
            customSolution: values.customSolution || "",
            useMaterial: values.useMaterial || false,
            note: values.note || "",
            materials: values.useMaterial ? values.materials || [] : [],
        };

        createPlan(payload, {
            onSuccess: () => {
                form.resetFields();
                setUseMaterial(false);
                setOpenModal(false);
            },
        });
    };

    return (
        <ModalForm<MaintenancePlanFormValues>
            key={maintenanceRequestId}
            title="Lập kế hoạch bảo trì"
            open={openModal}
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            modalProps={{
                destroyOnClose: true,
                maskClosable: false,
                width: isMobile ? "100%" : 900,
                confirmLoading: isPending,
                onCancel: () => setOpenModal(false),
                okText: "Lưu kế hoạch",
                cancelText: "Hủy",
            }}
        >
            <Spin spinning={loading}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <ProFormText name="readonlyRequestCode" label="Mã phiếu khảo sát" readonly />
                    <ProFormText name="readonlyDeviceCode" label="Mã thiết bị" readonly />
                </div>

                <ProFormCheckbox.Group
                    name="solutionIds"
                    label="Chọn phương án"
                    options={solutionOptions}
                    rules={[{ required: true, message: "Vui lòng chọn ít nhất một phương án" }]}
                />

                <ProFormTextArea
                    name="customSolution"
                    label="Phương án khác"
                    placeholder="Nhập phương án khác (nếu có)"
                    fieldProps={{ rows: 2 }}
                />

                <ProFormSwitch
                    name="useMaterial"
                    label="Có sử dụng vật tư"
                    tooltip="Bật nếu kế hoạch có vật tư thay thế"
                    fieldProps={{
                        onChange: (checked) => setUseMaterial(checked),
                    }}
                />

                {useMaterial && (
                    <ProFormList
                        name="materials"
                        label="Danh sách vật tư"
                        creatorButtonProps={{
                            position: "bottom",
                            creatorButtonText: "Thêm vật tư",
                        }}
                        copyIconProps={false}
                    >
                        <div className="grid grid-cols-5 gap-2">
                            <ProFormText name="partCode" label="Mã vật tư" />
                            <ProFormText name="partName" label="Tên vật tư" />
                            <ProFormText name="quantity" label="Số lượng" />
                            <ProFormSwitch name="isNewProposal" label="Đề xuất mới" />
                            <ProFormSwitch name="isShortage" label="Thiếu vật tư" />
                        </div>
                    </ProFormList>
                )}

                <ProFormTextArea
                    name="note"
                    label="Ghi chú"
                    placeholder="Nhập ghi chú nếu có"
                    fieldProps={{ rows: 3 }}
                />
            </Spin>
        </ModalForm>
    );
};

export default ModalCreateMaintenancePlan;
