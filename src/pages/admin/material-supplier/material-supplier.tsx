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

import type { IMaterialSupplier } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import {
    useMaterialSuppliersQuery,
    useDeleteMaterialSupplierMutation,
} from "@/hooks/useMaterialSuppliers";
import ModalMaterialSupplier from "@/pages/admin/material-supplier/modal.materialSupplier";
import ViewMaterialSupplier from "@/pages/admin/material-supplier/view.materialSupplier";
import { PAGINATION_CONFIG } from "@/config/pagination";

const MaterialSupplierPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IMaterialSupplier | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useMaterialSuppliersQuery(query);
    const deleteMutation = useDeleteMaterialSupplierMutation();

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const suppliers = data?.result ?? [];

    const handleDelete = async (id?: number | string) => {
        if (!id) return;
        await deleteMutation.mutateAsync(id, {
            onSuccess: () => reloadTable(),
        });
    };

    const reloadTable = () => {
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`
        );
    };

    /** Build query cho sort/pagination/filter */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        const filters: string[] = [];

        if (params.supplierCode) filters.push(`supplierCode~'${params.supplierCode}'`);
        if (params.supplierName) filters.push(`supplierName~'${params.supplierName}'`);
        if (params.representative) filters.push(`representative~'${params.representative}'`);

        if (params.phone) filters.push(`phone~'${params.phone}'`);
        if (params.email) filters.push(`email~'${params.email}'`);
        if (params.address) filters.push(`address~'${params.address}'`);

        if (filters.length > 0) q.filter = filters.join(" and ");

        let temp = queryString.stringify(q, { encode: false });

        if (sort?.supplierName) {
            const dir = sort.supplierName === "ascend" ? "asc" : "desc";
            temp += `&sort=supplierName,${dir}`;
        } else {
            temp += `&sort=${PAGINATION_CONFIG.DEFAULT_SORT}`;
        }

        return temp;
    };

    /** Cấu hình cột bảng */
    const columns: ProColumns<IMaterialSupplier>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index +
                1 +
                ((meta.page || 1) - 1) *
                (meta.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE),
            hideInSearch: true,
        },
        {
            title: "Mã NCC",
            dataIndex: "supplierCode",
            sorter: true,
        },
        {
            title: "Tên NCC",
            dataIndex: "supplierName",
            sorter: true,
        },
        {
            title: "Người đại diện",
            dataIndex: "representative",
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
            title: "Địa chỉ",
            dataIndex: "address",
            hideInSearch: true,
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 140,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.MATERIAL_SUPPLIER?.GET_BY_ID}
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
                        permission={ALL_PERMISSIONS.MATERIAL_SUPPLIER?.UPDATE}
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
                        permission={ALL_PERMISSIONS.MATERIAL_SUPPLIER?.DELETE}
                        hideChildren
                    >
                        <Popconfirm
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
            title="Quản lý nhà cung cấp vật tư"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm theo Mã NCC, Tên NCC hoặc Người đại diện..."
                    addLabel="Thêm nhà cung cấp"
                    filterFields={[
                        {
                            name: "phone",
                            label: "Số điện thoại",
                            placeholder: "Nhập số điện thoại...",
                        },
                        {
                            name: "email",
                            label: "Email",
                            placeholder: "Nhập email...",
                        },
                        {
                            name: "address",
                            label: "Địa chỉ",
                            placeholder: "Nhập địa chỉ...",
                        },
                    ]}
                    onSearch={(val) => {
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=(supplierCode~'${val}' or supplierName~'${val}' or representative~'${val}')`
                        );
                    }}
                    onFilterApply={(filters) => {
                        const parts: string[] = [];
                        if (filters.phone)
                            parts.push(`phone~'${filters.phone}'`);
                        if (filters.email)
                            parts.push(`email~'${filters.email}'`);
                        if (filters.address)
                            parts.push(`address~'${filters.address}'`);

                        const filterQuery =
                            parts.length > 0 ? parts.join(" and ") : "";
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}${filterQuery ? `&filter=${filterQuery}` : ""
                            }`
                        );
                    }}
                    onReset={() => reloadTable()}
                    onAddClick={() => {
                        setDataInit(null);
                        setOpenModal(true);
                    }}
                />
            }
        >
            <Access permission={ALL_PERMISSIONS.MATERIAL_SUPPLIER?.GET_PAGINATE}>
                <DataTable<IMaterialSupplier>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={suppliers}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: suppliers || [],
                            success: true,
                            total: meta.total || 0,
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
        </PageContainer>
    );
};

export default MaterialSupplierPage;
