import DataTable from "@/components/admin/data-table";
import type { IRejectReason } from "@/types/backend";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";
import dayjs from "dayjs";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import {
    useRejectReasonsQuery,
    useDeleteRejectReasonMutation,
} from "@/hooks/useRejectReasons";
import ModalRejectReason from "@/components/admin/reject-reason/modal.rejectreason";
import ViewRejectReason from "@/components/admin/reject-reason/view.rejectreason";

const RejectReasonPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IRejectReason | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);

    const [query, setQuery] = useState<string>(() => {
        return queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        });
    });

    const { data, isFetching } = useRejectReasonsQuery(query);
    const deleteMutation = useDeleteRejectReasonMutation();

    /** ========================= Xử lý xóa ========================= */
    const handleDelete = async (id: number | string) => {
        await deleteMutation.mutateAsync(id);
    };

    /** ========================= Cấu hình cột ========================= */
    const columns: ProColumns<IRejectReason>[] = [
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
            title: "Loại lý do",
            dataIndex: "reasonType",
            sorter: true,
            valueType: "select",
            valueEnum: {
                ASSIGNMENT: { text: "Phân công" },
                PLAN: { text: "Kế hoạch" },
                ACCEPTANCE: { text: "Nghiệm thu" },
            },
            render: (_, record) => {
                const mapColor: Record<string, string> = {
                    ASSIGNMENT: "blue",
                    PLAN: "orange",
                    ACCEPTANCE: "green",
                };
                const label =
                    record.reasonType === "ASSIGNMENT"
                        ? "Phân công"
                        : record.reasonType === "PLAN"
                            ? "Kế hoạch"
                            : "Nghiệm thu";
                return <Tag color={mapColor[record.reasonType]}>{label}</Tag>;
            },
        },

        {
            title: "Tên lý do",
            dataIndex: "reasonName",
            sorter: true,
            // ✅ chỉ cho phép tìm kiếm theo trường này
        },
        {
            title: "Mô tả chi tiết",
            dataIndex: "description",
            ellipsis: true,
            hideInSearch: true,
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
            title: "Hành động",
            hideInSearch: true,
            width: 120,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.REJECT_REASON.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedReasonId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.REJECT_REASON.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#ffa500", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.REJECT_REASON.DELETE} hideChildren>
                        <Popconfirm
                            placement="topLeft"
                            title="Xác nhận xóa lý do"
                            description="Bạn có chắc chắn muốn xóa lý do này?"
                            onConfirm={() => handleDelete(Number(entity.id))}
                            okText="Xác nhận"
                            cancelText="Hủy"
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


    /** ========================= Build query ========================= */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.reasonName) q.filter = sfLike("reasonName", params.reasonName);
        if (params.reasonType)
            q.filter = q.filter
                ? `${q.filter} and reasonType='${params.reasonType}'`
                : `reasonType='${params.reasonType}'`;

        let temp = queryString.stringify(q);

        // Sort
        let sortBy = "";
        if (sort?.reasonName)
            sortBy = sort.reasonName === "ascend" ? "sort=reasonName,asc" : "sort=reasonName,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    /** ========================= Giao diện chính ========================= */
    return (
        <div>
            <Access permission={ALL_PERMISSIONS.REJECT_REASON.GET_PAGINATE}>
                <DataTable<IRejectReason>
                    headerTitle="Danh sách lý do từ chối"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort): Promise<any> => {
                        const newQuery = buildQuery(params, sort);
                        setQuery(newQuery);
                    }}
                    pagination={{
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
                                lý do từ chối
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
                        <Access permission={ALL_PERMISSIONS.REJECT_REASON.CREATE} key="create" hideChildren>
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

            <ModalRejectReason
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewRejectReason
                onClose={setOpenViewDetail}
                open={openViewDetail}
                reasonId={selectedReasonId}
            />
        </div>
    );
};

export default RejectReasonPage;
