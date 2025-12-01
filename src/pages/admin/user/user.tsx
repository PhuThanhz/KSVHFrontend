import { useEffect, useRef, useState } from "react";
import { Button, Space, Tag } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import queryString from "query-string";
import dayjs from "dayjs";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

import type { IUser } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { sfLike } from "spring-filter-query-builder";
import { useUsersQuery } from "@/hooks/user/useUsers";
import { useRolesQuery } from "@/hooks/user/useRoles";
import ModalUser from "@/pages/admin/user/modal.user";
import ViewDetailUser from "@/pages/admin/user/view.user";

const UserPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IUser | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");

    const [roleOptions, setRoleOptions] = useState<{ label: string; value: string; color?: string }[]>([]);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useUsersQuery(query);
    const { data: rolesData } = useRolesQuery("page=1&size=100");

    useEffect(() => {
        if (rolesData?.result) {
            const list = rolesData.result.map((r: any) => ({
                label: r.name,
                value: r.name,
                color: "blue",
            }));
            setRoleOptions(list);
        }
    }, [rolesData]);

    // Auto call API whenever filters change
    useEffect(() => {
        const q: any = {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            sort: "createdAt,desc",
        };

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(`(name~'${searchValue}' or email~'${searchValue}')`);
        }

        if (roleFilter) filterParts.push(`role.name='${roleFilter}'`);
        if (activeFilter !== null) filterParts.push(`active=${activeFilter}`);
        if (createdAtFilter) filterParts.push(createdAtFilter);

        if (filterParts.length > 0) q.filter = filterParts.join(" and ");

        const built = queryString.stringify(q, { encode: false });
        setQuery(built);
    }, [searchValue, roleFilter, activeFilter, createdAtFilter]);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const users = data?.result ?? [];

    /** Xây dựng query filter cho DataTable sort/pagination */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            filter: "",
        };

        const filterParts: string[] = [];

        if (searchValue) {
            filterParts.push(`(name~'${searchValue}' or email~'${searchValue}')`);
        }

        if (roleFilter) filterParts.push(`role.name='${roleFilter}'`);
        if (activeFilter !== null) filterParts.push(`active=${activeFilter}`);
        if (createdAtFilter) filterParts.push(createdAtFilter);

        if (filterParts.length > 0) q.filter = filterParts.join(" and ");

        let temp = queryString.stringify(q, { encode: false });

        let sortBy = "";
        if (sort?.name)
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        else if (sort?.email)
            sortBy = sort.email === "ascend" ? "sort=email,asc" : "sort=email,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    const reloadTable = () => {
        setSearchValue("");
        setRoleFilter(null);
        setActiveFilter(null);
        setCreatedAtFilter(null);
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
        );
    };

    const columns: ProColumns<IUser>[] = [
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
            title: "Tên hiển thị",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: true,
        },
        {
            title: "Vai trò",
            dataIndex: ["role", "name"],
            hideInSearch: true,
            render: (_, record) =>
                record.role?.name ? (
                    <Tag color="blue">{record.role.name}</Tag>
                ) : (
                    <Tag>Chưa có vai trò</Tag>
                ),
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            hideInSearch: true,
            render: (_, record) =>
                record.active ? (
                    <Tag color="green">Đang hoạt động</Tag>
                ) : (
                    <Tag color="red">Ngừng hoạt động</Tag>
                ),
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
            width: 120,
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.USERS.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedUserId(String(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.USERS.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#fa8c16", cursor: "pointer" }}
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
            title="Quản lý người dùng"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo tên hoặc email..."
                        addLabel="Thêm người dùng"
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
                                    key: "role",
                                    label: "Vai trò",
                                    icon: <></>,
                                    options: roleOptions,
                                },
                                {
                                    key: "active",
                                    label: "Trạng thái",
                                    icon: <></>,
                                    options: [
                                        { label: "Đang hoạt động", value: true, color: "green" },
                                        { label: "Ngừng hoạt động", value: false, color: "red" },
                                    ],
                                },
                            ]}
                            onChange={(filters) => {
                                setRoleFilter(filters.role || null);
                                setActiveFilter(
                                    filters.active !== undefined ? filters.active : null
                                );
                            }}
                        />
                        <DateRangeFilter
                            fieldName="createdAt"
                            onChange={(filter) => setCreatedAtFilter(filter)}
                        />
                    </div>
                </div>
            }
        >
            <Access permission={ALL_PERMISSIONS.USERS.GET_PAGINATE}>
                <DataTable<IUser>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={users}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: users,
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
                                <span
                                    style={{ fontWeight: 600, color: "#1677ff" }}
                                >
                                    {total.toLocaleString()}
                                </span>{" "}
                                người dùng
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            <ModalUser
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailUser
                onClose={setOpenViewDetail}
                open={openViewDetail}
                userId={selectedUserId}
            />
        </PageContainer>
    );
};

export default UserPage;
