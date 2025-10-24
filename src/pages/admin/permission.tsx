import DataTable from "@/components/admin/data-table";
import type { IPermission } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space } from "antd";
import { useState, useRef } from "react";
import dayjs from "dayjs";
import queryString from "query-string";
import { colorMethod } from "@/config/utils";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import ModalPermission from "@/components/admin/permission/modal.permission";
import ViewDetailPermission from "@/components/admin/permission/view.permission";
import {
    usePermissionsQuery,
    useDeletePermissionMutation,
} from "@/hooks/usePermissions";

const PermissionPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IPermission | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [query, setQuery] = useState<string>("page=1&size=10&sort=createdAt,desc");

    const tableRef = useRef<ActionType>(null!);

    //  React Query hooks
    const { data, isFetching } = usePermissionsQuery(query);
    const deleteMutation = useDeletePermissionMutation();

    const meta = data?.meta ?? { page: 1, pageSize: 10, total: 0 };
    const permissions = data?.result ?? [];

    const reloadTable = () => {
        setQuery("page=1&size=10&sort=createdAt,desc");
    };

    const handleDeletePermission = async (id?: string) => {
        if (!id) return;
        await deleteMutation.mutateAsync(id, {
            onSuccess: () => reloadTable(),
        });
    };

    const columns: ProColumns<IPermission>[] = [
        {
            title: "Id",
            dataIndex: "id",
            width: 50,
            render: (_, record) => (
                <a
                    onClick={() => {
                        setOpenViewDetail(true);
                        setDataInit(record);
                    }}
                >
                    {record.id}
                </a>
            ),
            hideInSearch: true,
        },
        { title: "Name", dataIndex: "name", sorter: true },
        { title: "API", dataIndex: "apiPath", sorter: true },
        {
            title: "Method",
            dataIndex: "method",
            sorter: true,
            render: (_, record) => (
                <p
                    style={{
                        paddingLeft: 10,
                        fontWeight: "bold",
                        marginBottom: 0,
                        color: colorMethod(record.method as string),
                    }}
                >
                    {record.method}
                </p>
            ),
        },
        { title: "Module", dataIndex: "module", sorter: true },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            width: 200,
            sorter: true,
            render: (_, record) =>
                record.createdAt
                    ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")
                    : "",
            hideInSearch: true,
        },
        {
            title: "UpdatedAt",
            dataIndex: "updatedAt",
            width: 200,
            sorter: true,
            render: (_, record) =>
                record.updatedAt
                    ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")
                    : "",
            hideInSearch: true,
        },
        {
            title: "Actions",
            hideInSearch: true,
            width: 50,
            render: (_, entity) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{ fontSize: 20, color: "#ffa500" }}
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.PERMISSIONS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title="Xác nhận xóa permission"
                            description="Bạn có chắc chắn muốn xóa permission này?"
                            onConfirm={() => handleDeletePermission(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{ fontSize: 20, color: "#ff4d4f" }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        const parts: string[] = [];

        if (clone.name) parts.push(`name ~ '${clone.name}'`);
        if (clone.apiPath) parts.push(`apiPath ~ '${clone.apiPath}'`);
        if (clone.method) parts.push(`method ~ '${clone.method}'`);
        if (clone.module) parts.push(`module ~ '${clone.module}'`);

        clone.filter = parts.join(" and ");
        if (!clone.filter) delete clone.filter;

        clone.page = clone.current;
        clone.size = clone.pageSize;
        delete clone.current;
        delete clone.pageSize;
        delete clone.name;
        delete clone.apiPath;
        delete clone.method;
        delete clone.module;

        let temp = queryString.stringify(clone);

        const fields = [
            "name",
            "apiPath",
            "method",
            "module",
            "createdAt",
            "updatedAt",
        ];

        let sortBy = "";
        if (sort) {
            for (const field of fields) {
                if (sort[field]) {
                    sortBy = `sort=${field},${sort[field] === "ascend" ? "asc" : "desc"
                        }`;
                    break;
                }
            }
        }

        if (!sortBy) temp = `${temp}&sort=updatedAt,desc`;
        else temp = `${temp}&${sortBy}`;

        return temp;
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}>
                <DataTable<IPermission>
                    actionRef={tableRef}
                    headerTitle="Danh sách Permissions (Quyền Hạn)"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={permissions}
                    request={async (params, sort, filter) => {
                        const q = buildQuery(params, sort, filter);
                        setQuery(q);
                        return Promise.resolve({
                            data: permissions || [],
                            success: true,
                            total: meta.total || 0,
                        });
                    }}
                    scroll={{ x: true }}
                    pagination={{
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
                                quyền
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
                        <Button
                            key="create"
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => setOpenModal(true)}
                        >
                            Thêm mới
                        </Button>,
                    ]}

                />
            </Access>

            <ModalPermission
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailPermission
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
};

export default PermissionPage;
