import { ModalForm, ProForm, ProFormText, ProFormDigit } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import type { IInventoryItem } from "@/types/backend";
import { DebounceSelect } from "@/components/admin/debouce.select";
import {
    useCreateInventoryItemMutation,
    useUpdateInventoryItemMutation,
} from "@/hooks/useInventoryItems";
import {
    callFetchUnit,
    callFetchDeviceType,
    callFetchWarehouse,
    callFetchMaterialSupplier,
    callFetchInventoryItemById,
} from "@/config/api";

export interface ISelectItem {
    label?: string;
    value: number | string;
}


interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IInventoryItem | null;
    setDataInit: (v: any) => void;
}

const ModalInventoryItem = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const [selectedUnit, setSelectedUnit] = useState<ISelectItem | null>(null);
    const [selectedDeviceType, setSelectedDeviceType] = useState<ISelectItem | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<ISelectItem | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<ISelectItem | null>(null);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

    const { mutate: createItem, isPending: isCreating } = useCreateInventoryItemMutation();
    const { mutate: updateItem, isPending: isUpdating } = useUpdateInventoryItemMutation();

    /** ==================== Load chi tiết khi edit ==================== */
    useEffect(() => {
        const fetchDetail = async (id: number | string) => {
            setLoadingDetail(true);
            try {
                const res = await callFetchInventoryItemById(id);
                const detail = res?.data;
                if (detail) {
                    const unit = detail.unit
                        ? { label: detail.unit.name, value: detail.unit.id }
                        : null;
                    const deviceType = detail.deviceType
                        ? { label: detail.deviceType.typeName, value: detail.deviceType.id }
                        : null;
                    const warehouse = detail.warehouse
                        ? { label: detail.warehouse.warehouseName, value: detail.warehouse.id }
                        : null;
                    const supplier = detail.materialSupplier
                        ? { label: detail.materialSupplier.supplierName, value: detail.materialSupplier.id }
                        : null;

                    // set state chọn
                    setSelectedUnit(unit);
                    setSelectedDeviceType(deviceType);
                    setSelectedWarehouse(warehouse);
                    setSelectedSupplier(supplier);

                    form.setFieldsValue({
                        itemCode: detail.itemCode,
                        itemName: detail.itemName,
                        quantity: detail.quantity,
                        unitPrice: detail.unitPrice,
                        unit,
                        deviceType,
                        warehouse,
                        materialSupplier: supplier,
                    });
                }
            } catch (err) {
                console.error("Không thể load chi tiết vật tư tồn kho:", err);
            } finally {
                setLoadingDetail(false);
            }
        };

        if (openModal && dataInit?.id) {
            fetchDetail(dataInit.id);
        } else if (!openModal) {
            handleReset();
        }
    }, [openModal, dataInit, form]);

    /** ==================== Reset modal ==================== */
    const handleReset = () => {
        form.resetFields();
        setSelectedUnit(null);
        setSelectedDeviceType(null);
        setSelectedWarehouse(null);
        setSelectedSupplier(null);
        setDataInit(null);
        setOpenModal(false);
    };

    /** ==================== Submit form ==================== */
    const submitForm = async (values: any) => {
        const payload: IInventoryItem = {
            id: dataInit?.id,
            itemCode: values.itemCode,
            itemName: values.itemName,
            quantity: Number(values.quantity),
            unitPrice: Number(values.unitPrice),
            unit: { id: values.unit?.value },
            deviceType: { id: values.deviceType?.value },
            warehouse: { id: values.warehouse?.value },
            materialSupplier: { id: values.materialSupplier?.value },
        };

        if (isEdit) {
            updateItem(payload, { onSuccess: handleReset });
        } else {
            createItem(payload, { onSuccess: handleReset });
        }
    };

    /** ==================== Fetch dropdown ==================== */
    async function fetchUnitList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchUnit(`page=1&size=100&name=/${name}/i`);
        return res?.data?.result?.map((i: any) => ({ label: i.name, value: i.id })) || [];
    }

    async function fetchDeviceTypeList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchDeviceType(`page=1&size=100&typeName=/${name}/i`);
        return res?.data?.result?.map((i: any) => ({ label: i.typeName, value: i.id })) || [];
    }

    async function fetchWarehouseList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchWarehouse(`page=1&size=100&warehouseName=/${name}/i`);
        return res?.data?.result?.map((i: any) => ({ label: i.warehouseName, value: i.id })) || [];
    }

    async function fetchSupplierList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchMaterialSupplier(`page=1&size=100&supplierName=/${name}/i`);
        return res?.data?.result?.map((i: any) => ({ label: i.supplierName, value: i.id })) || [];
    }

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật vật tư tồn kho" : "Thêm mới vật tư tồn kho"}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 800,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating || loadingDetail,
                maskClosable: false,
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitForm}
        >
            <Row gutter={16}>
                <Col lg={12}>
                    <ProFormText
                        label="Mã vật tư"
                        name="itemCode"
                        disabled={isEdit}
                        rules={[{ required: true, message: "Vui lòng nhập mã vật tư" }]}
                        placeholder="Nhập mã vật tư"
                    />
                </Col>

                <Col lg={12}>
                    <ProFormText
                        label="Tên vật tư"
                        name="itemName"
                        rules={[{ required: true, message: "Vui lòng nhập tên vật tư" }]}
                        placeholder="Nhập tên vật tư"
                    />
                </Col>

                <Col lg={12}>
                    <ProFormDigit
                        label="Số lượng"
                        name="quantity"
                        min={0}
                        rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                        placeholder="Nhập số lượng"
                    />
                </Col>

                <ProFormDigit
                    label="Đơn giá (₫)"
                    name="unitPrice"
                    min={0}
                    rules={[
                        { required: true, message: "Vui lòng nhập đơn giá" },
                        {
                            validator: (_, value) =>
                                value > 0
                                    ? Promise.resolve()
                                    : Promise.reject("Đơn giá phải lớn hơn 0"),
                        },
                    ]}
                    fieldProps={{
                        formatter: (value) =>
                            value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "",
                        parser: (value?: string) =>
                            value ? Number(value.replace(/₫|,/g, "")) : 0,
                    }}
                    placeholder="Nhập đơn giá"
                />
                <Col lg={12}>
                    <ProForm.Item
                        name="unit"
                        label="Đơn vị tính"
                        rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
                    >
                        <DebounceSelect
                            placeholder="Chọn đơn vị"
                            fetchOptions={fetchUnitList}
                            value={selectedUnit as any}
                            onChange={(v: any) => {
                                setSelectedUnit(v);
                                form.setFieldsValue({ unit: v });
                            }}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>

                <Col lg={12}>
                    <ProForm.Item
                        name="deviceType"
                        label="Loại thiết bị"
                        rules={[{ required: true, message: "Vui lòng chọn loại thiết bị" }]}
                    >
                        <DebounceSelect
                            placeholder="Chọn loại thiết bị"
                            fetchOptions={fetchDeviceTypeList}
                            value={selectedDeviceType as any}
                            onChange={(v: any) => {
                                setSelectedDeviceType(v);
                                form.setFieldsValue({ deviceType: v });
                            }}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>

                <Col lg={12}>
                    <ProForm.Item
                        name="warehouse"
                        label="Kho chứa"
                        rules={[{ required: true, message: "Vui lòng chọn kho" }]}
                    >
                        <DebounceSelect
                            placeholder="Chọn kho"
                            fetchOptions={fetchWarehouseList}
                            value={selectedWarehouse as any}
                            onChange={(v: any) => {
                                setSelectedWarehouse(v);
                                form.setFieldsValue({ warehouse: v });
                            }}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>

                <Col lg={12}>
                    <ProForm.Item
                        name="materialSupplier"
                        label="Nhà cung cấp"
                        rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
                    >
                        <DebounceSelect
                            placeholder="Chọn nhà cung cấp"
                            fetchOptions={fetchSupplierList}
                            value={selectedSupplier as any}
                            onChange={(v: any) => {
                                setSelectedSupplier(v);
                                form.setFieldsValue({ materialSupplier: v });
                            }}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalInventoryItem;
