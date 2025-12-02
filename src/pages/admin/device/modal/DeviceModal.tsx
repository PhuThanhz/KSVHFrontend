import { ModalForm } from "@ant-design/pro-components";
import { Col, Form, Row, message, Typography } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { isMobile } from "react-device-detect";
import { callUploadMultipleFiles } from "@/config/api";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useMemo, useState } from "react";

import type {
    ICreateDeviceRequest,
    IUpdateDeviceRequest,
    TimeUnitType,
} from "@/types/backend";

import {
    useDeviceByIdQuery,
    useUpdateDeviceMutation,
    useCreateDeviceMutation,
} from "@/hooks/useDevices";

import {
    callFetchDeviceType,
    callFetchUnit,
    callFetchCompany,
    callFetchDepartment,
    callFetchMaterialSupplier,
    callFetchUser,
    callFetchCustomer,
} from "@/config/api";

import DeviceBasicInfo from "../sections/DeviceBasicInfo";
import DeviceSpecsAndManagement from "../sections/DeviceSpecsAndManagement";
import DeviceImagesAndNotes from "../sections/DeviceImagesAndNotes";
import DeviceWarrantyAndMaintenance from "../sections/DeviceWarrantyAndMaintenance";

import type { ISelectItem } from "../sections/types";

const { Text } = Typography;

// convert object → select option
const toSelect = (label?: string | null, value?: string | number | null): ISelectItem | null =>
    label && value ? { label: String(label), value } : null;

// extract filename from url
const extractFileName = (url: string): string => {
    if (!url) return "";
    const mark = "/storage/device/";
    const idx = url.indexOf(mark);
    return idx >= 0 ? url.slice(idx + mark.length) : url.split("/").pop() || "";
};

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: { id?: string | number | null } | null;
    setDataInit?: (v: any) => void;
}

