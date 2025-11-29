import { ModalForm, ProForm, ProFormDigit } from "@ant-design/pro-components";
import { Col, Form, Row } from "antd";
import { useEffect, useState, useMemo } from "react";
import { isMobile } from "react-device-detect";
import { DebounceSelect } from "@/components/common/debouce.select";
import { callFetchSkill } from "@/config/api";
import type { IIssueSkillMappingRequest } from "@/types/backend";
import { useCreateIssueSkillMappingMutation } from "@/hooks/useIssueSkillMappings";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    selectedIssue: { id: string; name: string } | null;
    existingMappings?: any[];
    refetch: () => void;
}

interface ISelectItem {
    label: string;
    value: number | string;
}

const ModalAddSkill = ({
    openModal,
    setOpenModal,
    selectedIssue,
    existingMappings = [],
    refetch,
}: IProps) => {
    const [form] = Form.useForm();
    const [selectedSkill, setSelectedSkill] = useState<ISelectItem | null>(null);
    const { mutate: createMapping, isPending: isCreating } =
        useCreateIssueSkillMappingMutation();

    // Lấy danh sách skillId đã tồn tại
    const existingSkillIds = useMemo(
        () => existingMappings.map((m) => m.skillId),
        [existingMappings]
    );

    useEffect(() => {
        if (!openModal) {
            form.resetFields();
            setSelectedSkill(null);
        }
    }, [openModal]);

    const handleReset = () => {
        form.resetFields();
        setSelectedSkill(null);
        setOpenModal(false);
    };

    // ✅ Fetch danh sách kỹ năng và lọc bỏ kỹ năng đã tồn tại
    async function fetchSkillList(keyword: string): Promise<ISelectItem[]> {
        const res = await callFetchSkill(`page=1&size=100&techniqueName=/${keyword}/i`);
        return (
            res?.data?.result
                ?.filter((item: any) => !existingSkillIds.includes(item.id))
                ?.map((item: any) => ({
                    label: item.techniqueName,
                    value: item.id,
                })) || []
        );
    }

    const submitMapping = async (values: any) => {
        if (!selectedIssue) return;
        const payload: IIssueSkillMappingRequest = {
            issueId: selectedIssue.id,
            skillId: Number(values.skill.value),
            weight: values.weight,
        };
        createMapping(payload, {
            onSuccess: () => {
                handleReset();
                refetch();
            },
        });
    };

    return (
        <ModalForm
            title={`Thêm kỹ năng cho sự cố: ${selectedIssue?.name ?? ""}`}
            open={openModal}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 600,
                okText: "Tạo mới",
                cancelText: "Hủy",
                confirmLoading: isCreating,
                maskClosable: false,
            }}
            form={form}
            onFinish={submitMapping}
            preserve={false}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProForm.Item
                        name="skill"
                        label="Kỹ năng"
                        rules={[{ required: true, message: "Vui lòng chọn kỹ năng" }]}
                    >
                        <DebounceSelect
                            allowClear
                            showSearch
                            placeholder="Chọn kỹ năng"
                            fetchOptions={fetchSkillList}
                            value={selectedSkill as any}
                            onChange={(val: any) => setSelectedSkill(val)}
                            style={{ width: "100%" }}
                        />
                    </ProForm.Item>
                </Col>

                <Col span={24}>
                    <ProFormDigit
                        label="Trọng số (Weight)"
                        name="weight"
                        rules={[{ required: true, message: "Vui lòng nhập trọng số" }]}
                        fieldProps={{ min: 0, max: 1, step: 0.1 }}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalAddSkill;
