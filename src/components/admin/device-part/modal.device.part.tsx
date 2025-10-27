import { ModalForm, ProForm, ProFormText, ProFormDigit } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import type { IDevicePart } from "@/types/backend";
import { useCreateDevicePartMutation, useUpdateDevicePartMutation } from "@/hooks/useDeviceParts";
import { callFetchDeviceType } from "@/config/api";
import { DebounceSelect } from "../debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IDevicePart | null;
    setDataInit: (v: any) => void;
}

export interface ISelectItem {
    label?: string;
    value: number | string;
}

const ModalDevicePart = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);
    const [selectedDevice, setSelectedDevice] = useState<ISelectItem | null>(null);

    const { mutate: createPart, isPending: isCreating } = useCreateDevicePartMutation();
    const { mutate: updatePart, isPending: isUpdating } = useUpdateDevicePartMutation();

    /** ==================== Set dữ liệu khi mở modal ==================== */
    useEffect(() => {
        if (dataInit?.id) {
            const deviceItem = dataInit.device
                ? { label: dataInit.device.name, value: dataInit.device.id }
                : null;

            setSelectedDevice(deviceItem);

            form.setFieldsValue({
                partCode: dataInit.partCode,
                partName: dataInit.partName,
                quantity: dataInit.quantity,
                device: deviceItem,
            });
        } else {
            form.resetFields();
            setSelectedDevice(null);
        }
    }, [dataInit, form]);

    /** ==================== Reset modal ==================== */
    const handleReset = () => {
        form.resetFields();
        setSelectedDevice(null);
        setDataInit(null);
        setOpenModal(false);
    };

    /** ==================== Submit form ==================== */
    const submitDevicePart = async (values: any) => {
        const payload: IDevicePart = {
            partCode: values.partCode,
            partName: values.partName,
            quantity: values.quantity,
            device: { id: Number(values.device?.value) },
        };

        if (isEdit && dataInit?.id) {
            updatePart(
                { id: dataInit.id, payload },
                { onSuccess: () => handleReset() }
            );
        } else {
            createPart(payload, { onSuccess: () => handleReset() });
        }
    };

    /** ==================== Fetch danh sách thiết bị ==================== */
    async function fetchDeviceList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchDeviceType(`page=1&size=100&typeName=/${name}/i`);
        return (
            res?.data?.result?.map((item: any) => ({
                label: item.typeName,
                value: item.id,
            })) || []
        );
    }

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật linh kiện" : "Tạo mới linh kiện"}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 700,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
                maskClosable: false,
            }}
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitDevicePart}
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Mã linh kiện"
                        name="partCode"
                        rules={[{ required: true, message: "Vui lòng nhập mã linh kiện" }]}
                        placeholder="Nhập mã linh kiện"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên linh kiện"
                        name="partName"
                        rules={[{ required: true, message: "Vui lòng nhập tên linh kiện" }]}
                        placeholder="Nhập tên linh kiện"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormDigit
                        label="Số lượng"
                        name="quantity"
                        min={1}
                        rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                        placeholder="Nhập số lượng"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProForm.Item
                        name="device"
                        label="Thiết bị"
                        rules={[{ required: true, message: "Vui lòng chọn thiết bị" }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn thiết bị"
                            fetchOptions={fetchDeviceList}
                            value={selectedDevice as any}
                            onChange={(newValue: any) =>
                                setSelectedDevice(newValue as ISelectItem)
                            }
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalDevicePart;
