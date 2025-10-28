import { ModalForm } from "@ant-design/pro-components";
import { Col, Form, Row, message, Typography } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { isMobile } from "react-device-detect";
import { callUploadMultipleFiles } from "@/config/api";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useRef } from "react";
import type { ProFormInstance } from "@ant-design/pro-components";
import type {
    IDevice,
    IUpdateDeviceRequest,
    TimeUnitType,
    DeviceStatus,
    DeviceOwnershipType,
} from "@/types/backend";
import { useUpdateDeviceMutation } from "@/hooks/useDevices";
import {
    callFetchDeviceType,
    callFetchUnit,
    callFetchCompany,
    callFetchDepartment,
    callFetchMaterialSupplier,
    callFetchUser,
} from "@/config/api";

// Import components
import DeviceBasicInfo from "./sections/DeviceBasicInfo";
import DevicePartsSection from "./sections/DevicePartsSection";
import DeviceSpecsAndManagement from "./sections/DeviceSpecsAndManagement";
import DeviceWarrantyAndMaintenance from "./sections/DeviceWarrantyAndMaintenance";
import DeviceImagesAndNotes from "./sections/DeviceImagesAndNotes";
import type { ISelectItem } from "./sections/types";

const { Text } = Typography;

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IDevice | null;
    setDataInit: (v: any) => void;
}

