import {
    ModalForm,
    ProFormTextArea,
    ProFormSwitch,
    ProFormText,
    ProFormCheckbox,
} from "@ant-design/pro-components";
import { Form, Spin } from "antd";
import { useEffect, useState, useMemo } from "react";
import { isMobile } from "react-device-detect";
import {
    useCreateMaintenancePlanMutation,
    useReplanMaintenanceMutation,
} from "@/hooks/maintenance/useMaintenancePlans";
import {
    callFetchSurveyedMaintenanceDetail,
    callFetchSolution,
    callFetchInventoryItem,
} from "@/config/api";
import type {
    IReqMaintenancePlanDTO,
    ISolution,
    IResMaintenanceSurveyedDetailDTO,
    IInventoryItem,
    IReqMaintenancePlanMaterialItemDTO,
} from "@/types/backend";
import MaterialListForm from "./MaterialListForm";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    maintenanceRequestId?: string | null;
}

/** Type riêng cho form vật tư */
type IFormMaterialItem = IReqMaintenancePlanMaterialItemDTO & {
    tag?: string;
};

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
    const { mutate: createPlan, isPending: creating } = useCreateMaintenancePlanMutation();
    const { mutate: replan, isPending: replanning } = useReplanMaintenanceMutation();

    const [loading, setLoading] = useState(false);
    const [solutionOptions, setSolutionOptions] = useState<{ label: string; value: number | string }[]>([]);
    const [inventoryOptions, setInventoryOptions] = useState<IInventoryItem[]>([]);
    const [useMaterial, setUseMaterial] = useState(false);
    const [detail, setDetail] = useState<IResMaintenanceSurveyedDetailDTO | null>(null);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    /** Lấy danh sách phương án */
    useEffect(() => {
        const fetchSolutions = async () => {
            try {
                const res = await callFetchSolution("page=1&size=50&sort=createdAt,asc");
                if (res?.data?.result) {
                    setSolutionOptions(
                        res.data.result.map((s: ISolution) => ({
                            label: s.solutionName,
                            value: s.id!,
                        }))
                    );
                }
            } catch {
                console.error("Không thể tải danh sách phương án");
            }
        };
        fetchSolutions();
    }, []);

    /** Lấy danh sách vật tư kho */
    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const res = await callFetchInventoryItem("page=1&size=200&sort=createdAt,asc");
                if (res?.data?.result) setInventoryOptions(res.data.result);
            } catch {
                console.error("Không thể tải danh sách vật tư kho");
            }
        };
        fetchInventoryItems();
    }, []);

    /** Lấy chi tiết phiếu khảo sát */
    useEffect(() => {
        const fetchDetail = async () => {
            if (!maintenanceRequestId || !openModal || !inventoryOptions.length) return;
            try {
                setLoading(true);
                const res = await callFetchSurveyedMaintenanceDetail(maintenanceRequestId);
                if (res?.data) {
                    const data = res.data;
                    setDetail(data);
                    const { requestCode, device, planInfo } = data;

                    form.setFieldsValue({
                        maintenanceRequestId,
                        readonlyRequestCode: requestCode,
                        readonlyDeviceCode: device?.deviceCode,
                    });

                    if (planInfo) {
                        // Map lại vật tư
                        const mappedMaterials: IFormMaterialItem[] = (planInfo.materials || []).map((m) => {
                            const matchedItem = inventoryOptions.find(
                                (i) => i.itemCode === m.partCode
                            );
                            return {
                                ...m,
                                inventoryItemId: matchedItem?.id ? Number(matchedItem.id) : null,
                                tag: m.isNewProposal
                                    ? "Mua bổ sung"
                                    : m.isShortage
                                        ? "Thiếu"
                                        : "Có sẵn",
                            };
                        });

                        form.setFieldsValue({
                            solutionIds: planInfo.solutionIds || [],
                            customSolution: planInfo.customSolution || "",
                            useMaterial: planInfo.useMaterial || false,
                            note: planInfo.note || "",
                            materials: mappedMaterials,
                        });

                        setUseMaterial(!!planInfo.useMaterial);
                    } else {
                        form.resetFields(["solutionIds", "customSolution", "note", "materials"]);
                        setUseMaterial(false);
                    }
                }
            } catch (err) {
                console.error("Không thể tải chi tiết phiếu khảo sát", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [maintenanceRequestId, openModal, inventoryOptions.length]);

    /** Gửi dữ liệu */
    const handleSubmit = async (values: MaintenancePlanFormValues) => {
        if (!maintenanceRequestId) return;

        const payload: IReqMaintenancePlanDTO = {
            maintenanceRequestId,
            solutionIds: values.solutionIds || [],
            customSolution: values.customSolution || "",
            useMaterial: values.useMaterial || false,
            note: values.note || "",
            materials: values.useMaterial
                ? (values.materials as IReqMaintenancePlanMaterialItemDTO[]) || []
                : [],
        };

        const isRejected = detail?.status === "TU_CHOI_PHE_DUYET";
        const planId = detail?.planInfo?.planId;

        const onSuccess = () => {
            form.resetFields();
            setUseMaterial(false);
            setOpenModal(false);
        };

        if (isRejected && planId) replan({ planId, payload }, { onSuccess });
        else createPlan(payload, { onSuccess });
    };

    const selectOptions = useMemo(
        () =>
            inventoryOptions.map((item) => ({
                label: item.itemCode,
                value: item.id!,
                item,
            })),
        [inventoryOptions]
    );

    /** UI */
    return (
        <ModalForm<MaintenancePlanFormValues>
            key={maintenanceRequestId}
            title={detail?.status === "TU_CHOI_PHE_DUYET" ? "Lập lại kế hoạch bảo trì" : "Lập kế hoạch bảo trì"}
            open={openModal}
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            modalProps={{
                destroyOnClose: true,
                maskClosable: false,
                width: isMobile ? "100%" : 1100,
                confirmLoading: creating || replanning,
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
                    <MaterialListForm
                        form={form}
                        selectOptions={selectOptions}
                        inventoryOptions={inventoryOptions}
                        backendURL={backendURL}
                    />
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
