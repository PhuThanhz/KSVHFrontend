import { useRef, useState } from "react";
import { Button, Popconfirm, Space } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import dayjs from "dayjs";
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";

import type { ITechnicianSupplier } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import {
    useTechnicianSuppliersQuery,
    useDeleteTechnicianSupplierMutation,
} from "@/hooks/useTechnicianSuppliers";
import ModalTechnicianSupplier from "@/pages/admin/technician-supplier/modal.technician.supplier";
import ViewDetailTechnicianSupplier from "@/pages/admin/technician-supplier/view.technician.supplier";
import { PAGINATION_CONFIG } from "@/config/pagination";

const TechnicianSupplierPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ITechnicianSupplier | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useTechnicianSuppliersQuery(query);
    const deleteMutation = useDeleteTechnicianSupplierMutation();

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const suppliers = data?.result ?? [];

    /** ================== Xử lý xóa ================== */
    const handleDelete = async (id?: number | string) => {
        if (!id) return;
        await deleteMutation.mutateAsync(id, {
            onSuccess: () => reloadTable(),
        });
    };

    /** ================== Reload table ================== */
    const reloadTable = () => {
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
        );
    };

    /** ================== Build query ================== */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        const filters: string[] = [];

        if (params.name) filters.push(`name~'${params.name}'`);
        if (params.email) filters.push(`email~'${params.email}'`);
        if (params.phone) filters.push(`phone~'${params.phone}'`);

        if (filters.length > 0) q.filter = filters.join(" and ");

        let temp = queryString.stringify(q, { encode: false });

        let sortBy = "";
        if (sort?.name)
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        else sortBy = `sort=${PAGINATION_CONFIG.DEFAULT_SORT}`;

        return `${temp}&${sortBy}`;
    };

    /** ================== Cột bảng ================== */
    const columns: ProColumns<ITechnicianSupplier>[] = [
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
                    <Access
                        permission={ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.GET_BY_ID}
                        hideChildren
                    >
                        <EyeOutlined
                            style={{
                                fontSize: 18,
                                color: "#1677ff",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSelectedSupplierId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access
                        permission={ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.UPDATE}
                        hideChildren
                    >
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

                    <Access
                        permission={ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title="Xác nhận xóa nhà cung cấp"
                            description="Bạn có chắc chắn muốn xóa nhà cung cấp này không?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDelete(entity.id!)}
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
        <PageContainer
            title="Quản lý nhà cung cấp kỹ thuật viên"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm theo tên hoặc mã nhà cung cấp..."
                    addLabel="Thêm nhà cung cấp"
                    filterFields={[
                        {
                            name: "email",
                            label: "Email",
                            placeholder: "Nhập email...",
                        },
                        {
                            name: "phone",
                            label: "Số điện thoại",
                            placeholder: "Nhập số điện thoại...",
                        },
                    ]}
                    onSearch={(val) =>
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=(name~'${val}' or supplierCode~'${val}')`
                        )
                    }
                    onFilterApply={(filters) => {
                        const filterParts: string[] = [];
                        if (filters.email)
                            filterParts.push(`email~'${filters.email}'`);
                        if (filters.phone)
                            filterParts.push(`phone~'${filters.phone}'`);

                        if (filterParts.length > 0) {
                            const builtFilter = filterParts.join(" and ");
                            setQuery(
                                `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=${builtFilter}`
                            );
                        }
                    }}
                    onReset={() => reloadTable()}
                    onAddClick={() => {
                        setDataInit(null);
                        setOpenModal(true);
                    }}
                />
            }
        >
            <Access permission={ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.GET_PAGINATE}>
                <DataTable<ITechnicianSupplier>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={suppliers}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: suppliers,
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
                                    style={{
                                        fontWeight: 600,
                                        color: "#1677ff",
                                    }}
                                >
                                    {total.toLocaleString()}
                                </span>{" "}
                                nhà cung cấp
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            {/* Modal thêm/sửa */}
            <ModalTechnicianSupplier
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            {/* Modal xem chi tiết */}
            <ViewDetailTechnicianSupplier
                onClose={setOpenViewDetail}
                open={openViewDetail}
                supplierId={selectedSupplierId}
            />
        </PageContainer>
    );
};

export default TechnicianSupplierPage;
