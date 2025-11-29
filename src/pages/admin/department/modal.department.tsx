import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import type { IDepartment } from "@/types/backend";
import {
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
} from "@/hooks/useDepartments";
import { DebounceSelect } from "@/components/common/debouce.select";
import { callFetchCompany } from "@/config/api";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IDepartment | null;
    setDataInit: (v: any) => void;
}

export interface ICompanySelect {
    label?: string;
    value: string | number;
    key?: string | number;
}

const ModalDepartment = ({ openModal, setOpenModal, dataInit, setDataInit }: IProps) => {
    const [selectedCompany, setSelectedCompany] = useState<ICompanySelect | null>(null);
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const { mutate: createDepartment, isPending: isCreating } = useCreateDepartmentMutation();
    const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartmentMutation();

    useEffect(() => {
        if (dataInit?.id && dataInit.company) {
            const companyItem = {
                label: dataInit.company.name,
                value: dataInit.company.id,
                key: dataInit.company.id,
            };
            setSelectedCompany(companyItem);
        } else {
            setSelectedCompany(null);
        }
    }, [dataInit]);

    const handleReset = () => {
        form.resetFields();
        setSelectedCompany(null);
        setDataInit(null);
        setOpenModal(false);
    };

    const submitDepartment = async (valuesForm: any) => {
        const payload: IDepartment = dataInit?.id
            ? {
                id: dataInit.id,
                departmentCode: valuesForm.departmentCode,
                name: valuesForm.name,
                company: { id: Number(valuesForm.company?.value) },
            }
            : {
                departmentCode: valuesForm.departmentCode,
                name: valuesForm.name,
                company: { id: Number(valuesForm.company?.value) },
            };

        if (isEdit) {
            updateDepartment(payload, { onSuccess: () => handleReset() });
        } else {
            createDepartment(payload, { onSuccess: () => handleReset() });
        }
    };

    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(`page=1&size=100&name=/${name}/i`);
        if (res?.data) {
            return res.data.result.map((item: any) => ({
                label: item.name,
                value: item.id,
            }));
        }
        return [];
    }

    return (
        <ModalForm
            title={isEdit ? "Cập nhật phòng ban" : "Tạo mới phòng ban"}
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
            scrollToFirstError
            preserve={false}
            form={form}
            onFinish={submitDepartment}
            initialValues={
                dataInit?.id
                    ? {
                        ...dataInit,
                        company: {
                            label: dataInit.company?.name,
                            value: dataInit.company?.id,
                        },
                    }
                    : {}
            }
        >
            <Row gutter={16}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Mã phòng ban"
                        name="departmentCode"
                        disabled={isEdit}
                        rules={[{ required: true, message: "Vui lòng nhập mã phòng ban" }]}
                        placeholder="Nhập mã phòng ban"
                    />
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <ProFormText
                        label="Tên phòng ban"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên phòng ban" }]}
                        placeholder="Nhập tên phòng ban"
                    />
                </Col>

                <Col lg={24} md={24} sm={24} xs={24}>
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
                            onChange={(newValue: any) =>
                                setSelectedCompany(newValue as ICompanySelect)
                            }
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalDepartment;
