import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import type { IDeviceType } from "@/types/backend";
import { DebounceSelect } from "@/components/admin/debouce.select";
import {
    useCreateDeviceTypeMutation,
    useUpdateDeviceTypeMutation,
} from "@/hooks/useDeviceTypes";
import { callFetchAssetType } from "@/config/api";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IDeviceType | null;
    setDataInit: (v: any) => void;
}

export interface IAssetTypeSelect {
    label?: string;
    value: string | number;
    key?: string | number;
}

const ModalDeviceType = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const [selectedAssetType, setSelectedAssetType] = useState<IAssetTypeSelect | null>(null);
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createDeviceType, isPending: isCreating } = useCreateDeviceTypeMutation();
    const { mutate: updateDeviceType, isPending: isUpdating } = useUpdateDeviceTypeMutation();

    /** ==================== Khi mở modal: fill dữ liệu nếu có ==================== */
    useEffect(() => {
        if (dataInit?.id) {
            const assetTypeItem = dataInit.assetType
                ? {
                    label: dataInit.assetType.assetTypeName,
                    value: dataInit.assetType.id,
                    key: dataInit.assetType.id,
                }
                : null;

            // Gán selected trước để DebounceSelect nhận value
            setSelectedAssetType(assetTypeItem);

            // Dùng timeout để đợi modal và form mount xong rồi fill dữ liệu
            setTimeout(() => {
                form.setFieldsValue({
                    deviceTypeCode: dataInit.deviceTypeCode,
                    typeName: dataInit.typeName,
                    assetType: assetTypeItem,
                });
            }, 0);
        } else {
            form.resetFields();
            setSelectedAssetType(null);
        }
    }, [dataInit, form]);

    /** ==================== Reset modal ==================== */
    const handleReset = () => {
        form.resetFields();
        setSelectedAssetType(null);
        setDataInit(null);
        setOpenModal(false);
    };

    /** ==================== Submit ==================== */
    const submitDeviceType = async (values: any) => {
        const { deviceTypeCode, typeName, assetType } = values;

        const payload: IDeviceType = dataInit?.id
            ? {
                id: dataInit.id,
                deviceTypeCode,
                typeName,
                assetType: { id: Number(assetType?.value) },
            }
            : {
                deviceTypeCode,
                typeName,
                assetType: { id: Number(assetType?.value) },
            };

        if (isEdit) {
            updateDeviceType(payload, { onSuccess: handleReset });
        } else {
            createDeviceType(payload, { onSuccess: handleReset });
        }
    };

    /** ==================== Fetch danh sách loại tài sản ==================== */
    async function fetchAssetTypeList(name: string): Promise<IAssetTypeSelect[]> {
        const res = await callFetchAssetType(`page=1&size=50&assetTypeName=/${name}/i`);
        if (res?.data) {
            return res.data.result.map((item: any) => ({
                label: item.assetTypeName,
                value: item.id,
            }));
        }
        return [];
    }

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật loại thiết bị" : "Tạo mới loại thiết bị"}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 700,
                keyboard: false,
                maskClosable: false,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
            }}
            form={form}
            onFinish={submitDeviceType}
            preserve={false}
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Mã loại thiết bị"
                        name="deviceTypeCode"
                        disabled={isEdit}
                        rules={[{ required: true, message: "Vui lòng nhập mã loại thiết bị" }]}
                        placeholder="Nhập mã loại thiết bị"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên loại thiết bị"
                        name="typeName"
                        rules={[{ required: true, message: "Vui lòng nhập tên loại thiết bị" }]}
                        placeholder="Nhập tên loại thiết bị"
                    />
                </Col>

                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProForm.Item
                        name="assetType"
                        label="Loại tài sản"
                        rules={[{ required: true, message: "Vui lòng chọn loại tài sản" }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn loại tài sản"
                            fetchOptions={fetchAssetTypeList}
                            value={selectedAssetType as any}
                            onChange={(newValue: any) =>
                                setSelectedAssetType(newValue as IAssetTypeSelect)
                            }
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalDeviceType;