const UpdateDeviceModal = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = true;

    // Select states
    const [selectedDeviceType, setSelectedDeviceType] = useState<ISelectItem | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<ISelectItem | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<ISelectItem | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<ISelectItem | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<ISelectItem | null>(null);
    const [selectedManager, setSelectedManager] = useState<ISelectItem | null>(null);

    // Image states
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    // Maintenance states
    const [freqUnit, setFreqUnit] = useState<TimeUnitType>("MONTH");
    const [freqModeYear, setFreqModeYear] = useState<"anyday" | "weekday">("anyday");

    const { mutate: updateDevice, isPending: isUpdating } = useUpdateDeviceMutation();

    /** ==================== Fetch options functions ==================== */
    async function fetchDeviceTypeList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchDeviceType(`page=1&size=100&typeName=/${name}/i`);
        return res?.data?.result?.map((e: any) => ({ label: e.typeName, value: e.id })) || [];
    }

    async function fetchUnitList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchUnit(`page=1&size=100&name=/${name}/i`);
        return res?.data?.result?.map((e: any) => ({ label: e.name, value: e.id })) || [];
    }

    async function fetchSupplierList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchMaterialSupplier(`page=1&size=100&supplierName=/${name}/i`);
        return res?.data?.result?.map((e: any) => ({ label: e.supplierName, value: e.id })) || [];
    }

    async function fetchCompanyList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchCompany(`page=1&size=100&name=/${name}/i`);
        return res?.data?.result?.map((e: any) => ({ label: e.name, value: e.id })) || [];
    }

    async function fetchDepartmentList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchDepartment(`page=1&size=100&name=/${name}/i`);
        return res?.data?.result?.map((e: any) => ({ label: e.name, value: e.id })) || [];
    }

    async function fetchManagerList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchUser(`page=1&size=100&name=/${name}/i`);
        return res?.data?.result?.map((e: any) => ({ label: e.name, value: e.id })) || [];
    }

    /** ==================== Image handlers ==================== */
    const getBase64 = (img: File, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            getBase64(file.originFileObj as File, (url) => {
                file.preview = url;
                setPreviewImage(url);
                setPreviewOpen(true);
                setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf("/") + 1));
            });
        } else {
            setPreviewImage(file.url || file.preview);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf("/") + 1));
        }
    };

    const handleCancelPreview = () => setPreviewOpen(false);

    const uploadProps: UploadProps = {
        listType: "picture-card",
        multiple: true,
        fileList,
        maxCount: 3,
        accept: ".jpg,.jpeg,.png,.webp",
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                setLoadingUpload(true);
                const res = await callUploadMultipleFiles([file as File], "device");
                if (res?.data && Array.isArray(res.data)) {
                    const newFiles: UploadFile[] = res.data.map((f) => ({
                        uid: uuidv4(),
                        name: f.fileName,
                        status: "done" as const,
                        url: `${import.meta.env.VITE_BACKEND_URL}/storage/device/${f.fileName}`,
                    }));
                    setFileList((prev) => [...prev, ...newFiles].slice(0, 3));
                    onSuccess?.("ok");
                } else {
                    throw new Error("Upload thất bại");
                }
            } catch (e: any) {
                message.error(e?.message || "Không thể upload ảnh");
                onError?.(e);
            } finally {
                setLoadingUpload(false);
            }
        },
        onRemove: (file) => {
            setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
        },
        onPreview: handlePreview,
    };
    useEffect(() => {
        if (!openModal || !dataInit?.id) return;

        const newSelections = {
            company: dataInit.company
                ? { label: dataInit.company.name ?? "", value: Number(dataInit.company.id ?? 0) }
                : null,
            department: dataInit.department
                ? { label: dataInit.department.name ?? "", value: Number(dataInit.department.id ?? 0) }
                : null,
            deviceType: dataInit.deviceType
                ? { label: dataInit.deviceType.typeName ?? "", value: Number(dataInit.deviceType.id ?? 0) }
                : null,
            supplier: dataInit.supplier
                ? { label: dataInit.supplier.supplierName ?? "", value: Number(dataInit.supplier.id ?? 0) }
                : null,
            manager: dataInit.manager
                ? { label: dataInit.manager.name ?? "", value: Number(dataInit.manager.id ?? 0) }
                : null,
            unit: dataInit.unit
                ? { label: dataInit.unit.name ?? "", value: Number(dataInit.unit.id ?? 0) }
                : null,
        };

        // Cập nhật state chọn dropdown 1 lần duy nhất
        setSelectedDeviceType(newSelections.deviceType);
        setSelectedUnit(newSelections.unit);
        setSelectedSupplier(newSelections.supplier);
        setSelectedCompany(newSelections.company);
        setSelectedDepartment(newSelections.department);
        setSelectedManager(newSelections.manager);

        // ====== Xử lý hình ảnh ======
        const images = [dataInit.image1, dataInit.image2, dataInit.image3].filter(Boolean);
        setFileList(
            images.map((url, idx) => ({
                uid: String(idx + 1),
                name: `image_${idx + 1}.jpg`,
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/storage/device/${url}`,
            }))
        );

        // ====== Cập nhật trạng thái bảo dưỡng ======
        const currentFreqUnit = dataInit.maintenanceFrequencyUnit || "MONTH";
        setFreqUnit(currentFreqUnit);
        if (currentFreqUnit === "YEAR") {
            setFreqModeYear(
                dataInit.maintenanceDayOfWeek && dataInit.maintenanceWeekOrder ? "weekday" : "anyday"
            );
        }

        // ====== Mapping danh sách linh kiện ======
        const parts =
            dataInit.parts && dataInit.parts.length > 0
                ? dataInit.parts.map((p) => ({
                    partCode: p.partCode ?? "",
                    partName: p.partName ?? "",
                    quantity: p.quantity ?? 1,
                }))
                : [{ partCode: "", partName: "", quantity: 1 }];

        // ====== Chờ ModalForm render xong hoàn toàn (150ms là tối ưu) ======
        const timer = setTimeout(() => {
            form.setFieldsValue({
                deviceCode: dataInit.deviceCode,
                accountingCode: dataInit.accountingCode,
                deviceName: dataInit.deviceName,
                ownershipType: dataInit.ownershipType ?? "INTERNAL",
                deviceType: newSelections.deviceType,
                unit: newSelections.unit,
                supplier: newSelections.supplier,
                company: newSelections.company,
                department: newSelections.department,
                manager: newSelections.manager,
                brand: dataInit.brand,
                modelDesc: dataInit.modelDesc,
                powerCapacity: dataInit.powerCapacity,
                length: (dataInit as any)?.length,
                width: (dataInit as any)?.width,
                height: (dataInit as any)?.height,
                unitPrice: dataInit.unitPrice,
                startDate: dataInit.startDate,
                warrantyExpiryDate: dataInit.warrantyExpiryDate,
                depreciationPeriodValue: dataInit.depreciationPeriodValue,
                depreciationPeriodUnit: dataInit.depreciationPeriodUnit ?? "MONTH",
                maintenanceFrequencyValue: dataInit.maintenanceFrequencyValue,
                maintenanceFrequencyUnit: dataInit.maintenanceFrequencyUnit,
                maintenanceDayOfMonth: dataInit.maintenanceDayOfMonth,
                maintenanceDayOfWeek: dataInit.maintenanceDayOfWeek,
                maintenanceWeekOrder: dataInit.maintenanceWeekOrder,
                maintenanceMonth: dataInit.maintenanceMonth,
                note: dataInit.note ?? "",
                status: dataInit.status ?? "NEW",
                parts, // ✅ phần quan trọng
            });

            // Ép ProFormList cập nhật giao diện ngay
            form.validateFields(["parts"]).catch(() => { });
        }, 150);

        // Cleanup để tránh memory leak nếu modal đóng nhanh
        return () => clearTimeout(timer);
    }, [openModal, dataInit]);

    /** ==================== Submit handlers ==================== */
    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
        setSelectedDeviceType(null);
        setSelectedUnit(null);
        setSelectedSupplier(null);
        setSelectedCompany(null);
        setSelectedDepartment(null);
        setSelectedManager(null);
        setFileList([]);
        setFreqUnit("MONTH");
        setFreqModeYear("anyday");
    };

    const buildPayload = (values: any): IUpdateDeviceRequest => {
        const images = (fileList || []).map((f) => f.url).slice(0, 3);
        const [image1, image2, image3] = [images[0] || "", images[1] || "", images[2] || ""];

        const base: IUpdateDeviceRequest = {
            deviceCode: values.deviceCode,
            accountingCode: values.accountingCode,
            deviceName: values.deviceName,
            deviceTypeId: Number(values.deviceType?.value),
            unitId: Number(values.unit?.value),
            supplierId: Number(values.supplier?.value),
            companyId: Number(values.company?.value),
            departmentId: Number(values.department?.value),
            managerUserId: Number(values.manager?.value),
            brand: values.brand,
            modelDesc: values.modelDesc,
            powerCapacity: values.powerCapacity,
            length: values.length ? Number(values.length) : undefined,
            width: values.width ? Number(values.width) : undefined,
            height: values.height ? Number(values.height) : undefined,
            unitPrice: values.unitPrice ? Number(values.unitPrice) : undefined,
            image1,
            image2,
            image3,
            startDate: values.startDate,
            warrantyExpiryDate: values.warrantyExpiryDate,
            depreciationPeriodValue: values.depreciationPeriodValue
                ? Number(values.depreciationPeriodValue)
                : undefined,
            depreciationPeriodUnit: values.depreciationPeriodUnit,
            maintenanceFrequencyValue: values.maintenanceFrequencyValue
                ? Number(values.maintenanceFrequencyValue)
                : undefined,
            maintenanceFrequencyUnit: values.maintenanceFrequencyUnit,
            maintenanceDayOfMonth: values.maintenanceDayOfMonth
                ? Number(values.maintenanceDayOfMonth)
                : undefined,
            maintenanceDayOfWeek: values.maintenanceDayOfWeek
                ? Number(values.maintenanceDayOfWeek)
                : undefined,
            maintenanceWeekOrder: values.maintenanceWeekOrder
                ? Number(values.maintenanceWeekOrder)
                : undefined,
            maintenanceMonth: values.maintenanceMonth
                ? Number(values.maintenanceMonth)
                : undefined,
            ownershipType: values.ownershipType as DeviceOwnershipType,
            status: (values.status || "NEW") as DeviceStatus,
            note: values.note,
            parts: (values.parts || [])
                .filter((p: any) => p && (p.partCode || p.partName))
                .map((p: any) => ({
                    partCode: String(p.partCode || "").trim(),
                    partName: String(p.partName || "").trim(),
                    quantity: Number(p.quantity || 1),
                })),
        };

        return base;
    };

    const submitDevice = async (values: any) => {
        if (!dataInit?.id) return;
        const payload = buildPayload(values);
        updateDevice(
            { id: dataInit.id as number, payload },
            { onSuccess: () => handleReset() }
        );
    };

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title="Cập nhật thiết bị/công cụ dụng cụ"
            open={openModal}
            form={form}
            onFinish={submitDevice}
            scrollToFirstError
            preserve={false}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                forceRender: true,
                width: isMobile ? "100%" : 1200,
                okText: "Cập nhật",
                cancelText: "Hủy",
                confirmLoading: isUpdating,
                maskClosable: false,
                style: { top: 20 },
            }}
            onVisibleChange={(visible) => {
                if (visible && dataInit?.id) {
                    const parts =
                        dataInit.parts?.map((p) => ({
                            partCode: p.partCode,
                            partName: p.partName,
                            quantity: p.quantity ?? 1,
                        })) ?? [{ partCode: "", partName: "", quantity: 1 }];

                    form.setFieldsValue({
                        modelDesc: dataInit.modelDesc,
                        powerCapacity: dataInit.powerCapacity,
                        parts,
                    });

                    form.validateFields(["parts"]).catch(() => { });
                }
            }}
        >

            <Row gutter={[20, 16]}>
                <Col span={24}>
                    <DeviceBasicInfo
                        isEdit
                        selectedDeviceType={selectedDeviceType}
                        setSelectedDeviceType={setSelectedDeviceType}
                        selectedUnit={selectedUnit}
                        setSelectedUnit={setSelectedUnit}
                        fetchDeviceTypeList={fetchDeviceTypeList}
                        fetchUnitList={fetchUnitList}
                    />
                </Col>

                <Col span={24}>
                    <DevicePartsSection />
                </Col>

                <Col span={24}>
                    <DeviceSpecsAndManagement
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
                        handleCancelPreview={handleCancelPreview}
                    />
                </Col>

                <Col span={24}>
                    <DeviceWarrantyAndMaintenance
                        freqUnit={freqUnit}
                        setFreqUnit={setFreqUnit}
                        freqModeYear={freqModeYear}
                        setFreqModeYear={setFreqModeYear}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default UpdateDeviceModal;
