import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Form } from "antd";
import { isMobile } from "react-device-detect";
import type { IPosition } from "@/types/backend";
import {
    useCreatePositionMutation,
    useUpdatePositionMutation,
} from "@/hooks/usePositions";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IPosition | null;
    setDataInit: (v: any) => void;
}

const ModalPosition = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createPosition, isPending: isCreating } = useCreatePositionMutation();
    const { mutate: updatePosition, isPending: isUpdating } = useUpdatePositionMutation();

    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    const submitForm = async (values: any) => {
        if (isEdit) {
            updatePosition(
                { id: dataInit?.id, name: values.name },
                { onSuccess: () => handleReset() }
            );
        } else {
            createPosition(
                { name: values.name },
                { onSuccess: () => handleReset() }
            );
        }
    };

    return (
        <ModalForm
            title={isEdit ? "Cập nhật chức vụ" : "Tạo mới chức vụ"}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 520,
                keyboard: false,
                maskClosable: false,
                okText: isEdit ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating || isUpdating,
            }}
            form={form}
            onFinish={submitForm}
            initialValues={isEdit ? { ...dataInit } : {}}
            preserve={false}
            scrollToFirstError
        >
            <ProFormText
                label="Tên chức vụ"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên chức vụ" }]}
                placeholder="Nhập tên chức vụ"
            />
        </ModalForm>
    );
};

export default ModalPosition;
