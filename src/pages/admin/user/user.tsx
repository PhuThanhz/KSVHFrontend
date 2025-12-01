import DataTable from "@/components/common/data-table";
import type { IUser } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag, Select } from "antd";
import { useEffect, useState } from "react";
import queryString from "query-string";
import ModalUser from "@/pages/admin/user/modal.user";
import ViewDetailUser from "@/pages/admin/user/view.user";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import { useUsersQuery } from "@/hooks/user/useUsers";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";
import { useRolesQuery } from "@/hooks/user/useRoles";

const UserPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IUser | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );

    const { data, isFetching } = useUsersQuery(query);

    const { data: rolesData, isLoading: isRolesLoading } = useRolesQuery("page=1&size=100");

    useEffect(() => {
        if (rolesData?.result) {
            const list = rolesData.result.map((r: any) => ({
                label: r.name,
                value: r.name,
            }));
            setRoleOptions(list);
        }
    }, [rolesData]);


    //  Build query string có thêm role + active
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.name) q.filter = sfLike("name", params.name);
        if (params.email)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("email", params.email)}`
                : sfLike("email", params.email);

        // Lọc vai trò
        if (roleFilter) {
            q.filter = q.filter
                ? `${q.filter} and role.name='${roleFilter}'`
                : `role.name='${roleFilter}'`;
        }

        // Lọc trạng thái
        if (activeFilter !== null) {
            q.filter = q.filter
                ? `${q.filter} and active=${activeFilter}`
                : `active=${activeFilter}`;
        }

        // Lọc theo ngày
        if (createdAtFilter) {
            q.filter = q.filter ? `${q.filter} and ${createdAtFilter}` : createdAtFilter;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q, { encode: false });

        // Sort
        let sortBy = "";
        if (sort?.name)
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        else if (sort?.email)
            sortBy = sort.email === "ascend" ? "sort=email,asc" : "sort=email,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    const columns: ProColumns<IUser>[] = [
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
            sorter: true,
            hideInSearch: true,
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
            sorter: true,
            hideInSearch: true,
            render: (_, record) =>
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
                    <Access permission={ALL_PERMISSIONS.USERS.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedUserId(String(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.USERS.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 18,
                                color: "#ffa500",
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
        <div>
            <Access permission={ALL_PERMISSIONS.USERS.GET_PAGINATE}>
                <DataTable<IUser>
                    headerTitle="Danh sách người dùng"
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
                        pageSize: data?.meta?.pageSize || 10,
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        total: data?.meta?.total,
                        showQuickJumper: true,
                        size: "default",
                        showTotal: (total, range) => (
                            <div style={{ fontSize: 13, color: "#595959" }}>
                                <span style={{ fontWeight: 500, color: "#000" }}>
                                    {range[0]}–{range[1]}
                                </span>{" "}
                                trên{" "}
                                <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                    {total.toLocaleString()}
                                </span>{" "}
                                người dùng
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
                        <Space key="toolbar" size={12} align="center" wrap>
                            <Select
                                placeholder="Chọn vai trò"
                                allowClear
                                style={{ width: 180 }}
                                options={roleOptions}
                                loading={isRolesLoading}
                                onChange={(value) => setRoleFilter(value || null)}
                            />
                            {/* Bộ lọc trạng thái */}
                            <Select
                                placeholder="Trạng thái"
                                allowClear
                                style={{ width: 150 }}
                                options={[
                                    { label: "Đang hoạt động", value: true },
                                    { label: "Ngừng hoạt động", value: false },
                                ]}
                                onChange={(value) =>
                                    setActiveFilter(value === undefined ? null : value)
                                }
                            />
                            {/* Bộ lọc ngày tạo */}
                            <DateRangeFilter
                                label="Ngày tạo"
                                fieldName="createdAt"
                                size="middle"
                                width={320}
                                onChange={(filterStr) => setCreatedAtFilter(filterStr)}
                            />
                            <Access permission={ALL_PERMISSIONS.USERS.CREATE} hideChildren>
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
                            </Access>
                        </Space>,
                    ]}
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
        </div>
    );
};

export default UserPage;
