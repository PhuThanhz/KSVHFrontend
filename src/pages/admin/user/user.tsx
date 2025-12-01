import { useEffect, useRef, useState } from "react";
import { Button, Space, Tag } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    TagOutlined,
    UserSwitchOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import queryString from "query-string";
import dayjs from "dayjs";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useUsersQuery } from "@/hooks/user/useUsers";
import { useRolesQuery } from "@/hooks/user/useRoles";
import ModalUser from "@/pages/admin/user/modal.user";
import ViewDetailUser from "@/pages/admin/user/view.user";

import type { IUser } from "@/types/backend";
import { PAGINATION_CONFIG } from "@/config/pagination";

const UserPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IUser | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const [filters, setFilters] = useState<Record<string, any>>({});
    const [query, setQuery] = useState(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useUsersQuery(query);
    const { data: rolesData } = useRolesQuery("page=1&size=100");

    const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        if (rolesData?.result) {
            const list = rolesData.result.map((r: any) => ({
                label: r.name,
                value: r.name,
            }));
            setRoleOptions(list);
        }
    }, [rolesData]);

    // Xây dựng query string từ filter hiện tại
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current || PAGINATION_CONFIG.DEFAULT_PAGE,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        let filterString = "";

        if (filters.role) {
            filterString += `role.name='${filters.role}'`;
        }

        if (filters.active !== undefined && filters.active !== null) {
            filterString += filterString
                ? ` and active=${filters.active}`
                : `active=${filters.active}`;
        }

        if (filters.createdAtRange) {
            filterString += filterString
                ? ` and ${filters.createdAtRange}`
                : filters.createdAtRange;
        }

        if (filters.search) {
            filterString += filterString
                ? ` and (name~'${filters.search}' or email~'${filters.search}')`
                : `(name~'${filters.search}' or email~'${filters.search}')`;
        }

        if (filterString) q.filter = filterString;

        const sortBy = sort?.name
            ? `sort=name,${sort.name === "ascend" ? "asc" : "desc"}`
            : "sort=createdAt,desc";

        return queryString.stringify(q, { encode: false }) + `&${sortBy}`;
    };

    // Cập nhật query khi filters thay đổi
    useEffect(() => {
        const q = buildQuery({ current: 1, pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE }, {});
        setQuery(q);
    }, [filters]);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };

    const users = data?.result ?? [];

    const columns: ProColumns<IUser>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index + 1 + ((meta.page || 1) - 1) * (meta.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE),
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
            render: (_, record) =>
                record.role?.name ? (
                    <Tag color="blue">{record.role.name}</Tag>
                ) : (
                    <Tag color="default">Chưa có vai trò</Tag>
                ),
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
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
            render: (_, record) =>
                record.createdAt ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm") : "-",
        },
        {
            title: "Hành động",
            width: 120,
            align: "center",
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
                <Space wrap size={12}>
                    <SearchFilter
                        searchPlaceholder="Tìm kiếm theo tên hoặc email..."
                        showAddButton={true}
                        addLabel="Thêm người dùng"
                        showFilterButton={false}
                        showResetButton={false}
                        onSearch={(val) => setFilters((prev) => ({ ...prev, search: val }))}
                        onAddClick={() => {
                            setDataInit(null);
                            setOpenModal(true);
                        }}
                    />

                    <AdvancedFilterSelect
                        fields={[
                            {
                                key: "role",
                                label: "Vai trò",
                                icon: <UserSwitchOutlined />,
                                options: roleOptions,
                            },
                            {
                                key: "active",
                                label: "Trạng thái",
                                icon: <TagOutlined />,
                                options: [
                                    { label: "Đang hoạt động", value: true, color: "green" },
                                    { label: "Ngừng hoạt động", value: false, color: "red" },
                                ],
                            },
                        ]}
                        onChange={(selected) => setFilters((prev) => ({ ...prev, ...selected }))}
                    />

                    <DateRangeFilter
                        label="Khoảng ngày tạo"
                        fieldName="createdAt"
                        onChange={(filter) => setFilters((prev) => ({ ...prev, createdAtRange: filter }))}
                    />
                </Space>
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
                            data: users || [],
                            success: true,
                            total: meta.total || 0,
                        });
                    }}
                    pagination={false}
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
