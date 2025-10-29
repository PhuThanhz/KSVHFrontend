import DataTable from "@/components/admin/data-table";
import type { IIssue } from "@/types/backend";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag } from "antd";
import { useState } from "react";
import queryString from "query-string";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import ModalIssue from "@/components/admin/issue/modal.issue";
import ViewIssue from "@/components/admin/issue/view.issue";
import { useIssuesQuery, useDeleteIssueMutation } from "@/hooks/useIssues";

const IssuePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IIssue | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );
    const { data, isFetching } = useIssuesQuery(query);
    const deleteMutation = useDeleteIssueMutation();

    const handleDelete = (id?: number | string) => {
        if (!id) return;
        deleteMutation.mutate(id, {
            onSuccess: () => {
                setQuery("page=1&size=10&sort=createdAt,desc");
            },
        });
    };

    const columns: ProColumns<IIssue>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            hideInSearch: true,
        },
        {
            title: "Tên vấn đề",
            dataIndex: "issueName",
            sorter: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            sorter: true,
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt ? new Date(record.createdAt).toLocaleString() : "-",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            sorter: true,
            hideInSearch: true,
            render: (_, record) =>
                record.updatedAt ? new Date(record.updatedAt).toLocaleString() : "-",
        },
        {
            title: "Hành động",
            key: "actions",
            width: 120,
            align: "center",
            hideInSearch: true,
            render: (_, record) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.ISSUE.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedIssueId(String(record.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.ISSUE.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#fa8c16", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(record);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.ISSUE.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa vấn đề"
                            description="Bạn có chắc chắn muốn xóa vấn đề này?"
                            okText="Xác nhận"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(record.id!)}
                        >
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "#ff4d4f", cursor: "pointer" }}
                            />
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
            filter: "",
        };

        if (params.issueName) {
            q.filter = `issueName~'${params.issueName}'`;
        }

        // Sort
        let sortBy = "sort=createdAt,desc";
        if (sort?.issueName) {
            sortBy = sort.issueName === "ascend" ? "sort=issueName,asc" : "sort=issueName,desc";
        }

        const temp = queryString.stringify(q);
        return `${temp}&${sortBy}`;
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.ISSUE.GET_PAGINATE}>
                <DataTable<IIssue>
                    headerTitle="Danh sách vấn đề"
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
                        showSizeChanger: true,
                        total: data?.meta?.total,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <div style={{ fontSize: 13, color: "#595959" }}>
                                <span style={{ fontWeight: 500, color: "#000" }}>
                                    {range[0]}–{range[1]}
                                </span>{" "}
                                trên{" "}
                                <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                    {total.toLocaleString()}
                                </span>{" "}
                                vấn đề
                            </div>
                        ),
                    }}
                    rowSelection={false}
                    toolBarRender={() => [
                        <Access permission={ALL_PERMISSIONS.ISSUE.CREATE} key="create" hideChildren>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => {
                                    setDataInit(null);
                                    setOpenModal(true);
                                }}
                            >
                                Thêm mới
                            </Button>
                        </Access>,
                    ]}
                />
            </Access>

            <ModalIssue
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewIssue
                onClose={setOpenViewDetail}
                open={openViewDetail}
                issueId={selectedIssueId}
            />
        </div>
    );
};

export default IssuePage;
