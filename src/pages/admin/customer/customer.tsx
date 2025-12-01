import { useRef, useState } from "react";
import { Button, Space, Tag } from "antd";
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
import type { ICustomer } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useCustomersQuery } from "@/hooks/user/useCustomers";
import ModalCustomer from "@/pages/admin/customer/modal.customer";
import ViewDetailCustomer from "@/pages/admin/customer/view.customer";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { sfLike } from "spring-filter-query-builder";

const CustomerPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ICustomer | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
    );

    const tableRef = useRef<ActionType>(null);
    const { data, isFetching } = useCustomersQuery(query);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const customers = data?.result ?? [];

    /** Reload bảng */
    const reloadTable = () => {
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
        );
    };

    /** Build query cho sort/pagination/filter */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            filter: "",
        };

        if (params.customerCode)
            q.filter = sfLike("customerCode", params.customerCode);

        if (params.name)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("name", params.name)}`
                : sfLike("name", params.name);

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
        else if (sort?.email)
            sortBy = sort.email === "ascend" ? "sort=email,asc" : "sort=email,desc";
        else sortBy = `sort=${PAGINATION_CONFIG.DEFAULT_SORT}`;

        return `${temp}&${sortBy}`;
    };

    /** Cột bảng */
    const columns: ProColumns<ICustomer>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index +
                1 +
                ((meta.page || 1) - 1) * (meta.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE),
            hideInSearch: true,
        },
        {
            title: "Mã KH",
            dataIndex: "customerCode",
            sorter: true,
        },
        {
            title: "Tên khách hàng",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: true,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            hideInSearch: true,
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            hideInSearch: true,
            render: (text) => (text ? <Tag color="blue">{text}</Tag> : "-"),
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            hideInSearch: true,
            align: "center",
            render: (_: any, record: ICustomer) =>
                record.active ? (
                    <Tag color="green">Đang hoạt động</Tag>
                ) : (
                    <Tag color="red">Ngừng hoạt động</Tag>
                ),
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 120,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.CUSTOMER.GET_BY_ID} hideChildren>
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

                    <Access permission={ALL_PERMISSIONS.CUSTOMER.UPDATE} hideChildren>
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
            title="Quản lý khách hàng"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm kiếm theo mã hoặc tên khách hàng..."
                    addLabel="Thêm khách hàng"
                    filterFields={[
                        { name: "email", label: "Email", placeholder: "Nhập email..." },
                        { name: "phone", label: "Số điện thoại", placeholder: "Nhập số điện thoại..." },
                        { name: "address", label: "Địa chỉ", placeholder: "Nhập địa chỉ..." },
                    ]}
                    onSearch={(val) =>
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=(customerCode~'${val}' or name~'${val}')`
                        )
                    }
                    onFilterApply={(filters) => {
                        const conditions: string[] = [];
                        if (filters.email)
                            conditions.push(`email~'${filters.email}'`);
                        if (filters.phone)
                            conditions.push(`phone~'${filters.phone}'`);
                        if (filters.address)
                            conditions.push(`address~'${filters.address}'`);

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
            <Access permission={ALL_PERMISSIONS.CUSTOMER.GET_PAGINATE}>
                <DataTable<ICustomer>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={customers}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: customers || [],
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
                                khách hàng
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            <ModalCustomer
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailCustomer
                onClose={setOpenViewDetail}
                open={openViewDetail}
                customerId={selectedId}
            />
        </PageContainer>
    );
};

export default CustomerPage;
