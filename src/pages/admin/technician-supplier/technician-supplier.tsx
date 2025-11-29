import DataTable from "@/components/common/data-table";
import type { ITechnicianSupplier } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Popconfirm, Tag } from "antd";
import { useState } from "react";
import queryString from "query-string";
import ModalTechnicianSupplier from "@/pages/admin/technician-supplier/modal.technician.supplier";
import ViewDetailTechnicianSupplier from "@/pages/admin/technician-supplier/view.technician.supplier";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useTechnicianSuppliersQuery, useDeleteTechnicianSupplierMutation } from "@/hooks/useTechnicianSuppliers";
import dayjs from "dayjs";

const TechnicianSupplierPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ITechnicianSupplier | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);


    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );

    const { data, isFetching } = useTechnicianSuppliersQuery(query);
    const deleteMutation = useDeleteTechnicianSupplierMutation();

    const handleDelete = async (id: number | string) => {
        await deleteMutation.mutateAsync(id);
    };

    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
        };

        if (params.name) q.filter = `name ~ '${params.name}'`;
        if (params.supplierCode)
            q.filter = q.filter
                ? `${q.filter} and supplierCode ~ '${params.supplierCode}'`
                : `supplierCode ~ '${params.supplierCode}'`;

        let temp = queryString.stringify(q, { encode: false });

        // Sort
        let sortBy = "";
        if (sort?.name)
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        else if (sort?.supplierCode)
            sortBy = sort.supplierCode === "ascend"
                ? "sort=supplierCode,asc"
                : "sort=supplierCode,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    const columns: ProColumns<ITechnicianSupplier>[] = [
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
            title: "Mã nhà cung cấp",
            dataIndex: "supplierCode",
            sorter: true,
        },
        {
            title: "Tên nhà cung cấp",
            dataIndex: "name",
            sorter: true,
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
            sorter: true,
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt
                    ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm")
                    : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 120,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedSupplierId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.UPDATE} hideChildren>
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

                    <Access permission={ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.DELETE} hideChildren>
                        <Popconfirm
                            placement="leftTop"
                            title="Xác nhận xóa nhà cung cấp"
                            description="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
                            onConfirm={() => handleDelete(entity.id!)}
                            okText="Xác nhận"
                            cancelText="Hủy"
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
        <div>
            <Access permission={ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.GET_PAGINATE}>
                <DataTable<ITechnicianSupplier>
                    headerTitle="Danh sách nhà cung cấp kỹ thuật viên"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort): Promise<any> => {
                        const newQuery = buildQuery(params, sort);
                        setQuery(newQuery);
                    }}
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
                                nhà cung cấp
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
                    toolBarRender={() => [
                        <Access permission={ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.CREATE} key="create" hideChildren>
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

            <ModalTechnicianSupplier
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailTechnicianSupplier
                onClose={setOpenViewDetail}
                open={openViewDetail}
                supplierId={selectedSupplierId}
            />
        </div>
    );
};

export default TechnicianSupplierPage;
