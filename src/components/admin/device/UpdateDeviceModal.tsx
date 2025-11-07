import { ModalForm } from "@ant-design/pro-components";
import { Col, Form, Row, message, Typography } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { isMobile } from "react-device-detect";
import { callUploadMultipleFiles } from "@/config/api";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
    IUpdateDeviceRequest,
    TimeUnitType,
    DeviceOwnershipType,
} from "@/types/backend";
import { useDeviceByIdQuery, useUpdateDeviceMutation } from "@/hooks/useDevices";
import {
    callFetchDeviceType,
    callFetchUnit,
    callFetchCompany,
    callFetchDepartment,
    callFetchMaterialSupplier,
    callFetchUser,
    callFetchCustomer,
} from "@/config/api";

import DeviceBasicInfo from "./sections/DeviceBasicInfo";
import DevicePartsUpdateSection from "./sections/DevicePartsUpdateSection";
import DeviceSpecsAndManagement from "./sections/DeviceSpecsAndManagement";
import DeviceImagesAndNotes from "./sections/DeviceImagesAndNotes";
import MaintenanceFrequencySection from "./sections/MaintenanceFrequencySection";
import type { ISelectItem } from "./sections/types";

const { Text } = Typography;

/* ===================== Helpers ===================== */
const toSelect = (label?: string | null, value?: string | number | null): ISelectItem | null =>
    label && value ? { label: String(label), value } : null;

const extractFileNameFromUrl = (url: string): string => {
    if (!url) return "";
    const mark = "/storage/device/";
    const idx = url.indexOf(mark);
    if (idx >= 0) return url.slice(idx + mark.length);
    const last = url.split("/").pop() || "";
    return last;
};

/* ===================== Component ===================== */
interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: { id?: string | number | null } | null;
    setDataInit?: (v: any) => void;
}

