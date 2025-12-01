import { useEffect, useRef, useState } from "react";
import { Button, Popconfirm, Space, Tag } from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import dayjs from "dayjs";
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

import type { IRejectReason } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { sfLike } from "spring-filter-query-builder";
import {
    useRejectReasonsQuery,
    useDeleteRejectReasonMutation,
} from "@/hooks/useRejectReasons";
import ModalRejectReason from "@/pages/admin/reject-reason/modal.rejectreason";
import ViewRejectReason from "@/pages/admin/reject-reason/view.rejectreason";

const RejectReasonPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IRejectReason | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);

    // Bộ lọc
    const [reasonTypeFilter, setReasonTypeFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useRejectReasonsQuery(query);
    const deleteMutation = useDeleteRejectReasonMutation();

    /** ================= Auto call API khi thay đổi filter ================= */
    useEffect(() => {
        const q: any = {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            sort: "createdAt,desc",
        };

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(`reasonName~'${searchValue}'`);
        }
        if (reasonTypeFilter) filterParts.push(`reasonType='${reasonTypeFilter}'`);
        if (createdAtFilter) filterParts.push(createdAtFilter);

        if (filterParts.length > 0) q.filter = filterParts.join(" and ");

        const built = queryString.stringify(q, { encode: false });
        setQuery(built);
    }, [searchValue, reasonTypeFilter, createdAtFilter]);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const rejectReasons = data?.result ?? [];

    /** ================= Xử lý xóa ================= */
    const handleDelete = async (id: number | string) => {
        await deleteMutation.mutateAsync(id);
    };

    /** ================= Xây dựng query khi sort/pagination ================= */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            filter: "",
        };

        const filterParts: string[] = [];

        if (searchValue) filterParts.push(`reasonName~'${searchValue}'`);
        if (reasonTypeFilter) filterParts.push(`reasonType='${reasonTypeFilter}'`);
        if (createdAtFilter) filterParts.push(createdAtFilter);

        if (filterParts.length > 0) q.filter = filterParts.join(" and ");

        let temp = queryString.stringify(q, { encode: false });
        let sortBy = "";

        if (sort?.reasonName)
            sortBy =
                sort.reasonName === "ascend"
                    ? "sort=reasonName,asc"
                    : "sort=reasonName,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    /** ================= Làm mới bảng ================= */
    const reloadTable = () => {
        setSearchValue("");
        setReasonTypeFilter(null);
        setCreatedAtFilter(null);
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
        );
    };

    /** ================= Cấu hình cột ================= */
    const columns: ProColumns<IRejectReason>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index + 1 + ((meta.page || 1) - 1) * (meta.pageSize || 10),
            hideInSearch: true,
        },
        {
            title: "Loại lý do",
            dataIndex: "reasonType",
            sorter: true,
            hideInSearch: true,
            render: (_, record) => {
                const colorMap: Record<string, string> = {
                    ASSIGNMENT: "blue",
                    PLAN: "orange",
                    ACCEPTANCE: "green",
                };
                const labelMap: Record<string, string> = {
                    ASSIGNMENT: "Phân công",
                    PLAN: "Kế hoạch",
                    ACCEPTANCE: "Nghiệm thu",
                };
                return (
                    <Tag color={colorMap[record.reasonType]}>
                        {labelMap[record.reasonType]}
                    </Tag>
                );
            },
        },
        {
            title: "Tên lý do",
            dataIndex: "reasonName",
            sorter: true,
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
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt
                    ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm")
                    : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            align: "center",
            width: 120,
            render: (_, entity) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.REJECT_REASON.GET_BY_ID}
                        hideChildren
                    >
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedReasonId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access
                        permission={ALL_PERMISSIONS.REJECT_REASON.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{ fontSize: 18, color: "#fa8c16", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access
                        permission={ALL_PERMISSIONS.REJECT_REASON.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            title="Xác nhận xóa lý do"
                            description="Bạn có chắc chắn muốn xóa lý do này?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(Number(entity.id))}
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

    /** ================= Giao diện chính ================= */
    return (
        <PageContainer
            title="Quản lý lý do từ chối"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm kiếm lý do..."
                        addLabel="Thêm lý do"
                        showFilterButton={false}
                        onSearch={(val) => setSearchValue(val)}
                        onReset={reloadTable}
                        onAddClick={() => {
                            setDataInit(null);
                            setOpenModal(true);
                        }}
                    />
                    <div className="flex flex-wrap gap-3 items-center">
                        <AdvancedFilterSelect
                            fields={[
                                {
                                    key: "reasonType",
                                    label: "Loại lý do",
                                    icon: <></>,
                                    options: [
                                        { label: "Phân công", value: "ASSIGNMENT", color: "blue" },
                                        { label: "Kế hoạch", value: "PLAN", color: "orange" },
                                        { label: "Nghiệm thu", value: "ACCEPTANCE", color: "green" },
                                    ],
                                },
                            ]}
                            onChange={(filters) =>
                                setReasonTypeFilter(filters.reasonType || null)
                            }
                        />
                        <DateRangeFilter
                            fieldName="createdAt"
                            onChange={(filter) => setCreatedAtFilter(filter)}
                        />
                    </div>
                </div>
            }
        >
            <Access permission={ALL_PERMISSIONS.REJECT_REASON.GET_PAGINATE}>
                <DataTable<IRejectReason>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={rejectReasons}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: rejectReasons,
                            success: true,
                            total: meta.total,
                        });
                    }}
                    pagination={{
                        defaultPageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <div style={{ fontSize: 13 }}>
                                <span style={{ fontWeight: 500 }}>
                                    {range[0]}–{range[1]}
                                </span>{" "}
                                trên{" "}
                                <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                    {total.toLocaleString()}
                                </span>{" "}
                                lý do từ chối
                            </div>
                        ),
                    }}
                    rowSelection={false}
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
        </PageContainer>
    );
};

export default RejectReasonPage;
