import DataTable from "@/components/common/data-table";
import type { ISkill } from "@/types/backend";
import { EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Popconfirm, Tag } from "antd";
import { useState } from "react";
import queryString from "query-string";
import ModalSkill from "@/pages/admin/skill/modal.skill";
import ViewDetailSkill from "@/pages/admin/skill/view.skill";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useSkillsQuery, useDeleteSkillMutation } from "@/hooks/useSkills";
import dayjs from "dayjs";

const SkillPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ISkill | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );

    const { data, isFetching } = useSkillsQuery(query);
    const deleteMutation = useDeleteSkillMutation();

    const handleDelete = async (id?: number | string) => {
        if (!id) return;
        await deleteMutation.mutateAsync(id, {
            onSuccess: () => {
                setQuery("page=1&size=10&sort=createdAt,desc");
            },
        });
    };

    const columns: ProColumns<ISkill>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) +
                ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            hideInSearch: true,
        },
        {
            title: "Tên kỹ năng",
            dataIndex: "techniqueName",
            sorter: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            sorter: true,
            render: (_, record) =>
                record.createdAt
                    ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm")
                    : "-",
            hideInSearch: true,
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            sorter: true,
            render: (_, record) =>
                record.updatedAt
                    ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm")
                    : "-",
            hideInSearch: true,
        },
        {
            title: "Hành động",
            key: "actions",
            align: "center",
            width: 150,
            hideInSearch: true,
            render: (_, record) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.SKILL.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ color: "#1890ff", fontSize: 18 }}
                            onClick={() => {
                                setSelectedSkillId(Number(record.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.SKILL.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ color: "#ffa500", fontSize: 18 }}
                            onClick={() => {
                                setDataInit(record);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.SKILL.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa kỹ năng"
                            description="Bạn có chắc chắn muốn xóa kỹ năng này không?"
                            onConfirm={() => handleDelete(record.id!)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
        };

        if (params.techniqueName) {
            q.filter = `techniqueName~'${params.techniqueName}'`;
        }

        // Sort
        let sortBy = "";
        if (sort?.techniqueName)
            sortBy =
                sort.techniqueName === "ascend"
                    ? "sort=techniqueName,asc"
                    : "sort=techniqueName,desc";
        else sortBy = "sort=createdAt,desc";

        return `${queryString.stringify(q)}&${sortBy}`;
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.SKILL.GET_PAGINATE}>
                <DataTable<ISkill>
                    headerTitle="Danh sách kỹ năng"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort): Promise<any> => {
                        const newQuery = buildQuery(params, sort);
                        setQuery(newQuery);
                    }}
                    pagination={{
                        defaultPageSize: 10,

                        current: data?.meta?.page,
                        pageSize: data?.meta?.pageSize,
                        total: data?.meta?.total,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: (total, range) => (
                            <div style={{ fontSize: 13, color: "#595959" }}>
                                <span style={{ fontWeight: 500, color: "#000" }}>
                                    {range[0]}–{range[1]}
                                </span>{" "}
                                trên{" "}
                                <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                    {total.toLocaleString()}
                                </span>{" "}
                                kỹ năng
                            </div>
                        ),
                        style: {
                            marginTop: 16,
                            padding: "12px 24px",
                            background: "#fff",
                            borderRadius: 8,
                            borderTop: "1px solid #f0f0f0",
                            display: "flex",
                            justifyContent: "flex-end",
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={() => [
                        <Access
                            key="create"
                            permission={ALL_PERMISSIONS.SKILL.CREATE}
                            hideChildren
                        >
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setDataInit(null);
                                    setOpenModal(true);
                                }}
                            >
                                Thêm kỹ năng
                            </Button>
                        </Access>,
                    ]}
                />
            </Access>

            <ModalSkill
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            {/* Drawer xem chi tiết */}
            <ViewDetailSkill
                onClose={setOpenViewDetail}
                open={openViewDetail}
                skillId={selectedSkillId}
            />
        </div>
    );
};

export default SkillPage;
