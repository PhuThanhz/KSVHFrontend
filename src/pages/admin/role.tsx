import DataTable from "@/components/admin/data-table";
import { useState, useRef, useEffect } from "react";
import type { IPermission, IRole } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag } from "antd";
import dayjs from "dayjs";
import queryString from "query-string";
import ModalRole from "@/components/admin/role/modal.role";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import { sfLike } from "spring-filter-query-builder";
import { groupByPermission } from "@/config/utils";
import { usePermissionsQuery } from "@/hooks/user/usePermissions";
import { useRolesQuery, useDeleteRoleMutation } from "@/hooks/user/useRoles";

const RolePage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [listPermissions, setListPermissions] = useState<{
        module: string;
        permissions: IPermission[];
    }[] | null>(null);
    const [singleRole, setSingleRole] = useState<IRole | null>(null);
    const [query, setQuery] = useState<string>("page=1&size=10&sort=createdAt,desc");
    const tableRef = useRef<ActionType>(null!);

    //  React Query
    const { data, isLoading, refetch } = useRolesQuery(query);
    const deleteRoleMutation = useDeleteRoleMutation();

    const { data: permissionsData } = usePermissionsQuery("page=1&size=500");

    useEffect(() => {
        if (permissionsData?.result) {
            setListPermissions(groupByPermission(permissionsData.result));
        }
    }, [permissionsData]);

    //  Xóa role
    const handleDeleteRole = async (id?: string) => {
        if (!id) return;
        try {
            await deleteRoleMutation.mutateAsync(id);
        } catch (err) {
            console.error(err);
        }
    };

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (clone.name) q.filter = `${sfLike("name", clone.name)}`;
        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q, { encode: false });
        let sortBy = "";

        if (sort?.name) sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        if (sort?.createdAt) sortBy = sort.createdAt === "ascend" ? "sort=createdAt,asc" : "sort=createdAt,desc";
        if (sort?.updatedAt) sortBy = sort.updatedAt === "ascend" ? "sort=updatedAt,asc" : "sort=updatedAt,desc";

        temp += sortBy ? `&${sortBy}` : "&sort=createdAt,desc";
        return temp;
    };

    const columns: ProColumns<IRole>[] = [
        {
            title: "Id",
            dataIndex: "id",
            width: 250,
            hideInSearch: true,
            render: (_, record) => <span>{record.id}</span>,
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            hideInSearch: true,
            render: (_, record) => (
                <Tag color={record.active ? "lime" : "red"}>
                    {record.active ? "ACTIVE" : "INACTIVE"}
                </Tag>
            ),
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            width: 200,
            sorter: true,
            hideInSearch: true,
            render: (_, record) => (record.createdAt ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss") : ""),
        },
        {
            title: "UpdatedAt",
            dataIndex: "updatedAt",
            width: 200,
            sorter: true,
            hideInSearch: true,
            render: (_, record) => (record.updatedAt ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss") : ""),
        },
        {
            title: "Actions",
            hideInSearch: true,
            width: 50,
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.ROLES.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 20, color: "#ffa500" }}
                            onClick={() => {
                                setSingleRole(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.ROLES.DELETE} hideChildren>
                        <Popconfirm
                            placement="leftTop"
                            title="Xác nhận xóa role"
                            description="Bạn có chắc chắn muốn xóa role này?"
                            onConfirm={() => handleDeleteRole(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}>
                <DataTable<IRole>
                    actionRef={tableRef}
                    headerTitle="Danh sách Roles (Vai Trò)"
                    rowKey="id"
                    loading={isLoading}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort, filter) => {
                        const q = buildQuery(params, sort, filter);
                        setQuery(q);
                        return {
                            data: data?.result || [],
                            success: true,
                            total: data?.meta?.total || 0,
                        };
                    }}
                    scroll={{ x: true }}
                    pagination={{
                        defaultPageSize: 10,

                        current: data?.meta?.page,
                        pageSize: data?.meta?.pageSize,
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
                                vai trò
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
                        <Access permission={ALL_PERMISSIONS.ROLES.CREATE} key="create" hideChildren>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                Thêm mới
                            </Button>
                        </Access>

                    ]}
                />
            </Access>
            {listPermissions && (
                <ModalRole
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reloadTable={refetch}
                    listPermissions={listPermissions}
                    singleRole={singleRole}
                    setSingleRole={setSingleRole}
                />
            )}

        </div>
    );
};

export default RolePage;
