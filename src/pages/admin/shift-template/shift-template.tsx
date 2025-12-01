import { useRef, useState } from "react";
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

import type { IShiftTemplate } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { useShiftTemplatesQuery, useDeleteShiftTemplateMutation } from "@/hooks/useShiftTemplate";
import ModalShiftTemplate from "@/pages/admin/shift-template/modal.shift-template";
import ViewDetailShiftTemplate from "@/pages/admin/shift-template/view.shift-template";

const PageShiftTemplate = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IShiftTemplate | null>(null);
    const [openView, setOpenView] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching, refetch } = useShiftTemplatesQuery(query);
    const deleteMutation = useDeleteShiftTemplateMutation();

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const templates = data?.result ?? [];

    /** ========================= HANDLERS ========================= */
    const handleDelete = async (id?: string | number) => {
        if (!id) return;
        await deleteMutation.mutateAsync(String(id), {
            onSuccess: () => refetch(),
        });
    };

    const reloadTable = () => {
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
        );
        refetch();
    };

    /** ========================= QUERY BUILDER ========================= */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        if (params.name) {
            q.filter = `name~'${params.name}'`;
        }

        let temp = queryString.stringify(q, { encode: false });

        if (sort?.name) {
            const dir = sort.name === "ascend" ? "asc" : "desc";
            temp += `&sort=name,${dir}`;
        } else {
            temp += `&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`;
        }

        return temp;
    };

    /** ========================= TABLE COLUMNS ========================= */
    const columns: ProColumns<IShiftTemplate>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index +
                1 +
                ((meta.page || 1) - 1) *
                (meta.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE),
            hideInSearch: true,
        },
        {
            title: "Tên ca làm việc",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Giờ bắt đầu",
            dataIndex: "startTime",
            align: "center",
            render: (_, record) =>
                record.startTime
                    ? dayjs(record.startTime, "HH:mm:ss").format("HH:mm")
                    : "-",
            hideInSearch: true,
        },
        {
            title: "Giờ kết thúc",
            dataIndex: "endTime",
            align: "center",
            render: (_, record) =>
                record.endTime
                    ? dayjs(record.endTime, "HH:mm:ss").format("HH:mm")
                    : "-",
            hideInSearch: true,
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            ellipsis: true,
            render: (_, record) => record.note || "-",
            hideInSearch: true,
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            align: "center",
            render: (_, record) =>
                record.active ? (
                    <Tag color="green">Đang hoạt động</Tag>
                ) : (
                    <Tag color="red">Ngừng hoạt động</Tag>
                ),
            hideInSearch: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
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
            width: 150,
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.SHIFT_TEMPLATE.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{
                                fontSize: 18,
                                color: "#1677ff",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSelectedId(String(entity.id));
                                setOpenView(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.SHIFT_TEMPLATE.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 18,
                                color: "#faad14",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.SHIFT_TEMPLATE.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa ca làm việc"
                            description="Bạn có chắc chắn muốn xóa ca làm việc này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(entity.id!)}
                        >
                            <DeleteOutlined
                                style={{
                                    fontSize: 18,
                                    color: "#ff4d4f",
                                    cursor: "pointer",
                                }}
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    /** ========================= RENDER ========================= */
    return (
        <PageContainer
            title="Quản lý ca làm việc mẫu"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm kiếm ca làm việc..."
                    addLabel="Thêm ca làm việc"
                    showFilterButton={false}
                    onSearch={(val) =>
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=name~'${val}'`
                        )
                    }
                    onReset={reloadTable}
                    onAddClick={() => {
                        setDataInit(null);
                        setOpenModal(true);
                    }}
                />
            }
        >
            <Access permission={ALL_PERMISSIONS.SHIFT_TEMPLATE.GET_PAGINATE}>
                <DataTable<IShiftTemplate>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={templates}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: templates || [],
                            success: true,
                            total: meta.total || 0,
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
                                <span
                                    style={{
                                        fontWeight: 600,
                                        color: "#1677ff",
                                    }}
                                >
                                    {total.toLocaleString()}
                                </span>{" "}
                                ca làm việc
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            {/* Modal thêm/sửa */}
            <ModalShiftTemplate
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            {/* Modal xem chi tiết */}
            <ViewDetailShiftTemplate
                open={openView}
                onClose={setOpenView}
                shiftTemplateId={selectedId}
            />
        </PageContainer>
    );
};

export default PageShiftTemplate;
