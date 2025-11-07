import { ModalForm } from "@ant-design/pro-components";
import { Col, Form, Row, message, Typography } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { isMobile } from "react-device-detect";
import { callUploadMultipleFiles } from "@/config/api";
import { v4 as uuidv4 } from "uuid";
import { useState, useCallback, useMemo } from "react";
import type {
    ICreateDeviceRequest,
    TimeUnitType,
    DeviceOwnershipType,
} from "@/types/backend";
import { useCreateDeviceMutation } from "@/hooks/useDevices";
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
import DevicePartsSection from "./sections/DevicePartsSection";
import DeviceSpecsAndManagement from "./sections/DeviceSpecsAndManagement";
import DeviceWarrantyAndMaintenance from "./sections/DeviceWarrantyAndMaintenance";
import DeviceImagesAndNotes from "./sections/DeviceImagesAndNotes";
import type { ISelectItem } from "./sections/types";

const { Text } = Typography;

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
}

/** ===================== Component ===================== */
const CreateDeviceModal = ({ openModal, setOpenModal }: IProps) => {
    const [form] = Form.useForm();

    /** ===================== State ===================== */
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
    const [freqUnit, setFreqUnit] = useState<TimeUnitType>("MONTH");

    const { mutate: createDevice, isPending: isCreating } = useCreateDeviceMutation();

    /** ===================== Fetch options ===================== */
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
        async (name: string): Promise<ISelectItem[]> => {
            if (!selectedCompany?.value) return [];
            const res = await callFetchDepartment(
                `page=1&size=50&name=/${name}/i&companyId=${selectedCompany.value}`
            );
            return res?.data?.result?.map((e: any) => ({ label: e.name, value: e.id })) || [];
        },
        [selectedCompany]
    );

    const fetchManagerList = useCallback(async (name: string): Promise<ISelectItem[]> => {
        const res = await callFetchUser(
            `page=1&size=50&name=/${name}/i&filter=role.name='EMPLOYEE'`
        );
        return res?.data?.result?.map((e: any) => ({ label: e.name, value: e.id })) || [];
    }, []);

    /** ===================== Upload handler ===================== */
    const handlePreview = useCallback((file: any) => {
        const show = (src: string) => {
            setPreviewImage(src);
            setPreviewOpen(true);
            setPreviewTitle(file.name);
        };

        if (!file.url && !file.preview) {
            const reader = new FileReader();
            reader.onload = () => show(reader.result as string);
            reader.readAsDataURL(file.originFileObj as File);
        } else {
            show(file.url || file.preview);
        }
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
                        const newFiles: UploadFile[] = res.data.map((f) => ({
                            uid: uuidv4(),
                            name: f.fileName,
                            status: "done",
                            url: `${import.meta.env.VITE_BACKEND_URL}/storage/device/${f.fileName}`,
                        }));
                        setFileList((prev) => [...prev, ...newFiles].slice(0, 3));
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

    /** ===================== Helpers ===================== */
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
        setFreqUnit("MONTH");
    }, []);

    const handleCompanyChange = useCallback(
        (value: ISelectItem | null) => {
            setSelectedCompany(value);
            setSelectedDepartment(null);
            form.setFieldsValue({ department: undefined });
        },
        [form]
    );

    /** ===================== Submit ===================== */
    const buildPayload = useCallback(
        (values: any): ICreateDeviceRequest => {
            const [image1, image2, image3] = fileList.map((f) => f.name).slice(0, 3);

            return {
                deviceCode: values.deviceCode,
                accountingCode: values.accountingCode,
                deviceName: values.deviceName,
                companyId: values.company?.value,
                departmentId: values.department?.value,
                deviceTypeId: values.deviceType?.value,
                supplierId: values.supplier?.value,
                managerUserId: values.manager?.value,
                unitId: values.unit?.value,
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
                maintenanceFrequencyValue: Number(values.maintenanceFrequencyValue) || undefined,
                maintenanceFrequencyUnit: values.maintenanceFrequencyUnit,
                maintenanceDayOfMonth: Number(values.maintenanceDayOfMonth) || undefined,
                maintenanceMonth: Number(values.maintenanceMonth) || undefined,
                ownershipType: (values.ownershipType as DeviceOwnershipType) || "INTERNAL",
                status: "NEW",
                note: values.note,
                parts: (values.parts || [])
                    .filter((p: any) => p && (p.partCode || p.partName))
                    .map((p: any) => ({
                        partCode: String(p.partCode || "").trim(),
                        partName: String(p.partName || "").trim(),
                        quantity: Number(p.quantity || 1),
                        status: "WORKING",
                    })),
            };
        },
        [fileList]
    );

    const submitDevice = useCallback(
        async (values: any) => {
            if (loadingUpload) {
                message.warning("Vui lòng chờ upload ảnh hoàn tất");
                return;
            }
            const payload = buildPayload(values);
            createDevice(payload, {
                onSuccess: () => {
                    message.success("Tạo thiết bị thành công");
                    handleReset();
                },
                onError: () => message.error("Không thể tạo thiết bị"),
            });
        },
        [loadingUpload, buildPayload, createDevice, handleReset]
    );

    /** ===================== Render ===================== */
    return (
        <ModalForm
            title={<Text strong style={{ fontSize: 18 }}>Thêm mới thiết bị / công cụ dụng cụ</Text>}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                forceRender: true,
                width: isMobile ? "100%" : 1200,
                okText: "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating,
                maskClosable: false,
                style: { top: 20 },
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitDevice}
            initialValues={{
                maintenanceFrequencyUnit: "MONTH",
                depreciationPeriodUnit: "YEAR",
                ownershipType: "INTERNAL",
                status: "NEW",
                parts: [{ partCode: "", partName: "", quantity: 1 }],
            }}
        >
            <Row gutter={[20, 16]}>
                <Col span={24}>
                    <DeviceBasicInfo
                        isEdit={false}
                        form={form}
                        selectedDeviceType={selectedDeviceType}
                        setSelectedDeviceType={setSelectedDeviceType}
                        selectedUnit={selectedUnit}
                        setSelectedUnit={setSelectedUnit}
                        fetchDeviceTypeList={fetchDeviceTypeList}
                        fetchUnitList={fetchUnitList}
                        fetchCustomerList={fetchCustomerList}
                    />
                </Col>

                <Col span={24}><DevicePartsSection /></Col>

                <Col span={24}>
                    <DeviceSpecsAndManagement
                        form={form}
                        selectedSupplier={selectedSupplier}
                        setSelectedSupplier={setSelectedSupplier}
                        selectedCompany={selectedCompany}
                        setSelectedCompany={handleCompanyChange}
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
                        isEdit={false}
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
                    <DeviceWarrantyAndMaintenance
                        freqUnit={freqUnit}
                        setFreqUnit={setFreqUnit}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default CreateDeviceModal;
