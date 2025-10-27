import React, { useEffect, useState } from "react";
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormDigit,
} from "@ant-design/pro-components";
import { Col, Form, Row, Switch, Select } from "antd";
import { isMobile } from "react-device-detect";
import type { ITechnician } from "@/types/backend";
import {
    useCreateTechnicianMutation,
    useUpdateTechnicianMutation,
} from "@/hooks/useTechnicians";
import {
    callFetchTechnicianSupplier,
    callFetchSkill,
    callFetchTechnicianById,
} from "@/config/api";
import { DebounceSelect } from "../debouce.select";

export interface ISelectItem {
    label?: string;
    value: number | string;
}

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ITechnician | null;
    setDataInit: (v: any) => void;
}

const ModalTechnician = ({
    openModal,
    setOpenModal,
    dataInit,
    setDataInit,
}: IProps) => {
    const [form] = Form.useForm();
    const isEdit = Boolean(dataInit?.id);

    const [technicianType, setTechnicianType] = useState<string>("INTERNAL");
    const [selectedSupplier, setSelectedSupplier] = useState<ISelectItem | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<ISelectItem[]>([]);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

    const { mutate: createTechnician, isPending: isCreating } =
        useCreateTechnicianMutation();
    const { mutate: updateTechnician, isPending: isUpdating } =
        useUpdateTechnicianMutation();

    useEffect(() => {
        const fetchDetail = async (id: number | string) => {
            setLoadingDetail(true);
            try {
                const res = await callFetchTechnicianById(id);
                const detail = res?.data;

                if (detail) {
                    const supplierItem: ISelectItem | null = detail.supplier
                        ? {
                            label: detail.supplier.name,
                            value: detail.supplier.id,
                        }
                        : null;

                    const skillsItems: ISelectItem[] =
                        detail.skills?.map((s: any) => ({
                            label: s.techniqueName,
                            value: s.id,
                        })) || [];

                    //  Đặt type trước
                    const type = detail.technicianType || "INTERNAL";
                    setTechnicianType(type);

                    //  Đợi kỹ thuật viên type mount xong rồi mới setFieldValue
                    setTimeout(() => {
                        setSelectedSupplier(supplierItem);
                        setSelectedSkills(skillsItems);

                        form.setFieldsValue({
                            technicianCode: detail.technicianCode,
                            fullName: detail.fullName,
                            phone: detail.phone,
                            email: detail.email,
                            technicianType: type,
                            costPerHire:
                                type === "OUTSOURCE" && detail.costPerHire
                                    ? Number(detail.costPerHire)
                                    : undefined,
                            technicianSupplier: supplierItem,
                            skillIds: skillsItems,
                            activeStatus: detail.activeStatus ?? true,
                        });
                    }, 100); // delay nhỏ đảm bảo các field OUTSOURCE được mount
                }
            } catch (error) {
                console.error("Không thể load chi tiết kỹ thuật viên:", error);
            } finally {
                setLoadingDetail(false);
            }
        };

        if (openModal && dataInit?.id) {
            fetchDetail(dataInit.id);
        } else if (!openModal) {
            form.resetFields();
            setTechnicianType("INTERNAL");
            setSelectedSupplier(null);
            setSelectedSkills([]);
        }
    }, [openModal, dataInit, form]);

    /** ==================== Reset modal ==================== */
    const handleReset = () => {
        form.resetFields();
        setTechnicianType("INTERNAL");
        setSelectedSupplier(null);
        setSelectedSkills([]);
        setDataInit(null);
        setOpenModal(false);
    };

    /** ==================== Submit form ==================== */
    const submitForm = async (values: any) => {
        const uniqueSkillIds = Array.from(
            new Set(
                (values.skillIds || []).map(
                    (item: ISelectItem) => Number(item.value)
                )
            )
        ) as (string | number)[];

        const payload: ITechnician = {
            id: dataInit?.id,
            technicianCode: values.technicianCode,
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            technicianType: values.technicianType,
            costPerHire:
                values.technicianType === "OUTSOURCE"
                    ? values.costPerHire
                    : 0,
            activeStatus: values.activeStatus ?? true,
            technicianSupplierId:
                values.technicianType === "OUTSOURCE"
                    ? Number(values.technicianSupplier?.value)
                    : undefined,
            skillIds: uniqueSkillIds,
        };

        if (isEdit) {
            updateTechnician(payload, { onSuccess: handleReset });
        } else {
            createTechnician(payload, { onSuccess: handleReset });
        }
    };

    /** ==================== Fetch danh sách chọn ==================== */
    async function fetchSupplierList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchTechnicianSupplier(`page=1&size=100&name=/${name}/i`);
        return (
            res?.data?.result?.map((item: any) => ({
                label: item.name,
                value: item.id,
            })) || []
        );
    }

    async function fetchSkillList(name: string): Promise<ISelectItem[]> {
        const res = await callFetchSkill(`page=1&size=100&techniqueName=/${name}/i`);
        return (
            res?.data?.result?.map((item: any) => ({
                label: item.techniqueName,
                value: item.id,
            })) || []
        );
    }

    /** ==================== Render ==================== */
    return (
        <ModalForm
            title={isEdit ? "Cập nhật kỹ thuật viên" : "Thêm mới kỹ thuật viên"}
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
            initialValues={{
                activeStatus: true,
                technicianType: "INTERNAL",
            }}
        >
            <Row gutter={16}>
                <Col lg={12} md={12}>
                    <ProFormText
                        label="Mã kỹ thuật viên"
                        name="technicianCode"
                        disabled={isEdit}
                        rules={[{ required: true, message: "Vui lòng nhập mã kỹ thuật viên" }]}
                        placeholder="Nhập mã kỹ thuật viên"
                    />
                </Col>

                <Col lg={12} md={12}>
                    <ProFormText
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                        placeholder="Nhập họ và tên"
                    />
                </Col>

                <Col lg={12} md={12}>
                    <ProFormText label="Email" name="email" placeholder="Nhập email" />
                </Col>

                <Col lg={12} md={12}>
                    <ProFormText
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: /^0\d{9}$/, message: "Số điện thoại không hợp lệ" },
                        ]}
                        placeholder="Nhập số điện thoại"
                    />
                </Col>

                {/* LOẠI KỸ THUẬT VIÊN */}
                <Col lg={12} md={12}>
                    <ProForm.Item
                        name="technicianType"
                        label="Loại kỹ thuật viên"
                        rules={[{ required: true, message: "Vui lòng chọn loại kỹ thuật viên" }]}
                    >
                        <Select
                            placeholder="Chọn loại kỹ thuật viên"
                            options={[
                                { label: "Nội bộ", value: "INTERNAL" },
                                { label: "Thuê ngoài", value: "OUTSOURCE" },
                            ]}
                            onChange={(val) => {
                                setTechnicianType(val);
                                if (val === "INTERNAL") {
                                    form.setFieldsValue({
                                        technicianSupplier: undefined,
                                        costPerHire: undefined,
                                    });
                                    setSelectedSupplier(null);
                                }
                            }}
                        />
                    </ProForm.Item>
                </Col>

                {technicianType === "OUTSOURCE" && (
                    <>
                        <Col lg={12} md={12}>
                            <ProFormDigit
                                label="Chi phí thuê (₫)"
                                name="costPerHire"
                                min={0}
                                rules={[
                                    { required: true, message: "Vui lòng nhập chi phí thuê" },
                                    {
                                        validator: (_, value) =>
                                            value > 0
                                                ? Promise.resolve()
                                                : Promise.reject("Chi phí thuê phải lớn hơn 0"),
                                    },
                                ]}
                                fieldProps={{
                                    formatter: (value) =>
                                        value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "",
                                    parser: (value?: string) =>
                                        value ? Number(value.replace(/₫|,/g, "")) : 0,
                                }}
                                placeholder="Nhập chi phí thuê"
                            />
                        </Col>
                        <Col lg={12} md={12}>
                            <ProForm.Item
                                name="technicianSupplier"
                                label="Nhà cung cấp"
                                rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
                            >
                                <DebounceSelect
                                    allowClear
                                    showSearch
                                    placeholder="Chọn nhà cung cấp"
                                    fetchOptions={fetchSupplierList}
                                    value={selectedSupplier as any}
                                    onChange={(newValue: any) => {
                                        setSelectedSupplier(newValue as ISelectItem);
                                        form.setFieldsValue({ technicianSupplier: newValue });
                                    }}
                                    style={{ width: "100%" }}
                                />
                            </ProForm.Item>
                        </Col>
                    </>
                )}

                {/* KỸ NĂNG */}
                <Col lg={12} md={12}>
                    <ProForm.Item
                        name="skillIds"
                        label="Kỹ năng"
                        rules={[{ required: true, message: "Vui lòng chọn kỹ năng" }]}
                    >
                        <DebounceSelect
                            mode="multiple"
                            allowClear
                            showSearch
                            placeholder="Chọn kỹ năng"
                            fetchOptions={fetchSkillList}
                            value={selectedSkills as any}
                            onChange={(newValue: any) => {
                                const unique = Array.from(
                                    new Map(
                                        (newValue as ISelectItem[]).map((s) => [s.value, s])
                                    ).values()
                                );
                                setSelectedSkills(unique);
                                form.setFieldsValue({ skillIds: unique });
                            }}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>

                {isEdit && (
                    <Col lg={12} md={12}>
                        <ProForm.Item
                            name="activeStatus"
                            label="Trạng thái"
                            valuePropName="checked"
                        >
                            <Switch />
                        </ProForm.Item>
                    </Col>
                )}
            </Row>
        </ModalForm>
    );
};

export default ModalTechnician;
