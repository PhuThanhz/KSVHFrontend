import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useMemo, useState } from "react";
import type { IDeviceType } from "@/types/backend";
import { DebounceSelect } from "@/components/common/debouce.select";
import {
    useCreateDeviceTypeMutation,
    useUpdateDeviceTypeMutation,
} from "@/hooks/useDeviceTypes";
import { callFetchAssetType } from "@/config/api";

export interface ISelectItem {
    key?: string;
    label: React.ReactNode;
    value: string | number;
}

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IDeviceType | null;
    setDataInit: (v: any) => void;
}

const ModalDeviceType = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const { mutate: createDeviceType, isPending: isCreating } = useCreateDeviceTypeMutation();
    const { mutate: updateDeviceType, isPending: isUpdating } = useUpdateDeviceTypeMutation();

    /** ==================== Fetch chi tiết khi edit ==================== */
    useEffect(() => {
        const fetchDetail = async (id: number | string) => {
            setLoadingDetail(true);
            try {
                // Không cần gọi API riêng nếu dataInit đã có đầy đủ thông tin.
                const detail = dataInit;
                if (detail) {
                    form.setFieldsValue({
                        deviceTypeCode: detail.deviceTypeCode,
                        typeName: detail.typeName,
                        assetType: detail.assetType
                            ? {
                                label: detail.assetType.assetTypeName,
                                value: detail.assetType.id,
                            }
                            : undefined,
                    });
                }
            } catch (err) {
                console.error("Không thể load chi tiết loại thiết bị:", err);
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
        const payload: IDeviceType = {
            id: dataInit?.id,
            deviceTypeCode: values.deviceTypeCode,
            typeName: values.typeName,
            assetType: { id: Number(values.assetType?.value) },
        };

        const mutation = isEdit ? updateDeviceType : createDeviceType;
        mutation(payload, { onSuccess: handleReset });
    };

    /** ==================== Fetch danh sách loại tài sản ==================== */
    const fetchAssetTypeList = async (name: string): Promise<ISelectItem[]> => {
        const res = await callFetchAssetType(`page=1&size=50&assetTypeName=/${name}/i`);
        return (
            res?.data?.result?.map((item: any) => ({
                label: item.assetTypeName,
                value: item.id,
            })) || []
        );
    };

    /** ==================== Initial Values ==================== */
    const initialValues = useMemo(() => ({}), []);

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật loại thiết bị" : "Tạo mới loại thiết bị"}
            open={openModal}
            form={form}
            initialValues={initialValues}
            onFinish={submitForm}
            preserve={false}
            scrollToFirstError
            modalProps={{
                onCancel: handleReset,
                afterClose: () => form.resetFields(),
                destroyOnClose: true,
                width: isMobile ? "100%" : 700,
                maskClosable: false,
                keyboard: false,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating || loadingDetail,
            }}
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
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalDeviceType;
