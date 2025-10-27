import {
    ModalForm, ProForm, ProFormTextArea, ProFormDigit, ProFormDatePicker, ProFormText,
    ProFormList, ProFormGroup
} from "@ant-design/pro-components";
import { Col, Modal, Form, Row, Upload, Radio, Select, Space, Typography, Divider, message, Card } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { isMobile } from "react-device-detect";
import { callUploadMultipleFiles } from "@/config/api";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useState } from "react";
import type {
    IDevice,
    ICreateDeviceRequest,
    IUpdateDeviceRequest,
    TimeUnitType,
    DeviceStatus,
    DeviceOwnershipType,
} from "@/types/backend";
import { DebounceSelect } from "../debouce.select";
import { useCreateDeviceMutation, useUpdateDeviceMutation } from "@/hooks/useDevices";
import {
    callFetchDeviceType,
    callFetchUnit,
    callFetchCompany,
    callFetchDepartment,
    callFetchMaterialSupplier,
    callFetchUser,
} from "@/config/api";

const { Text } = Typography;

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IDevice | null;
    setDataInit: (v: any) => void;
}

export interface ISelectItem {
    label?: string;
    value: number | string;
    key?: number | string;
}

/** Enum options */
const STATUS_OPTIONS: { label: string; value: DeviceStatus }[] = [
    { label: "Mới tạo", value: "NEW" },
    { label: "Đang sử dụng", value: "IN_USE" },
    { label: "Lưu kho", value: "IN_STORAGE" },
    { label: "Không sử dụng", value: "NOT_IN_USE" },
    { label: "Thanh lý", value: "LIQUIDATED" },
];

const OWNERSHIP_OPTIONS: { label: string; value: DeviceOwnershipType }[] = [
    { label: "Nội bộ", value: "INTERNAL" },
    { label: "Khách hàng", value: "CUSTOMER" },
];

const DEPRE_UNITS: TimeUnitType[] = ["MONTH", "QUARTER", "YEAR"];
const FREQ_UNITS: TimeUnitType[] = ["DAY", "WEEK", "MONTH", "YEAR"];

const WEEK_DAYS = [
    { label: "Thứ 2", value: 1 },
    { label: "Thứ 3", value: 2 },
    { label: "Thứ 4", value: 3 },
    { label: "Thứ 5", value: 4 },
    { label: "Thứ 6", value: 5 },
    { label: "Thứ 7", value: 6 },
    { label: "Chủ nhật", value: 7 },
];

const WEEK_ORDERS = [
    { label: "Tuần 1", value: 1 },
    { label: "Tuần 2", value: 2 },
    { label: "Tuần 3", value: 3 },
    { label: "Tuần 4", value: 4 },
    { label: "Tuần 5", value: 5 },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }));

