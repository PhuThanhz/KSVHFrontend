import { useRef, useState } from "react";
import { Button, Popconfirm, Space } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import dayjs from "dayjs";
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import type { ICompany } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import {
    useCompaniesQuery,
    useDeleteCompanyMutation,
} from "@/hooks/useCompanies";
import ModalCompany from "@/pages/admin/company/modal.company";
import ViewDetailCompany from "@/pages/admin/company/view.company";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { sfLike } from "spring-filter-query-builder";

const CompanyPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ICompany | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useCompaniesQuery(query);
    const deleteMutation = useDeleteCompanyMutation();

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const companies = data?.result ?? [];

    /** Xử lý xóa công ty */
    const handleDelete = async (id?: number | string) => {
        if (!id) return;
        await deleteMutation.mutateAsync(id, {
            onSuccess: () => reloadTable(),
        });
    };

    /** Reload lại bảng */
    const reloadTable = () => {
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
        );
    };

    /** Build query sort/pagination/filter */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            filter: "",
        };

        if (params.name)
            q.filter = sfLike("name", params.name);
        if (params.companyCode)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("companyCode", params.companyCode)}`
                : sfLike("companyCode", params.companyCode);
        if (params.email)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("email", params.email)}`
                : sfLike("email", params.email);
        if (params.phone)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("phone", params.phone)}`
                : sfLike("phone", params.phone);
        if (params.address)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("address", params.address)}`
                : sfLike("address", params.address);

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q, { encode: false });

        // sort
        let sortBy = "";
        if (sort?.name)
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        else sortBy = `sort=${PAGINATION_CONFIG.DEFAULT_SORT}`;

        return `${temp}&${sortBy}`;
    };

    /** Cấu hình cột */
    const columns: ProColumns<ICompany>[] = [
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
            title: "Mã công ty",
            dataIndex: "companyCode",
            sorter: true,
        },
        {
            title: "Tên công ty",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            hideInSearch: true,
        },
        {
            title: "Email",
            dataIndex: "email",
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
                    <Access permission={ALL_PERMISSIONS.COMPANY.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{
                                fontSize: 18,
                                color: "#1677ff",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSelectedCompanyId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.COMPANY.UPDATE} hideChildren>
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

                    <Access permission={ALL_PERMISSIONS.COMPANY.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa công ty"
                            description="Bạn có chắc chắn muốn xóa công ty này không?"
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

    return (
        <PageContainer
            title="Quản lý công ty"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm kiếm theo mã hoặc tên công ty..."
                    addLabel="Thêm công ty"
                    filterFields={[
                        { name: "email", label: "Email", placeholder: "Nhập email..." },
                        { name: "phone", label: "Số điện thoại", placeholder: "Nhập số điện thoại..." },
                        { name: "address", label: "Địa chỉ", placeholder: "Nhập địa chỉ..." },
                    ]}
                    onSearch={(val) =>
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=(companyCode~'${val}' or name~'${val}')`
                        )
                    }
                    onFilterApply={(filters) => {
                        const conditions: string[] = [];
                        if (filters.email) conditions.push(`email~'${filters.email}'`);
                        if (filters.phone) conditions.push(`phone~'${filters.phone}'`);
                        if (filters.address) conditions.push(`address~'${filters.address}'`);

                        const combined =
                            conditions.length > 0 ? conditions.join(" and ") : "";
                        const q = combined
                            ? `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=${combined}`
                            : `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`;
                        setQuery(q);
                    }}
                    onReset={() => reloadTable()}
                    onAddClick={() => {
                        setDataInit(null);
                        setOpenModal(true);
                    }}
                />
            }
        >
            <Access permission={ALL_PERMISSIONS.COMPANY.GET_PAGINATE}>
                <DataTable<ICompany>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={companies}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: companies || [],
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
                                công ty
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            {/* Modal thêm/sửa */}
            <ModalCompany
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            {/* Drawer xem chi tiết */}
            <ViewDetailCompany
                onClose={setOpenViewDetail}
                open={openViewDetail}
                companyId={selectedCompanyId}
            />
        </PageContainer>
    );
};

export default CompanyPage;
