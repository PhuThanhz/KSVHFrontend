import {
    ModalForm,
    ProForm,
    ProFormSwitch,
    ProFormText,
    ProFormTimePicker,
} from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { IShiftTemplate } from "@/types/backend";
import {
    useCreateShiftTemplateMutation,
    useUpdateShiftTemplateMutation,
} from "@/hooks/useShiftTemplate";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IShiftTemplate | null;
    setDataInit: (v: any) => void;
}

const ModalShiftTemplate = ({
    openModal,
    setOpenModal,
    dataInit,
    setDataInit,
}: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createShiftTemplate, isPending: isCreating } =
        useCreateShiftTemplateMutation();
    const { mutate: updateShiftTemplate, isPending: isUpdating } =
        useUpdateShiftTemplateMutation();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                name: dataInit.name,
                startTime: dataInit.startTime,
                endTime: dataInit.endTime,
                note: dataInit.note,
                active: dataInit.active ?? true,
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

    const submitShiftTemplate = async (valuesForm: IShiftTemplate) => {
        if (isEdit) {
            updateShiftTemplate({ ...dataInit, ...valuesForm }, { onSuccess: () => handleReset() });
        } else {
            createShiftTemplate(valuesForm, { onSuccess: () => handleReset() });
        }
    };

    return (
        <ModalForm
            title={isEdit ? "Cập nhật ca mẫu" : "Tạo mới ca mẫu"}
            open={openModal}
            modalProps={{
                onCancel: () => handleReset(),
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
            onFinish={submitShiftTemplate}
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên ca làm việc"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên ca" }]}
                        placeholder="Nhập tên ca làm việc"
                    />
                </Col>

                <Col lg={6} md={6} sm={12} xs={24}>
                    <ProFormTimePicker
                        label="Giờ bắt đầu"
                        name="startTime"
                        rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}
                        fieldProps={{
                            format: "HH:mm",
                            placeholder: "Chọn giờ bắt đầu",
                        }}
                    />
                </Col>

                <Col lg={6} md={6} sm={12} xs={24}>
                    <ProFormTimePicker
                        label="Giờ kết thúc"
                        name="endTime"
                        rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc" }]}
                        fieldProps={{
                            format: "HH:mm",
                            placeholder: "Chọn giờ kết thúc",
                        }}
                    />
                </Col>

                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProFormText
                        label="Ghi chú"
                        name="note"
                        placeholder="Nhập ghi chú (nếu có)"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormSwitch
                        label="Kích hoạt"
                        name="active"
                        initialValue={true}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalShiftTemplate;
