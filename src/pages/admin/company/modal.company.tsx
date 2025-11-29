import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { ICompany } from "@/types/backend";
import { useCreateCompanyMutation, useUpdateCompanyMutation } from "@/hooks/useCompanies";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICompany | null;
    setDataInit: (v: any) => void;
}

const ModalCompany = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createCompany, isPending: isCreating } = useCreateCompanyMutation();
    const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompanyMutation();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                companyCode: dataInit.companyCode,
                name: dataInit.name,
                address: dataInit.address,
                phone: dataInit.phone,
                email: dataInit.email,
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

    const submitCompany = async (valuesForm: ICompany) => {
        if (isEdit) {
            updateCompany({ ...dataInit, ...valuesForm }, { onSuccess: () => handleReset() });
        } else {
            createCompany(valuesForm, { onSuccess: () => handleReset() });
        }
    };

    return (
        <ModalForm
            title={isEdit ? "Cập nhật công ty" : "Tạo mới công ty"}
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
            onFinish={submitCompany}
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Mã công ty"
                        name="companyCode"
                        rules={[{ required: true, message: "Vui lòng nhập mã công ty" }]}
                        placeholder="Nhập mã công ty"
                        disabled={isEdit}
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên công ty"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
                        placeholder="Nhập tên công ty"
                    />
                </Col>

                <Col lg={24} md={24} sm={24} xs={24}>
                    <ProFormText
                        label="Địa chỉ"
                        name="address"
                        placeholder="Nhập địa chỉ công ty"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Số điện thoại"
                        name="phone"
                        placeholder="Nhập số điện thoại"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Email"
                        name="email"
                        rules={[{ type: "email", message: "Email không hợp lệ" }]}
                        placeholder="Nhập email"
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalCompany;
