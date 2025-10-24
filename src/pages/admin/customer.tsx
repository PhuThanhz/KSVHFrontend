import DataTable from "@/components/admin/data-table";
import type { ICustomer } from "@/types/backend";
import { EditOutlined, EyeOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag, Popconfirm } from "antd";
import { useState } from "react";
import queryString from "query-string";
import { useCustomersQuery, useDeleteCustomerMutation } from "@/hooks/useCustomers";
import ModalCustomer from "@/components/admin/customer/modal.customer";
import ViewDetailCustomer from "@/components/admin/customer/view.customer";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import { sfLike } from "spring-filter-query-builder";
import dayjs from "dayjs";

const CustomerPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ICustomer | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [query, setQuery] = useState<string>(() =>
        queryString.stringify({ page: 1, size: 10, sort: "createdAt,desc" })
    );

    const { data, isFetching } = useCustomersQuery(query);
    const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomerMutation();

    /** Build query */
    const buildQuery = (params: any, sort: any) => {
        const q: any = { page: params.current, size: params.pageSize, filter: "" };

        if (params.name) q.filter = sfLike("name", params.name);
        if (params.email)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("email", params.email)}`
                : sfLike("email", params.email);

        let sortBy = "sort=createdAt,desc";
        if (sort?.name)
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        else if (sort?.email)
            sortBy = sort.email === "ascend" ? "sort=email,asc" : "sort=email,desc";

        return `${queryString.stringify(q)}&${sortBy}`;
    };

    /** Columns */
    const columns: ProColumns<ICustomer>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            hideInSearch: true,
        },
        { title: "Mã KH", dataIndex: "customerCode", sorter: true },
        { title: "Tên khách hàng", dataIndex: "name", sorter: true },
        { title: "Email", dataIndex: "email" },
        { title: "Số điện thoại", dataIndex: "phone", hideInSearch: true },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            render: (text) => <Tag color="blue">{text || "-"}</Tag>,
            hideInSearch: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (text: any) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "-"),
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 140,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.CUSTOMER.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.CUSTOMER.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#faad14", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.CUSTOMER.DELETE} hideChildren>
                        <Popconfirm
                            title="Xóa khách hàng?"
                            description="Bạn có chắc muốn xóa khách hàng này không?"
                            onConfirm={() => entity.id && deleteCustomer(entity.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "red", cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.CUSTOMER.GET_PAGINATE}>
                <DataTable<ICustomer>
                    headerTitle="Danh sách khách hàng"
                    rowKey="id"
                    loading={isFetching || isDeleting}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort): Promise<any> => {
                        const newQuery = buildQuery(params, sort);
                        setQuery(newQuery);
                    }}
                    pagination={{
                        current: data?.meta?.page,
                        pageSize: data?.meta?.pageSize,
                        total: data?.meta?.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    toolBarRender={() => [
                        <Access key="create" permission={ALL_PERMISSIONS.CUSTOMER.CREATE}>
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
        </div>
    );
};

export default CustomerPage;
