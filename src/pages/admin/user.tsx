import DataTable from "@/components/admin/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUser } from "@/redux/slice/userSlide";
import type { IUser } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag, notification } from "antd";
import { useState, useRef } from "react";
import queryString from "query-string";
import ModalUser from "@/components/admin/user/modal.user";
import ViewDetailUser from "@/components/admin/user/view.user";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import { callFetchUserById } from "@/config/api";

const UserPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IUser | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const tableRef = useRef<ActionType>(null!);

    const isFetching = useAppSelector((state) => state.user.isFetching);
    const meta = useAppSelector((state) => state.user.meta);
    const users = useAppSelector((state) => state.user.result);
    const dispatch = useAppDispatch();

    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    const handleViewDetail = async (id?: string | number) => {
        if (!id) return;
        try {
            const res = await callFetchUserById(id);
            if (res && res.data) {
                setDataInit(res.data);
                setOpenViewDetail(true);
            } else {
                notification.error({
                    message: "Không thể tải thông tin user",
                    description: res?.message || "Lỗi không xác định.",
                });
            }
        } catch (e) {
            notification.error({
                message: "Lỗi hệ thống",
                description: "Không thể kết nối tới máy chủ.",
            });
        }
    };

    const columns: ProColumns<IUser>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) + (meta.page - 1) * meta.pageSize,
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


                    <Access permission={ALL_PERMISSIONS.USERS.GET_BY_ID}
                        hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => handleViewDetail(entity.id)}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.USERS.UPDATE}
                        hideChildren>
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

        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort?.name)
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        else if (sort?.email)
            sortBy = sort.email === "ascend" ? "sort=email,asc" : "sort=email,desc";
        else sortBy = "sort=updatedAt,desc";

        return `${temp}&${sortBy}`;
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.USERS.GET_PAGINATE}>
                <DataTable<IUser>
                    actionRef={tableRef}
                    headerTitle="Danh sách người dùng"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={users}
                    request={async (params, sort): Promise<any> => {
                        const query = buildQuery(params, sort);
                        await dispatch(fetchUser({ query }));
                    }}
                    pagination={{
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => (
                            <div>
                                {range[0]}–{range[1]} trên {total} người dùng
                            </div>
                        ),
                    }}
                    rowSelection={false}
                    toolBarRender={() => [
                        <Access key="create-user" permission={ALL_PERMISSIONS.USERS.CREATE}>
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
                        </Access>,
                    ]}
                />
            </Access>

            {/* Modal Tạo / Sửa */}
            <ModalUser
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailUser
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
};

export default UserPage;