const UpdateDeviceModal = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();

    // === UI states ===
    const [selectedDeviceType, setSelectedDeviceType] = useState<ISelectItem | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<ISelectItem | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<ISelectItem | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<ISelectItem | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<ISelectItem | null>(null);
    const [selectedManager, setSelectedManager] = useState<ISelectItem | null>(null);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const [maintenanceFrequencyValue, setMaintenanceFrequencyValue] = useState<number | "">("");
    const [maintenanceFrequencyUnit, setMaintenanceFrequencyUnit] = useState<TimeUnitType | "">("");
    const [maintenanceDayOfMonth, setMaintenanceDayOfMonth] = useState<number | "">("");
    const [maintenanceMonth, setMaintenanceMonth] = useState<number | "">("");

    const { mutate: updateDevice, isPending: isUpdating } = useUpdateDeviceMutation();

    const deviceId = useMemo(
        () => (openModal && dataInit?.id ? String(dataInit.id) : ""),
        [openModal, dataInit?.id]
    );

    const { data: detail, isFetching } = useDeviceByIdQuery(deviceId || undefined);

    /* ===================== Prefill dữ liệu ===================== */
    useEffect(() => {
        if (!openModal || !detail) return;

        form.resetFields();

        const mappedParts =
            Array.isArray(detail.parts) && detail.parts.length > 0
                ? detail.parts.map((p) => ({
                    partCode: p.partCode || "",
                    partName: p.partName || "",
                    quantity: Number(p.quantity || 1),
                    status: p.status || "WORKING",
                }))
                : [{ partCode: "", partName: "", quantity: 1, status: "WORKING" }];


        form.setFieldsValue({
            ...detail,
            parts: mappedParts,
            deviceType: toSelect(detail.deviceType?.typeName, detail.deviceType?.id),
            unit: toSelect(detail.unit?.name, detail.unit?.id),
            supplier: toSelect(detail.supplier?.supplierName, detail.supplier?.id),
            company: toSelect(detail.company?.name, detail.company?.id),
            department: toSelect(detail.department?.name, detail.department?.id),
            manager: toSelect(detail.manager?.name, detail.manager?.id),
            startDate: detail.startDate || null,
            warrantyExpiryDate: detail.warrantyExpiryDate || null,
        });

        if (detail.ownershipType === "CUSTOMER" && detail.customer) {
            form.setFieldValue(
                "customer",
                toSelect(detail.customer.name, detail.customer.id)
            );
        }

        setSelectedDeviceType(toSelect(detail.deviceType?.typeName, detail.deviceType?.id));
        setSelectedUnit(toSelect(detail.unit?.name, detail.unit?.id));
        setSelectedSupplier(toSelect(detail.supplier?.supplierName, detail.supplier?.id));
        setSelectedCompany(toSelect(detail.company?.name, detail.company?.id));
        setSelectedDepartment(toSelect(detail.department?.name, detail.department?.id));
        setSelectedManager(toSelect(detail.manager?.name, detail.manager?.id));

        const imgs = [detail.image1, detail.image2, detail.image3].filter(Boolean) as string[];
        const normalized: UploadFile[] = imgs.map((raw) => {
            const fullUrl = raw.startsWith("http")
                ? raw
                : `${import.meta.env.VITE_BACKEND_URL}/storage/device/${raw}`;
            return {
                uid: uuidv4(),
                name: extractFileNameFromUrl(fullUrl),
                status: "done" as const,
                url: fullUrl,
            };
        });
        setFileList(normalized.slice(0, 3));
        setMaintenanceFrequencyValue(detail.maintenanceFrequencyValue ?? "");
        setMaintenanceFrequencyUnit(detail.maintenanceFrequencyUnit ?? "");
        setMaintenanceDayOfMonth(detail.maintenanceDayOfMonth ?? "");
        setMaintenanceMonth(detail.maintenanceMonth ?? "");
    }, [openModal, detail]);

    /* ===================== Fetch Options ===================== */
    const fetchList = useCallback(async (api: any, key: string, name: string, extra?: string) => {
        const res = await api(`page=1&size=50&${key}=/${name}/i${extra ? `&${extra}` : ""}`);
        return (
            res?.data?.result?.map((e: any) => ({
                label: e.name || e.typeName || e.supplierName,
                value: e.id,
            })) || []
        );
    }, []);

    const fetchDeviceTypeList = useCallback((n: string) => fetchList(callFetchDeviceType, "typeName", n), []);
    const fetchCustomerList = useCallback((n: string) => fetchList(callFetchCustomer, "name", n), []);
    const fetchUnitList = useCallback((n: string) => fetchList(callFetchUnit, "name", n), []);
    const fetchSupplierList = useCallback((n: string) => fetchList(callFetchMaterialSupplier, "supplierName", n), []);
    const fetchCompanyList = useCallback((n: string) => fetchList(callFetchCompany, "name", n), []);
    const fetchDepartmentList = useCallback(
        async (n: string): Promise<ISelectItem[]> => {
            if (!selectedCompany?.value) return [];
            const res = await callFetchDepartment(
                `page=1&size=50&name=/${n}/i&companyId=${selectedCompany.value}`
            );
            return res?.data?.result?.map((e: any) => ({ label: e.name, value: e.id })) || [];
        },
        [selectedCompany]
    );
    const fetchManagerList = useCallback(async (n: string): Promise<ISelectItem[]> => {
        const res = await callFetchUser(
            `page=1&size=50&name=/${n}/i&filter=role.name='EMPLOYEE'`
        );
        return res?.data?.result?.map((e: any) => ({ label: e.name, value: e.id })) || [];
    }, []);

    /* ===================== Upload ===================== */
    const handlePreview = useCallback((file: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result as string);
            setPreviewOpen(true);
            setPreviewTitle(file.name);
        };
        if (file.originFileObj) reader.readAsDataURL(file.originFileObj);
        else {
            setPreviewImage(file.url || "");
            setPreviewOpen(true);
            setPreviewTitle(file.name);
        }
        return () => reader.abort();
    }, []);

    const uploadProps = useMemo<UploadProps>(
        () => ({
            listType: "picture-card",
            multiple: true,
            fileList,
            maxCount: 3,
            accept: ".jpg,.jpeg,.png,.webp",
            customRequest: async ({ file, onSuccess, onError }) => {
                try {
                    if ((file as File).size > 2 * 1024 * 1024) {
                        message.error("Ảnh vượt quá 2MB");
                        onError?.(new Error("File quá lớn"));
                        return;
                    }
                    setLoadingUpload(true);
                    const res = await callUploadMultipleFiles([file as File], "device");
                    if (Array.isArray(res?.data)) {
                        const next: UploadFile[] = res.data.map((f) => ({
                            uid: uuidv4(),
                            name: f.fileName,
                            status: "done",
                            url: `${import.meta.env.VITE_BACKEND_URL}/storage/device/${f.fileName}`,
                        }));
                        setFileList((prev) => [...prev, ...next].slice(0, 3));
                        onSuccess?.("ok");
                    } else throw new Error("Upload thất bại");
                } catch (err: any) {
                    message.error(err?.message || "Không thể upload ảnh");
                    onError?.(err);
                } finally {
                    setLoadingUpload(false);
                }
            },
            onRemove: (file) => setFileList((prev) => prev.filter((f) => f.uid !== file.uid)),
            onPreview: handlePreview,
        }),
        [fileList, handlePreview]
    );

    /* ===================== Reset ===================== */
    const handleReset = useCallback(() => {
        form.resetFields();
        setOpenModal(false);
        setSelectedDeviceType(null);
        setSelectedUnit(null);
        setSelectedSupplier(null);
        setSelectedCompany(null);
        setSelectedDepartment(null);
        setSelectedManager(null);
        setFileList([]);
        setDataInit?.(null);
        setMaintenanceFrequencyValue("");
        setMaintenanceFrequencyUnit("");
        setMaintenanceDayOfMonth("");
        setMaintenanceMonth("");
    }, [form, setOpenModal, setDataInit]);

    /* ===================== Submit ===================== */
    const buildPayload = useCallback(
        (values: any): IUpdateDeviceRequest => {
            const [image1, image2, image3] = fileList
                .map((f) => f.name || extractFileNameFromUrl(String(f.url || "")))
                .slice(0, 3);

            return {
                deviceCode: values.deviceCode,
                accountingCode: values.accountingCode,
                deviceName: values.deviceName,
                deviceTypeId: values.deviceType?.value,
                unitId: values.unit?.value,
                supplierId: values.supplier?.value,
                companyId: values.company?.value,
                departmentId: values.department?.value,
                managerUserId: values.manager?.value,
                customerId: values.customer?.value,
                brand: values.brand,
                modelDesc: values.modelDesc,
                powerCapacity: values.powerCapacity,
                length: Number(values.length) || undefined,
                width: Number(values.width) || undefined,
                height: Number(values.height) || undefined,
                unitPrice: Number(values.unitPrice) || undefined,
                image1,
                image2,
                image3,
                startDate: values.startDate,
                warrantyExpiryDate: values.warrantyExpiryDate,
                depreciationPeriodValue: Number(values.depreciationPeriodValue) || undefined,
                depreciationPeriodUnit: values.depreciationPeriodUnit,
                maintenanceFrequencyValue: Number(maintenanceFrequencyValue) || undefined,
                maintenanceFrequencyUnit: maintenanceFrequencyUnit || undefined,
                maintenanceDayOfMonth: Number(maintenanceDayOfMonth) || undefined,
                maintenanceMonth: Number(maintenanceMonth) || undefined,
                ownershipType: (values.ownershipType as DeviceOwnershipType) || "INTERNAL",
                status: values.status,
                note: values.note,
                parts: (values.parts || [])
                    .filter((p: any) => p && (p.partCode || p.partName))
                    .map((p: any) => ({
                        partCode: String(p.partCode || "").trim(),
                        partName: String(p.partName || "").trim(),
                        quantity: Number(p.quantity || 1),
                        status: p.status || "WORKING",
                    })),
            };
        },
        [fileList, maintenanceFrequencyValue, maintenanceFrequencyUnit, maintenanceDayOfMonth, maintenanceMonth]
    );

    const submitUpdate = useCallback(
        async (values: any) => {
            if (!dataInit?.id) {
                message.error("Thiếu thông tin thiết bị để cập nhật");
                return;
            }
            if (loadingUpload) {
                message.warning("Vui lòng chờ upload ảnh hoàn tất");
                return;
            }
            const payload = buildPayload(values);
            updateDevice(
                { id: String(dataInit.id), payload },
                {
                    onSuccess: () => {
                        message.success("Cập nhật thiết bị thành công");
                        handleReset();
                    },
                    onError: () => message.error("Không thể cập nhật thiết bị"),
                }
            );
        },
        [dataInit, loadingUpload, buildPayload, updateDevice, handleReset]
    );

    /* ===================== Render ===================== */
    return (
        <ModalForm
            title={<Text strong style={{ fontSize: 18 }}>Cập nhật thiết bị / công cụ dụng cụ</Text>}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                forceRender: true,
                width: isMobile ? "100%" : 1200,
                okText: "Cập nhật",
                cancelText: "Hủy",
                confirmLoading: isUpdating || isFetching,
                maskClosable: false,
                style: { top: 20 },
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitUpdate}
        >
            <Row gutter={[20, 16]}>
                <Col span={24}>
                    <DeviceBasicInfo
                        isEdit
                        form={form}
                        selectedDeviceType={selectedDeviceType}
                        setSelectedDeviceType={setSelectedDeviceType}
                        selectedUnit={selectedUnit}
                        setSelectedUnit={setSelectedUnit}
                        fetchDeviceTypeList={fetchDeviceTypeList}
                        fetchUnitList={fetchUnitList}
                        fetchCustomerList={fetchCustomerList}
                        initialOwnershipType={detail?.ownershipType}
                        initialCustomer={
                            detail?.ownershipType === "CUSTOMER" && detail?.customer
                                ? { label: detail.customer.name ?? "", value: String(detail.customer.id ?? "") }
                                : null
                        }
                    />
                </Col>

                <Col span={24}>
                    <Form.Item name="parts" label={false}>
                        <DevicePartsUpdateSection />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <DeviceSpecsAndManagement
                        form={form}
                        selectedSupplier={selectedSupplier}
                        setSelectedSupplier={setSelectedSupplier}
                        selectedCompany={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
                        selectedDepartment={selectedDepartment}
                        setSelectedDepartment={setSelectedDepartment}
                        selectedManager={selectedManager}
                        setSelectedManager={setSelectedManager}
                        fetchSupplierList={fetchSupplierList}
                        fetchCompanyList={fetchCompanyList}
                        fetchDepartmentList={fetchDepartmentList}
                        fetchManagerList={fetchManagerList}
                        departmentKey={selectedCompany?.value ?? "no-company"}
                    />
                </Col>

                <Col span={24}>
                    <DeviceImagesAndNotes
                        isEdit
                        fileList={fileList}
                        loadingUpload={loadingUpload}
                        previewOpen={previewOpen}
                        previewImage={previewImage}
                        previewTitle={previewTitle}
                        uploadProps={uploadProps}
                        handleCancelPreview={() => setPreviewOpen(false)}
                    />
                </Col>

                <Col span={24}>
                    <MaintenanceFrequencySection
                        maintenanceFrequencyValue={maintenanceFrequencyValue}
                        setMaintenanceFrequencyValue={setMaintenanceFrequencyValue}
                        maintenanceFrequencyUnit={maintenanceFrequencyUnit}
                        setMaintenanceFrequencyUnit={setMaintenanceFrequencyUnit}
                        maintenanceDayOfMonth={maintenanceDayOfMonth}
                        setMaintenanceDayOfMonth={setMaintenanceDayOfMonth}
                        maintenanceMonth={maintenanceMonth}
                        setMaintenanceMonth={setMaintenanceMonth}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default UpdateDeviceModal;
