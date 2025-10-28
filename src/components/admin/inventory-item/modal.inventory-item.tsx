import { ModalForm, ProForm, ProFormText, ProFormDigit } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useMemo, useState } from "react";
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
    key?: string;
    label: React.ReactNode;
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
    const [loadingDetail, setLoadingDetail] = useState(false);

    const { mutate: createItem, isPending: isCreating } = useCreateInventoryItemMutation();
    const { mutate: updateItem, isPending: isUpdating } = useUpdateInventoryItemMutation();

    /** ==================== Fetch chi tiết khi edit ==================== */
    useEffect(() => {
        const fetchDetail = async (id: number | string) => {
            setLoadingDetail(true);
            try {
                const res = await callFetchInventoryItemById(id);
                const detail = res?.data;
                if (detail) {
                    form.setFieldsValue({
                        itemCode: detail.itemCode,
                        itemName: detail.itemName,
                        quantity: detail.quantity,
                        unitPrice: detail.unitPrice,
                        unit: detail.unit ? { label: detail.unit.name, value: detail.unit.id } : undefined,
                        deviceType: detail.deviceType
                            ? { label: detail.deviceType.typeName, value: detail.deviceType.id }
                            : undefined,
                        warehouse: detail.warehouse
                            ? { label: detail.warehouse.warehouseName, value: detail.warehouse.id }
                            : undefined,
                        materialSupplier: detail.materialSupplier
                            ? {
                                label: detail.materialSupplier.supplierName,
                                value: detail.materialSupplier.id,
                            }
                            : undefined,
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
            form.resetFields();
        }
    }, [openModal, dataInit, form]);

    /** ==================== Reset modal ==================== */
    const handleReset = () => {
        form.resetFields();
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
            unit: { id: Number(values.unit?.value) },
            deviceType: { id: Number(values.deviceType?.value) },
            warehouse: { id: Number(values.warehouse?.value) },
            materialSupplier: { id: Number(values.materialSupplier?.value) },
        };

        const mutation = isEdit ? updateItem : createItem;
        mutation(payload, { onSuccess: handleReset });
    };

    /** ==================== Fetch dropdowns ==================== */
    const fetchUnitList = async (name: string): Promise<ISelectItem[]> => {
        const res = await callFetchUnit(`page=1&size=100&name=/${name}/i`);
        return res?.data?.result?.map((i: any) => ({ label: i.name, value: i.id })) || [];
    };

    const fetchDeviceTypeList = async (name: string): Promise<ISelectItem[]> => {
        const res = await callFetchDeviceType(`page=1&size=100&typeName=/${name}/i`);
        return res?.data?.result?.map((i: any) => ({ label: i.typeName, value: i.id })) || [];
    };

    const fetchWarehouseList = async (name: string): Promise<ISelectItem[]> => {
        const res = await callFetchWarehouse(`page=1&size=100&warehouseName=/${name}/i`);
        return res?.data?.result?.map((i: any) => ({ label: i.warehouseName, value: i.id })) || [];
    };

    const fetchSupplierList = async (name: string): Promise<ISelectItem[]> => {
        const res = await callFetchMaterialSupplier(`page=1&size=100&supplierName=/${name}/i`);
        return res?.data?.result?.map((i: any) => ({ label: i.supplierName, value: i.id })) || [];
    };

    /** ==================== Initial Values ==================== */
    const initialValues = useMemo(() => ({}), []);

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật vật tư tồn kho" : "Thêm mới vật tư tồn kho"}
            open={openModal}
            form={form}
            onFinish={submitForm}
            initialValues={initialValues}
            scrollToFirstError
            preserve={false}
            modalProps={{
                onCancel: handleReset,
                afterClose: () => form.resetFields(),
                destroyOnClose: true,
                width: isMobile ? "100%" : 800,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating || loadingDetail,
                maskClosable: false,
            }}
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

                <Col lg={12}>
                    <ProFormDigit
                        label="Đơn giá (₫)"
                        name="unitPrice"
                        min={0}
                        rules={[
                            { required: true, message: "Vui lòng nhập đơn giá" },
                            {
                                validator: (_, value) =>
                                    value > 0 ? Promise.resolve() : Promise.reject("Đơn giá phải lớn hơn 0"),
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
                </Col>

                <Col lg={12}>
                    <ProForm.Item
                        name="unit"
                        label="Đơn vị tính"
                        rules={[{ required: true, message: "Vui lòng chọn đơn vị" }]}
                    >
                        <DebounceSelect
                            placeholder="Chọn đơn vị"
                            fetchOptions={fetchUnitList}
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
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalInventoryItem;
