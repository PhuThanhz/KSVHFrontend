import React, { useState, useMemo, useEffect } from "react";
import { Button, Collapse, List, Popconfirm, Tag, Card, Empty, Space, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    useIssueSkillMappingsQuery,
    useDeleteIssueSkillMappingMutation,
} from "@/hooks/useIssueSkillMappings";
import { callFetchIssue } from "@/config/api";
import ModalAddSkill from "@/pages/admin/issue-skill-mapping/modal.add-skill";

const { Title, Text } = Typography;

const IssueSkillMappingPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<{ id: string; name: string } | null>(null);
    const [issues, setIssues] = useState<any[]>([]);

    const { data, refetch, isFetching } = useIssueSkillMappingsQuery("page=1&size=1000");
    const { mutate: deleteMapping } = useDeleteIssueSkillMappingMutation();

    // ============================
    // Fetch toàn bộ sự cố (Issue)
    // ============================
    useEffect(() => {
        (async () => {
            const res = await callFetchIssue("page=1&size=1000&sort=createdAt,desc");
            setIssues(res?.data?.result || []);
        })();
    }, []);

    // ============================
    // Nhóm mapping theo Issue
    // ============================
    const groupedData = useMemo(() => {
        const groups: Record<string, any[]> = {};
        if (data?.result) {
            data.result.forEach((m: any) => {
                if (!groups[m.issueId]) groups[m.issueId] = [];
                groups[m.issueId].push(m);
            });
        }

        // ✅ merge toàn bộ issue (kể cả chưa có kỹ năng)
        return issues.map((issue) => ({
            issueId: issue.id,
            issueName: issue.issueName,
            mappings: groups[issue.id] || [],
        }));
    }, [data, issues]);

    // ============================
    // Xóa mapping
    // ============================
    const handleDelete = (id: number) => {
        deleteMapping(id, {
            onSuccess: () => refetch(),
        });
    };

    return (
        <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
            <Card
                title={<Title level={4} style={{ margin: 0 }}>Cấu hình kỹ năng cho sự cố</Title>}
                bordered={false}
                style={{
                    maxWidth: 1000,
                    margin: "0 auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    borderRadius: 10,
                }}
            >
                {groupedData.length === 0 ? (
                    <Empty
                        description="Chưa có dữ liệu cấu hình"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{ marginTop: 40, marginBottom: 40 }}
                    />
                ) : (
                    <Collapse
                        accordion
                        ghost
                        items={groupedData.map((group) => ({
                            key: group.issueId,
                            label: (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        fontWeight: 500,
                                        fontSize: 16,
                                    }}
                                >
                                    <Text strong>{group.issueName}</Text>
                                    <Space size={12}>
                                        <Tag color={group.mappings.length ? "blue" : "default"}>
                                            {group.mappings.length} kỹ năng
                                        </Tag>
                                        <Button
                                            size="small"
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => {
                                                setSelectedIssue({ id: group.issueId, name: group.issueName });
                                                setOpenModal(true);
                                            }}
                                        >
                                            {group.mappings.length ? "Thêm kỹ năng" : "Tạo kỹ năng đầu tiên"}
                                        </Button>
                                    </Space>
                                </div>
                            ),
                            children:
                                group.mappings.length === 0 ? (
                                    <Empty
                                        description="Chưa có kỹ năng nào cho sự cố này"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        style={{ margin: "20px 0" }}
                                    />
                                ) : (
                                    <List
                                        bordered
                                        loading={isFetching}
                                        dataSource={group.mappings}
                                        style={{
                                            background: "#fff",
                                            borderRadius: 6,
                                            padding: "4px 8px",
                                        }}
                                        renderItem={(m: any, index: number) => (
                                            <List.Item
                                                key={m.id}
                                                style={{
                                                    borderRadius: 6,
                                                    padding: "12px 16px",
                                                    background: index % 2 === 0 ? "#fafafa" : "#fff",
                                                }}
                                                actions={[
                                                    <Popconfirm
                                                        key="del"
                                                        title="Xóa cấu hình này?"
                                                        okText="Xóa"
                                                        cancelText="Hủy"
                                                        onConfirm={() => handleDelete(m.id)}
                                                    >
                                                        <DeleteOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />
                                                    </Popconfirm>,
                                                ]}
                                            >
                                                <Space direction="vertical" size={0}>
                                                    <Text>
                                                        <b>Kỹ năng:</b> {m.skillName}
                                                    </Text>
                                                    <Tag color="purple" style={{ marginTop: 4 }}>
                                                        Weight: {m.weight}
                                                    </Tag>
                                                </Space>
                                            </List.Item>
                                        )}
                                    />
                                ),
                        }))}
                    />
                )}
            </Card>

            <ModalAddSkill
                openModal={openModal}
                setOpenModal={setOpenModal}
                selectedIssue={selectedIssue}
                existingMappings={
                    selectedIssue
                        ? groupedData.find((g) => g.issueId === selectedIssue.id)?.mappings || []
                        : []
                }
                refetch={refetch}
            />
        </div>
    );
};

export default IssueSkillMappingPage;