const DeviceModal = ({
    openModal,
    setOpenModal,
    dataInit,
    setDataInit,
}: IProps) => {

    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

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

    // mutation
    const { mutate: updateDevice, isPending: isUpdating } = useUpdateDeviceMutation();
    const { mutate: createDevice, isPending: isCreating } = useCreateDeviceMutation();

    const deviceId = useMemo(
        () => (openModal && dataInit?.id ? String(dataInit.id) : ""),
        [openModal, dataInit?.id]
    );

    const { data: detail, isFetching } = useDeviceByIdQuery(deviceId || undefined);

    // ============= DISABLED FIELDS CHO UPDATE =============
    const disabledFields = useMemo(
        () =>
            isEdit
                ? {
                    deviceCode: true,
                    accountingCode: true,
                    deviceName: true,
                    deviceType: true,
                    unit: true,
                    ownershipType: true,
                    customer: true,
                    startDate: true,
                    warrantyExpiryDate: true,
                }
                : {},
        [isEdit]
    );

    // ============= LOAD DATA EDIT =============
    useEffect(() => {
        if (!openModal || !isEdit || !detail) return;

        form.setFieldsValue({
            deviceCode: detail.deviceCode,
            accountingCode: detail.accountingCode,
            deviceName: detail.deviceName,
            deviceType: toSelect(detail.deviceType?.typeName, detail.deviceType?.id),
            unit: toSelect(detail.unit?.name, detail.unit?.id),
            ownershipType: detail.ownershipType,
            customer: toSelect(detail.customer?.name, detail.customer?.id),

            // specs
            brand: detail.brand,
            modelDesc: detail.modelDesc,
            powerCapacity: detail.powerCapacity,
            length: detail.length,
            width: detail.width,
            height: detail.height,

            // management
            supplier: toSelect(detail.supplier?.supplierName, detail.supplier?.id),
            company: toSelect(detail.company?.name, detail.company?.id),
            department: toSelect(detail.department?.name, detail.department?.id),
            manager: toSelect(detail.manager?.name, detail.manager?.id),

            // pricing & status
            unitPrice: detail.unitPrice,
            status: detail.status,

            // warranty
            startDate: detail.startDate,
            warrantyExpiryDate: detail.warrantyExpiryDate,
            depreciationPeriodUnit: detail.depreciationPeriodUnit,
            depreciationPeriodValue: detail.depreciationPeriodValue,

            // maintenance
            maintenanceFrequencyUnit: detail.maintenanceFrequencyUnit,
            maintenanceFrequencyValue: detail.maintenanceFrequencyValue,

            note: detail.note,
        });

        setSelectedDeviceType(toSelect(detail.deviceType?.typeName, detail.deviceType?.id));
        setSelectedUnit(toSelect(detail.unit?.name, detail.unit?.id));
        setSelectedSupplier(toSelect(detail.supplier?.supplierName, detail.supplier?.id));
        setSelectedCompany(toSelect(detail.company?.name, detail.company?.id));
        setSelectedDepartment(toSelect(detail.department?.name, detail.department?.id));
        setSelectedManager(toSelect(detail.manager?.name, detail.manager?.id));

        setFreqUnit(detail.maintenanceFrequencyUnit as TimeUnitType);

        // load images
        const imgs = [detail.image1, detail.image2, detail.image3].filter(Boolean) as string[];
        const normalized: UploadFile[] = imgs.map((raw) => {
            const fullUrl = raw.startsWith("http")
                ? raw
                : `${import.meta.env.VITE_BACKEND_URL}/storage/device/${raw}`;
            return {
                uid: uuidv4(),
                name: extractFileName(fullUrl),
                status: "done",
                url: fullUrl,
            };
        });
        setFileList(normalized.slice(0, 3));
    }, [openModal, isEdit, detail, form]);

    // ============= FETCH SELECT LIST =============
    const fetchList = useCallback(async (api: any, key: string, name: string, extra?: string) => {
        const res = await api(`page=1&size=50&${key}=/${name}/i${extra ? `&${extra}` : ""}`);
        return (
            res?.data?.result?.map((e: any) => ({
                label: e.name || e.typeName || e.supplierName,
                value: e.id,
            })) || []
        );
    }, []);

    const fetchDeviceTypeList = useCallback((n: string) => fetchList(callFetchDeviceType, "typeName", n), [fetchList]);
    const fetchCustomerList = useCallback((n: string) => fetchList(callFetchCustomer, "name", n), [fetchList]);
    const fetchUnitList = useCallback((n: string) => fetchList(callFetchUnit, "name", n), [fetchList]);
    const fetchSupplierList = useCallback((n: string) => fetchList(callFetchMaterialSupplier, "supplierName", n), [fetchList]);
    const fetchCompanyList = useCallback((n: string) => fetchList(callFetchCompany, "name", n), [fetchList]);

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

    // ============= PREVIEW IMAGE =============
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

    // ============= CUSTOM UPLOAD =============
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
                    if (!Array.isArray(res?.data)) throw new Error("Upload thất bại");

                    const uploaded: UploadFile[] = res.data.map((f) => ({
                        uid: uuidv4(),
                        name: f.fileName,
                        status: "done",
                        url: `${import.meta.env.VITE_BACKEND_URL}/storage/device/${f.fileName}`,
                    }));

                    setFileList((prev) => [...prev, ...uploaded].slice(0, 3));
                    onSuccess?.("ok");
                } catch (err: any) {
                    message.error(err?.message || "Không thể upload ảnh");
                    onError?.(err);
                } finally {
                    setLoadingUpload(false);
                }
            },
            onRemove: (file) =>
                setFileList((prev) => prev.filter((f) => f.uid !== file.uid)),
            onPreview: handlePreview,
        }),
        [fileList, handlePreview]
    );

    // ============= RESET MODAL =============
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
        setDataInit?.(null);
    }, []);

    // ============= BUILD REQUEST PAYLOAD =============
    const buildPayload = useCallback(
        (values: any): ICreateDeviceRequest | IUpdateDeviceRequest => {
            const [image1, image2, image3] = fileList
                .map((f) => f.name || extractFileName(String(f.url || "")))
                .slice(0, 3);

            const common = {
                companyId: values.company?.value,
                departmentId: values.department?.value,
                supplierId: values.supplier?.value,
                managerUserId: values.manager?.value,
                unitId: values.unit?.value,
                brand: values.brand,
                modelDesc: values.modelDesc,
                powerCapacity: values.powerCapacity,
                length: values.length ? Number(values.length) : undefined,
                width: values.width ? Number(values.width) : undefined,
                height: values.height ? Number(values.height) : undefined,
                unitPrice: values.unitPrice ? Number(values.unitPrice) : undefined,
                startDate: values.startDate,
                image1,
                image2,
                image3,
                note: values.note,
            };

            if (isEdit) {
                return {
                    ...common,
                    status: values.status,
                } as IUpdateDeviceRequest;
            }

            return {
                ...common,
                deviceCode: values.deviceCode,
                accountingCode: values.accountingCode,
                deviceName: values.deviceName,
                deviceTypeId: values.deviceType?.value,
                customerId: values.customer?.value,
                warrantyExpiryDate: values.warrantyExpiryDate,
                depreciationPeriodValue: Number(values.depreciationPeriodValue) || undefined,
                depreciationPeriodUnit: values.depreciationPeriodUnit,
                maintenanceFrequencyValue: Number(values.maintenanceFrequencyValue) || undefined,
                maintenanceFrequencyUnit: values.maintenanceFrequencyUnit,
                ownershipType: values.ownershipType || "INTERNAL",
                status: "NEW",
            } as ICreateDeviceRequest;
        },
        [fileList, isEdit]
    );

    // ============= SUBMIT FORM =============
    const submitForm = useCallback(
        async (values: any) => {
            if (loadingUpload) {
                message.warning("Vui lòng chờ upload ảnh hoàn tất");
                return;
            }

            const payload = buildPayload(values);

            if (isEdit) {
                updateDevice(
                    { id: String(dataInit?.id), payload: payload as IUpdateDeviceRequest },
                    {
                        onSuccess: () => {
                            message.success("Cập nhật thiết bị thành công");
                            handleReset();
                        },
                        onError: () => message.error("Không thể cập nhật thiết bị"),
                    }
                );
            } else {
                createDevice(payload as ICreateDeviceRequest, {
                    onSuccess: () => {
                        message.success("Tạo thiết bị thành công");
                        handleReset();
                    },
                    onError: () => message.error("Không thể tạo thiết bị"),
                });
            }
        },
        [loadingUpload, buildPayload, isEdit, dataInit, updateDevice, createDevice, handleReset]
    );

    // ============= RENDER =============
    return (
        <ModalForm
            title={
                <Text strong style={{ fontSize: 18 }}>
                    {isEdit ? "Cập nhật" : "Thêm mới"} thiết bị / công cụ dụng cụ
                </Text>
            }
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                forceRender: true,
                width: isMobile ? "100%" : 1200,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isEdit ? isUpdating || isFetching : isCreating,
                maskClosable: false,
                style: { top: 20 },
            }}
            scrollToFirstError
            preserve={true}
            form={form}
            onFinish={submitForm}
            initialValues={
                isEdit
                    ? undefined
                    : {
                        maintenanceFrequencyUnit: "MONTH",
                        depreciationPeriodUnit: "YEAR",
                        ownershipType: "INTERNAL",
                        status: "NEW",
                    }
            }
        >
            <Row gutter={[20, 16]}>
                <Col span={24}>
                    <DeviceBasicInfo
                        isEdit={isEdit}
                        disabledFields={disabledFields}
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
                        isEdit={isEdit}
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
                        isEdit={isEdit}
                        freqUnit={freqUnit}
                        setFreqUnit={setFreqUnit}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default DeviceModal;
