import DataTable from "@/components/admin/data-table";
import type { IMaterialSupplier } from "@/types/backend";
import { EditOutlined, EyeOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag } from "antd";
import { useState } from "react";
import queryString from "query-string";
import dayjs from "dayjs";
import ModalMaterialSupplier from "@/components/admin/material-supplier/modal.materialSupplier";
import ViewMaterialSupplier from "@/components/admin/material-supplier/view.materialSupplier";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useMaterialSuppliersQuery, useDeleteMaterialSupplierMutation } from "@/hooks/useMaterialSuppliers";

const MaterialSupplierPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IMaterialSupplier | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
    const [query, setQuery] = useState<string>("page=1&size=10&sort=createdAt,desc");

    const { data, isFetching } = useMaterialSuppliersQuery(query);
    const deleteMutation = useDeleteMaterialSupplierMutation();

    const meta = data?.meta ?? { page: 1, pageSize: 10, total: 0 };
    const suppliers = data?.result ?? [];

    const handleDelete = async (id: string | number) => {
        await deleteMutation.mutateAsync(id);
    };

    /** ==================== Build query (phân trang, sort, filter) ==================== */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
        };

        if (params.supplierCode) q.supplierCode = params.supplierCode;
        if (params.supplierName) q.supplierName = params.supplierName;

        let temp = queryString.stringify(q);

        // Sort
        const sortField =
            sort?.supplierName
                ? `sort=supplierName,${sort.supplierName === "ascend" ? "asc" : "desc"}`
                : "sort=createdAt,desc";

        return `${temp}&${sortField}`;
    };

    /** ==================== Columns ==================== */
    const columns: ProColumns<IMaterialSupplier>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) + ((meta.page || 1) - 1) * (meta.pageSize || 10),
            hideInSearch: true,
        },
        { title: "Mã NCC", dataIndex: "supplierCode", sorter: true },
        { title: "Tên NCC", dataIndex: "supplierName", sorter: true },
        { title: "Người đại diện", dataIndex: "representative", hideInSearch: true },
        { title: "Số điện thoại", dataIndex: "phone", hideInSearch: true },
        { title: "Email", dataIndex: "email", hideInSearch: true },
        { title: "Địa chỉ", dataIndex: "address", hideInSearch: true },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm") : "-",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            hideInSearch: true,
            render: (_, record) =>
                record.updatedAt ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm") : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 140,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.MATERIAL_SUPPLIER?.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedSupplierId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.MATERIAL_SUPPLIER?.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#ffa500", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.MATERIAL_SUPPLIER?.DELETE} hideChildren>
                        <Popconfirm
                            placement="topLeft"
                            title="Xác nhận xóa nhà cung cấp vật tư"
                            description="Bạn có chắc chắn muốn xóa nhà cung cấp này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(entity.id!)}
                        >
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "#ff4d4f", cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.MATERIAL_SUPPLIER?.GET_PAGINATE}>
                <DataTable<IMaterialSupplier>
                    headerTitle="Danh sách nhà cung cấp vật tư"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={suppliers}
                    request={async (params, sort): Promise<any> => {
                        const newQuery = buildQuery(params, sort);
                        setQuery(newQuery);
                    }}
                    pagination={{
                        current: meta.page,
                        pageSize: meta.pageSize,
                        total: meta.total,
                        showQuickJumper: true,
                        showSizeChanger: true,
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
                    rowSelection={false}
                    toolBarRender={() => [
                        <Access permission={ALL_PERMISSIONS.MATERIAL_SUPPLIER?.CREATE} hideChildren>
                            <Button
                                key="create"
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

            <ModalMaterialSupplier
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewMaterialSupplier
                onClose={setOpenViewDetail}
                open={openViewDetail}
                supplierId={selectedSupplierId}
            />
        </div>
    );
};

export default MaterialSupplierPage;
