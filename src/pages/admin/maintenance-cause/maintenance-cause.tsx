import { useRef, useState } from "react";
import { Button, Space } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import dayjs from "dayjs";
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";

import type { IMaintenanceCause } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";

import {
    useMaintenanceCausesQuery,
} from "@/hooks/maintenance/useMaintenanceCause";

import ModalMaintenanceCause from "@/pages/admin/maintenance-cause/modal.maintenance-cause";
import ViewMaintenanceCause from "@/pages/admin/maintenance-cause/view.maintenance-cause";

const MaintenanceCausePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IMaintenanceCause | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useMaintenanceCausesQuery(query);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const causes = data?.result ?? [];

    /** Reload lại bảng */
    const reloadTable = () => {
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
        );
    };

    /** Build query cho sort/pagination */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        if (params.causeName) {
            q.filter = `causeName ~ '${params.causeName}'`;
        }

        let temp = queryString.stringify(q, { encode: false });

        if (sort?.causeName) {
            const dir = sort.causeName === "ascend" ? "asc" : "desc";
            temp += `&sort=causeName,${dir}`;
        } else {
            temp += `&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`;
        }

        return temp;
    };

    /** Cấu hình cột */
    const columns: ProColumns<IMaintenanceCause>[] = [
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
            title: "Tên nguyên nhân",
            dataIndex: "causeName",
            sorter: true,
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
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            hideInSearch: true,
            render: (_, record) =>
                record.updatedAt
                    ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm")
                    : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 120,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.MAINTENANCE_CAUSE.GET_BY_ID}
                        hideChildren
                    >
                        <EyeOutlined
                            style={{
                                fontSize: 18,
                                color: "#1677ff",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSelectedId(String(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access
                        permission={ALL_PERMISSIONS.MAINTENANCE_CAUSE.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 18,
                                color: "#fa8c16",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>
                </Space>
            ),
        },
    ];

    return (
        <PageContainer
            title="Quản lý nguyên nhân hư hỏng"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm kiếm nguyên nhân..."
                    addLabel="Thêm nguyên nhân"
                    showFilterButton={false}
                    onSearch={(val) =>
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=causeName~'${val}'`
                        )
                    }
                    onReset={() => reloadTable()}
                    onAddClick={() => {
                        setDataInit(null);
                        setOpenModal(true);
                    }}
                />
            }
        >
            <Access permission={ALL_PERMISSIONS.MAINTENANCE_CAUSE.GET_PAGINATE}>
                <DataTable<IMaintenanceCause>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={causes}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: causes || [],
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
                                nguyên nhân
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            <ModalMaintenanceCause
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewMaintenanceCause
                onClose={setOpenViewDetail}
                open={openViewDetail}
                causeId={selectedId}
            />
        </PageContainer>
    );
};

export default MaintenanceCausePage;