const ModalDevice = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    // chọn lookup
    const [selectedDeviceType, setSelectedDeviceType] = useState<ISelectItem | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<ISelectItem | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<ISelectItem | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<ISelectItem | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<ISelectItem | null>(null);
    const [selectedManager, setSelectedManager] = useState<ISelectItem | null>(null);

    // ảnh
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    // bảo dưỡng
    const [freqUnit, setFreqUnit] = useState<TimeUnitType>("MONTH");
    const [freqModeYear, setFreqModeYear] = useState<"anyday" | "weekday">("anyday");

    const { mutate: createDevice, isPending: isCreating } = useCreateDeviceMutation();
    const { mutate: updateDevice, isPending: isUpdating } = useUpdateDeviceMutation();

    /** ==================== Helpers fetch options ==================== */
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

    /** ==================== Init form when open ==================== */
    useEffect(() => {
        if (dataInit?.id && openModal) {
            // Lấy ID thực từ các đối tượng nested
            const deviceTypeId = (dataInit as any).deviceType?.id || (dataInit as any).deviceTypeId;
            const unitId = (dataInit as any).unit?.id || (dataInit as any).unitId;
            const supplierId = (dataInit as any).supplier?.id || (dataInit as any).supplierId;
            const companyId = (dataInit as any).company?.id || (dataInit as any).companyId;
            const departmentId = (dataInit as any).department?.id || (dataInit as any).departmentId;
            const managerId = (dataInit as any).manager?.id || (dataInit as any).managerUserId;

            // Set selected items với ID thực
            const dt = dataInit.deviceType?.typeName && deviceTypeId
                ? { label: dataInit.deviceType.typeName, value: deviceTypeId }
                : null;
            const un = dataInit.unit?.name && unitId
                ? { label: dataInit.unit.name, value: unitId }
                : null;
            const sup = dataInit.supplier?.supplierName && supplierId
                ? { label: dataInit.supplier.supplierName, value: supplierId }
                : null;
            const comp = dataInit.company?.name && companyId
                ? { label: dataInit.company.name, value: companyId }
                : null;
            const dep = dataInit.department?.name && departmentId
                ? { label: dataInit.department.name, value: departmentId }
                : null;
            const man = dataInit.manager?.name && managerId
                ? { label: dataInit.manager.name, value: managerId }
                : null;

            setSelectedDeviceType(dt);
            setSelectedUnit(un);
            setSelectedSupplier(sup);
            setSelectedCompany(comp);
            setSelectedDepartment(dep);
            setSelectedManager(man);

            // map images
            const images = [dataInit.image1, dataInit.image2, dataInit.image3].filter(Boolean) as string[];
            setFileList(
                images.map((url, idx) => ({
                    uid: String(idx + 1),
                    name: `image_${idx + 1}.jpg`,
                    status: "done",
                    url,
                }))
            );

            // Set frequency unit và mode
            const currentFreqUnit = dataInit.maintenanceFrequencyUnit || "MONTH";
            setFreqUnit(currentFreqUnit);

            // Xác định mode cho YEAR
            if (currentFreqUnit === "YEAR") {
                if (dataInit.maintenanceDayOfWeek && dataInit.maintenanceWeekOrder) {
                    setFreqModeYear("weekday");
                } else {
                    setFreqModeYear("anyday");
                }
            }

            // Set form values
            form.setFieldsValue({
                deviceCode: dataInit.deviceCode,
                accountingCode: dataInit.accountingCode,
                deviceName: dataInit.deviceName,
                deviceType: dt,
                unit: un,
                supplier: sup,
                company: comp,
                department: dep,
                manager: man,
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
                depreciationPeriodUnit: dataInit.depreciationPeriodUnit || "YEAR",
                maintenanceFrequencyValue: dataInit.maintenanceFrequencyValue,
                maintenanceFrequencyUnit: currentFreqUnit,
                maintenanceDayOfMonth: dataInit.maintenanceDayOfMonth,
                maintenanceDayOfWeek: dataInit.maintenanceDayOfWeek,
                maintenanceWeekOrder: dataInit.maintenanceWeekOrder,
                maintenanceMonth: dataInit.maintenanceMonth,
                note: (dataInit as any)?.note,
                status: dataInit.status || "NEW",
                ownershipType: dataInit.ownershipType || "INTERNAL",
                parts: (dataInit?.parts && dataInit.parts.length > 0)
                    ? dataInit.parts.map(p => ({
                        partCode: p.partCode,
                        partName: p.partName,
                        quantity: p.quantity ?? 1,
                    }))
                    : [{ partCode: "", partName: "", quantity: 1 }],
            });
        } else if (!isEdit && openModal) {
            // Reset cho create mode
            form.resetFields();
            setSelectedDeviceType(null);
            setSelectedUnit(null);
            setSelectedSupplier(null);
            setSelectedCompany(null);
            setSelectedDepartment(null);
            setSelectedManager(null);
            setFileList([]);
            setFreqUnit("MONTH");
            setFreqModeYear("anyday");

            form.setFieldsValue({
                maintenanceFrequencyUnit: "MONTH",
                depreciationPeriodUnit: "YEAR",
                status: "NEW",
                ownershipType: "INTERNAL",
                parts: [{ partCode: "", partName: "", quantity: 1 }],
            });
        }
    }, [dataInit, form, isEdit, openModal]);

    /** ==================== Upload handlers ==================== */
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

    /** ==================== Submit ==================== */
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

    const buildPayload = (values: any): ICreateDeviceRequest | IUpdateDeviceRequest => {
        const images = (fileList || []).map((f) => f.url).slice(0, 3);
        const [image1, image2, image3] = [images[0] || "", images[1] || "", images[2] || ""];

        const base: ICreateDeviceRequest = {
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
            status: (isEdit ? values.status : "NEW") as DeviceStatus,
            note: values.note,
        };

        base.parts = (values.parts || [])
            .filter((p: any) => p && (p.partCode || p.partName))
            .map((p: any) => ({
                partCode: String(p.partCode || "").trim(),
                partName: String(p.partName || "").trim(),
                quantity: Number(p.quantity || 1),
            }));

        return base;
    };

    const submitDevice = async (values: any) => {
        const payload = buildPayload(values);

        if (isEdit && dataInit?.id) {
            updateDevice(
                { id: dataInit.id as number, payload },
                { onSuccess: () => handleReset() }
            );
        } else {
            createDevice(payload as ICreateDeviceRequest, {
                onSuccess: () => handleReset(),
            });
        }
    };

    /** ==================== Derived UI ==================== */
    const showWeekFields = useMemo(() => freqUnit === "WEEK", [freqUnit]);
    const showMonthFields = useMemo(() => freqUnit === "MONTH", [freqUnit]);
    const showYearFields = useMemo(() => freqUnit === "YEAR", [freqUnit]);

    return (
        <ModalForm
            title={
                <Text strong style={{ fontSize: 18 }}>
                    {isEdit ? "Cập nhật thiết bị/công cụ dụng cụ" : "Thêm mới thiết bị/công cụ dụng cụ"}
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
                confirmLoading: isCreating || isUpdating,
                maskClosable: false,
                style: { top: 20 },
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitDevice}
        >
            <Row gutter={[20, 16]}>
                {/* Thông tin cơ bản */}
                <Col span={24}>
                    <Card size="small" title=" Thông tin cơ bản" bordered={false} style={{ background: '#fafafa' }}>
                        <Row gutter={[16, 8]}>
                            <Col lg={8} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Mã thiết bị"
                                    name="deviceCode"
                                    rules={[{ required: true, message: "Vui lòng nhập mã thiết bị" }]}
                                    placeholder="Nhập mã thiết bị"
                                />
                            </Col>
                            <Col lg={8} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Mã kế toán"
                                    name="accountingCode"
                                    placeholder="Nhập mã kế toán"
                                />
                            </Col>
                            <Col lg={8} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="ownershipType"
                                    label="Loại sở hữu"
                                    rules={[{ required: true, message: "Vui lòng chọn loại sở hữu" }]}
                                >
                                    <Radio.Group optionType="button" buttonStyle="solid">
                                        {OWNERSHIP_OPTIONS.map((o) => (
                                            <Radio.Button key={o.value} value={o.value}>
                                                {o.label}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                </ProForm.Item>
                            </Col>

                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Tên thiết bị"
                                    name="deviceName"
                                    rules={[{ required: true, message: "Vui lòng nhập tên thiết bị" }]}
                                    placeholder="Nhập tên thiết bị"
                                />
                            </Col>

                            <Col lg={6} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="deviceType"
                                    label="Loại thiết bị"
                                    rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                                >
                                    <DebounceSelect
                                        allowClear
                                        showSearch
                                        placeholder="Chọn loại thiết bị"
                                        fetchOptions={fetchDeviceTypeList}
                                        value={selectedDeviceType as any}
                                        onChange={(v: any) => setSelectedDeviceType(v as ISelectItem)}
                                        style={{ width: "100%" }}
                                    />
                                </ProForm.Item>
                            </Col>

                            <Col lg={6} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="unit"
                                    label="Đơn vị"
                                    rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
                                >
                                    <DebounceSelect
                                        allowClear
                                        showSearch
                                        placeholder="Chọn đơn vị"
                                        fetchOptions={fetchUnitList}
                                        value={selectedUnit as any}
                                        onChange={(v: any) => setSelectedUnit(v as ISelectItem)}
                                        style={{ width: "100%" }}
                                    />
                                </ProForm.Item>
                            </Col>

                            <Col lg={8} md={12} sm={24} xs={24}>
                                <ProFormDigit
                                    label="Đơn giá (VNĐ)"
                                    name="unitPrice"
                                    min={0}
                                    placeholder="Nhập đơn giá"
                                    fieldProps={{
                                        precision: 0,
                                        formatter: (value?: number) =>
                                            value ? `${Number(value).toLocaleString("vi-VN")} ₫` : "",
                                        parser: (value?: string) =>
                                            value ? Number(value.replace(/\s?₫|(,*)/g, "")) : 0,
                                    }}
                                    rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}
                                />
                            </Col>

                            <Col lg={8} md={12} sm={24} xs={24}>
                                {isEdit ? (
                                    <ProForm.Item name="status" label="Trạng thái">
                                        <Select options={STATUS_OPTIONS} placeholder="Chọn trạng thái" />
                                    </ProForm.Item>
                                ) : (
                                    <ProForm.Item label="Trạng thái">
                                        <Text strong>Mới tạo (NEW)</Text>
                                    </ProForm.Item>
                                )}
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Linh kiện */}
                <Col span={24}>
                    <Card size="small" title=" Linh kiện / Vật tư" bordered={false} style={{ background: '#fafafa' }}>
                        <ProFormList
                            name="parts"
                            alwaysShowItemLabel
                            creatorButtonProps={{
                                position: "bottom",
                                creatorButtonText: "+ Thêm linh kiện",
                                type: "dashed",
                            }}
                            copyIconProps={false}
                            deleteIconProps={{ tooltipText: "Xóa dòng này" }}
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (!value || value.length === 0) {
                                            return Promise.reject(new Error("Vui lòng thêm ít nhất 1 linh kiện"));
                                        }
                                    },
                                },
                            ]}
                        >
                            <ProFormGroup>
                                <Row gutter={[16, 8]} style={{ width: "100%" }}>
                                    <Col lg={10} md={10} sm={24} xs={24}>
                                        <ProFormText
                                            name="partCode"
                                            label="Mã linh kiện"
                                            placeholder="Nhập mã linh kiện"
                                            rules={[{ required: true, message: "Nhập mã" }]}
                                        />
                                    </Col>
                                    <Col lg={10} md={10} sm={24} xs={24}>
                                        <ProFormText
                                            name="partName"
                                            label="Tên linh kiện"
                                            placeholder="Nhập tên linh kiện"
                                            rules={[{ required: true, message: "Nhập tên" }]}
                                        />
                                    </Col>
                                    <Col lg={4} md={4} sm={24} xs={24}>
                                        <ProFormDigit
                                            name="quantity"
                                            label="Số lượng"
                                            min={1}
                                            placeholder="SL"
                                            fieldProps={{ precision: 0 }}
                                            rules={[{ required: true, message: "Nhập SL" }]}
                                        />
                                    </Col>
                                </Row>
                            </ProFormGroup>
                        </ProFormList>
                    </Card>
                </Col>

                {/* Thông số kỹ thuật */}
                <Col span={24}>
                    <Card size="small" title=" Thông số kỹ thuật" bordered={false} style={{ background: '#fafafa' }}>
                        <Row gutter={[16, 8]}>
                            <Col lg={8} md={12} sm={24} xs={24}>
                                <ProFormText label="Nhãn hiệu" name="brand" placeholder="Nhập tên nhãn hiệu" />
                            </Col>
                            <Col lg={8} md={12} sm={24} xs={24}>
                                <ProFormText label="Model" name="modelDesc" placeholder="Nhập số Model" />
                            </Col>
                            <Col lg={8} md={12} sm={24} xs={24}>
                                <ProFormText label="Công suất" name="powerCapacity" placeholder="Nhập công suất" />
                            </Col>

                            <Col lg={8} md={8} sm={24} xs={24}>
                                <ProFormDigit label="Chiều dài (cm)" name="length" min={0} fieldProps={{ precision: 2 }} placeholder="Dài" />
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <ProFormDigit label="Chiều rộng (cm)" name="width" min={0} fieldProps={{ precision: 2 }} placeholder="Rộng" />
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <ProFormDigit label="Chiều cao (cm)" name="height" min={0} fieldProps={{ precision: 2 }} placeholder="Cao" />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Thông tin đơn vị quản lý */}
                <Col span={24}>
                    <Card size="small" title=" Đơn vị quản lý" bordered={false} style={{ background: '#fafafa' }}>
                        <Row gutter={[16, 8]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="supplier"
                                    label="Nhà cung cấp"
                                    rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
                                >
                                    <DebounceSelect
                                        allowClear
                                        showSearch
                                        placeholder="Chọn nhà cung cấp"
                                        fetchOptions={fetchSupplierList}
                                        value={selectedSupplier as any}
                                        onChange={(v: any) => setSelectedSupplier(v as ISelectItem)}
                                        style={{ width: "100%" }}
                                    />
                                </ProForm.Item>
                            </Col>

                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="company"
                                    label="Công ty"
                                    rules={[{ required: true, message: "Vui lòng chọn công ty" }]}
                                >
                                    <DebounceSelect
                                        allowClear
                                        showSearch
                                        placeholder="Chọn công ty"
                                        fetchOptions={fetchCompanyList}
                                        value={selectedCompany as any}
                                        onChange={(v: any) => setSelectedCompany(v as ISelectItem)}
                                        style={{ width: "100%" }}
                                    />
                                </ProForm.Item>
                            </Col>

                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="department"
                                    label="Phòng ban/Nhà hàng"
                                    rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
                                >
                                    <DebounceSelect
                                        allowClear
                                        showSearch
                                        placeholder="Chọn phòng ban/nhà hàng"
                                        fetchOptions={fetchDepartmentList}
                                        value={selectedDepartment as any}
                                        onChange={(v: any) => setSelectedDepartment(v as ISelectItem)}
                                        style={{ width: "100%" }}
                                    />
                                </ProForm.Item>
                            </Col>

                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="manager"
                                    label="Nhân viên quản lý"
                                    rules={[{ required: true, message: "Vui lòng chọn nhân viên quản lý" }]}
                                >
                                    <DebounceSelect
                                        allowClear
                                        showSearch
                                        placeholder="Chọn nhân viên quản lý"
                                        fetchOptions={fetchManagerList}
                                        value={selectedManager as any}
                                        onChange={(v: any) => setSelectedManager(v as ISelectItem)}
                                        style={{ width: "100%" }}
                                    />
                                </ProForm.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Hình ảnh */}
                <Col span={24}>
                    <Card size="small" title=" Hình ảnh thiết bị (tối đa 3 ảnh)" bordered={false} style={{ background: '#fafafa' }}>
                        <Form.Item
                            name="images"
                            rules={[
                                {
                                    validator: () => {
                                        if (fileList.length > 0) return Promise.resolve();
                                        return Promise.reject("Vui lòng upload ít nhất 1 hình ảnh");
                                    },
                                },
                            ]}
                        >
                            <Upload {...uploadProps}>
                                {fileList.length >= 3 ? null : (
                                    <div>
                                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>

                        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                            <img alt="preview" style={{ width: "100%" }} src={previewImage} />
                        </Modal>
                    </Card>
                </Col>

                {/* Thời gian & Bảo hành */}
                <Col span={24}>
                    <Card size="small" title=" Thời gian & Bảo hành" bordered={false} style={{ background: '#fafafa' }}>
                        <Row gutter={[16, 8]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormDatePicker
                                    label="Ngày đưa vào sử dụng"
                                    name="startDate"
                                    rules={[{ required: true, message: "Chọn ngày đưa vào sử dụng" }]}
                                    placeholder="Chọn ngày"
                                    fieldProps={{ style: { width: '100%' } }}
                                />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormDatePicker
                                    label="Ngày hết hạn bảo hành"
                                    name="warrantyExpiryDate"
                                    rules={[{ required: true, message: "Chọn ngày hết bảo hành" }]}
                                    placeholder="Chọn ngày"
                                    fieldProps={{ style: { width: '100%' } }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Khấu hao */}
                <Col span={24}>
                    <Card size="small" title=" Thời gian khấu hao" bordered={false} style={{ background: '#fafafa' }}>
                        <Row gutter={[16, 8]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormDigit
                                    label="Số kỳ khấu hao"
                                    name="depreciationPeriodValue"
                                    min={1}
                                    placeholder="Nhập số kỳ"
                                    rules={[{ required: true, message: "Nhập số kỳ khấu hao" }]}
                                />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="depreciationPeriodUnit"
                                    label="Đơn vị thời gian"
                                    rules={[{ required: true, message: "Chọn đơn vị" }]}
                                >
                                    <Select
                                        options={DEPRE_UNITS.map((u) => ({
                                            label: u === "MONTH" ? "Tháng" : u === "QUARTER" ? "Quý" : "Năm",
                                            value: u
                                        }))}
                                        placeholder="Chọn đơn vị"
                                    />
                                </ProForm.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Bảo dưỡng */}
                <Col span={24}>
                    <Card size="small" title=" Tần suất bảo dưỡng" bordered={false} style={{ background: '#fafafa' }}>
                        <Row gutter={[16, 8]}>
                            <Col lg={8} md={12} sm={24} xs={24}>
                                <ProFormDigit
                                    label="Tần suất (số lần)"
                                    name="maintenanceFrequencyValue"
                                    min={1}
                                    placeholder="Nhập số lần"
                                    rules={[{ required: true, message: "Nhập số lần" }]}
                                />
                            </Col>
                            <Col lg={16} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="maintenanceFrequencyUnit"
                                    label="Đơn vị thời gian"
                                    rules={[{ required: true, message: "Chọn đơn vị" }]}
                                >
                                    <Radio.Group
                                        optionType="button"
                                        buttonStyle="solid"
                                        onChange={(e) => setFreqUnit(e.target.value)}
                                    >
                                        {FREQ_UNITS.map((u) => (
                                            <Radio.Button key={u} value={u}>
                                                {u === "DAY" ? "Ngày" : u === "WEEK" ? "Tuần" : u === "MONTH" ? "Tháng" : "Năm"}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                </ProForm.Item>
                            </Col>

                            {/* WEEK: Vào thứ + thứ tự tuần */}
                            {showWeekFields && (
                                <>
                                    <Col lg={12} md={12} sm={24} xs={24}>
                                        <ProForm.Item
                                            name="maintenanceDayOfWeek"
                                            label="Vào thứ"
                                            rules={[{ required: true, message: "Chọn thứ" }]}
                                        >
                                            <Select options={WEEK_DAYS} placeholder="Chọn thứ" />
                                        </ProForm.Item>
                                    </Col>
                                    <Col lg={12} md={12} sm={24} xs={24}>
                                        <ProForm.Item
                                            name="maintenanceWeekOrder"
                                            label="Thuộc tuần"
                                            rules={[{ required: true, message: "Chọn thứ tự tuần" }]}
                                        >
                                            <Select options={WEEK_ORDERS} placeholder="Chọn thứ tự tuần" />
                                        </ProForm.Item>
                                    </Col>
                                </>
                            )}

                            {/* MONTH: ngày trong tháng */}
                            {showMonthFields && (
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <ProFormDigit
                                        label="Ngày trong tháng"
                                        name="maintenanceDayOfMonth"
                                        min={1}
                                        max={31}
                                        placeholder="Nhập ngày (1-31)"
                                        rules={[{ required: true, message: "Nhập ngày trong tháng" }]}
                                    />
                                </Col>
                            )}

                            {/* YEAR: 2 chế độ */}
                            {showYearFields && (
                                <>
                                    <Col span={24}>
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Space align="center">
                                                <Radio
                                                    checked={freqModeYear === "anyday"}
                                                    onChange={() => setFreqModeYear("anyday")}
                                                />
                                                <Text>Vào ngày bất kỳ trong tháng</Text>
                                                <Form.Item
                                                    name="maintenanceMonth"
                                                    style={{ margin: 0 }}
                                                    rules={[
                                                        {
                                                            required: freqModeYear === "anyday",
                                                            message: "Chọn tháng"
                                                        }
                                                    ]}
                                                >
                                                    <Select
                                                        disabled={freqModeYear !== "anyday"}
                                                        placeholder="Chọn tháng"
                                                        options={MONTHS}
                                                        style={{ width: 180 }}
                                                    />
                                                </Form.Item>
                                            </Space>

                                            <Space align="center" wrap>
                                                <Radio
                                                    checked={freqModeYear === "weekday"}
                                                    onChange={() => setFreqModeYear("weekday")}
                                                />
                                                <Text>Vào thứ</Text>
                                                <Form.Item
                                                    name="maintenanceDayOfWeek"
                                                    style={{ margin: 0 }}
                                                    rules={[
                                                        {
                                                            required: freqModeYear === "weekday",
                                                            message: "Chọn thứ"
                                                        }
                                                    ]}
                                                >
                                                    <Select
                                                        disabled={freqModeYear !== "weekday"}
                                                        placeholder="Chọn thứ"
                                                        options={WEEK_DAYS}
                                                        style={{ width: 140 }}
                                                    />
                                                </Form.Item>
                                                <Text>Thuộc tuần</Text>
                                                <Form.Item
                                                    name="maintenanceWeekOrder"
                                                    style={{ margin: 0 }}
                                                    rules={[
                                                        {
                                                            required: freqModeYear === "weekday",
                                                            message: "Chọn tuần"
                                                        }
                                                    ]}
                                                >
                                                    <Select
                                                        disabled={freqModeYear !== "weekday"}
                                                        placeholder="Chọn tuần"
                                                        options={WEEK_ORDERS}
                                                        style={{ width: 140 }}
                                                    />
                                                </Form.Item>
                                                <Text>Thuộc tháng</Text>
                                                <Form.Item
                                                    name="maintenanceMonth"
                                                    style={{ margin: 0 }}
                                                    rules={[
                                                        {
                                                            required: freqModeYear === "weekday",
                                                            message: "Chọn tháng"
                                                        }
                                                    ]}
                                                >
                                                    <Select
                                                        disabled={freqModeYear !== "weekday"}
                                                        placeholder="Chọn tháng"
                                                        options={MONTHS}
                                                        style={{ width: 140 }}
                                                    />
                                                </Form.Item>
                                            </Space>
                                        </Space>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </Card>
                </Col>

                {/* Ghi chú */}
                <Col span={24}>
                    <Card size="small" title=" Ghi chú" bordered={false} style={{ background: '#fafafa' }}>
                        <ProFormTextArea
                            name="note"
                            placeholder="Nhập ghi chú bổ sung (nếu có)"
                            fieldProps={{
                                autoSize: { minRows: 3, maxRows: 5 },
                                maxLength: 500,
                                showCount: true,
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalDevice;