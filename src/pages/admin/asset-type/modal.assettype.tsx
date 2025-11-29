import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { IAssetType } from "@/types/backend";
import {
    useCreateAssetTypeMutation,
    useUpdateAssetTypeMutation,
} from "@/hooks/useAssetTypes";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IAssetType | null;
    setDataInit: (v: any) => void;
}

const ModalAssetType = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createAssetType, isPending: isCreating } = useCreateAssetTypeMutation();
    const { mutate: updateAssetType, isPending: isUpdating } = useUpdateAssetTypeMutation();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                assetTypeCode: dataInit.assetTypeCode,
                assetTypeName: dataInit.assetTypeName,
            });
        } else {
            form.resetFields();
        }
    }, [dataInit, form]);

    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    const submitAssetType = async (valuesForm: IAssetType) => {
        if (isEdit) {
            updateAssetType({ ...dataInit, ...valuesForm }, { onSuccess: () => handleReset() });
        } else {
            createAssetType(valuesForm, { onSuccess: () => handleReset() });
        }
    };

    return (
        <ModalForm
            title={isEdit ? "Cập nhật loại tài sản" : "Tạo mới loại tài sản"}
            open={openModal}
            modalProps={{
                onCancel: () => handleReset(),
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 600,
                keyboard: false,
                maskClosable: false,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
            }}
            form={form}
            onFinish={submitAssetType}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <ProFormText
                        label="Mã loại tài sản"
                        name="assetTypeCode"
                        rules={[{ required: true, message: "Vui lòng nhập mã loại tài sản" }]}
                        placeholder="Nhập mã loại tài sản"
                        disabled={isEdit}
                    />
                </Col>
                <Col span={12}>
                    <ProFormText
                        label="Tên loại tài sản"
                        name="assetTypeName"
                        rules={[{ required: true, message: "Vui lòng nhập tên loại tài sản" }]}
                        placeholder="Nhập tên loại tài sản"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalAssetType;
