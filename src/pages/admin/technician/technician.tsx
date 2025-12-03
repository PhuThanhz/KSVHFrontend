import { useEffect, useRef, useState } from "react";
import { Space, Tag, Badge, Popconfirm, message } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    StopOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import queryString from "query-string";
import dayjs from "dayjs";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

import type { ITechnician } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { useTechniciansQuery } from "@/hooks/user/useTechnicians";
import { useTechnicianSuppliersQuery } from "@/hooks/useTechnicianSuppliers";
import {
    callDeactivateTechnician,
    callRestoreTechnician,
} from "@/config/api";

import ModalTechnician from "@/pages/admin/technician/modal.technician";
import ViewTechnician from "@/pages/admin/technician/view.technician";

const TechnicianPage = () => {
    // ---------- State ---------- //
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ITechnician | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [searchValue, setSearchValue] = useState<string>("");
    const [technicianTypeFilter, setTechnicianTypeFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    const [supplierOptions, setSupplierOptions] = useState<
        { label: string; value: string; color?: string }[]
    >([]);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching, refetch } = useTechniciansQuery(query);
    const { data: supplierData } = useTechnicianSuppliersQuery("page=1&size=100");

    useEffect(() => {
        if (supplierData?.result) {
            const list = supplierData.result.map((s: any) => ({
                label: s.name,
                value: s.name,
                color: "blue",
            }));
            setSupplierOptions(list);
        }
    }, [supplierData]);

    // ---------- Gọi API khi filter thay đổi ---------- //
    useEffect(() => {
        const q: any = {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            sort: "createdAt,desc",
        };

        const filterParts: string[] = [];

        if (searchValue)
            filterParts.push(`(fullName~'${searchValue}' or technicianCode~'${searchValue}')`);

        if (technicianTypeFilter)
            filterParts.push(`technicianType='${technicianTypeFilter}'`);

        if (statusFilter)
            filterParts.push(
                statusFilter === "active" ? "active=true" : "active=false"
            );

        if (createdAtFilter)
            filterParts.push(createdAtFilter);

        if (filterParts.length > 0)
            q.filter = filterParts.join(" and ");

        const built = queryString.stringify(q, { encode: false });
        setQuery(built);
    }, [searchValue, technicianTypeFilter, statusFilter, createdAtFilter]);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const technicians = data?.result ?? [];

    // ---------- Build Query cho sort/pagination ---------- //
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            filter: "",
        };

        const filterParts: string[] = [];

        if (searchValue)
            filterParts.push(`(fullName~'${searchValue}' or technicianCode~'${searchValue}')`);
        if (technicianTypeFilter)
            filterParts.push(`technicianType='${technicianTypeFilter}'`);
        if (statusFilter)
            filterParts.push(
                statusFilter === "active" ? "active=true" : "active=false"
            );
        if (createdAtFilter)
            filterParts.push(createdAtFilter);

        if (filterParts.length > 0)
            q.filter = filterParts.join(" and ");

        let temp = queryString.stringify(q, { encode: false });

        let sortBy = "sort=createdAt,desc";
        if (sort?.fullName)
            sortBy = sort.fullName === "ascend" ? "sort=fullName,asc" : "sort=fullName,desc";
        else if (sort?.technicianCode)
            sortBy = sort.technicianCode === "ascend" ? "sort=technicianCode,asc" : "sort=technicianCode,desc";

        return `${temp}&${sortBy}`;
    };

    // ---------- Reset Table ---------- //
    const reloadTable = () => {
        refetch();
    };

    // ---------- Soft Delete / Restore ---------- //
    const handleDeactivate = async (id: string) => {
        try {
            await callDeactivateTechnician(id);
            message.success("Đã vô hiệu hóa kỹ thuật viên");
            reloadTable();
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Lỗi khi vô hiệu hóa");
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await callRestoreTechnician(id);
            message.success("Đã phục hồi kỹ thuật viên");
            reloadTable();
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Lỗi khi phục hồi");
        }
    };

    // ---------- Columns ---------- //
    const columns: ProColumns<ITechnician>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index + 1 + ((meta.page || 1) - 1) * (meta.pageSize || 10),
            hideInSearch: true,
        },
        { title: "Mã KTV", dataIndex: "technicianCode", sorter: true },
        { title: "Họ và tên", dataIndex: "fullName", sorter: true },
        {
            title: "Loại KTV",
            dataIndex: "technicianType",
            render: (_, record) => (
                <Tag color={record.technicianType === "INTERNAL" ? "green" : "blue"}>
                    {record.technicianType === "INTERNAL" ? "Nội bộ" : "Thuê ngoài"}
                </Tag>
            ),
            hideInSearch: true,
        },
        {
            title: "Trạng thái hoạt động",
            dataIndex: "active",
            align: "center",
            render: (active) =>
                active ? (
                    <Badge status="success" text="Đang hoạt động" />
                ) : (
                    <Badge status="error" text="Ngừng hoạt động" />
                ),
            hideInSearch: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt
                    ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm")
                    : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 180,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.TECHNICIAN.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(String(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.TECHNICIAN.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#fa8c16", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    {entity.active ? (
                        <Access permission={ALL_PERMISSIONS.TECHNICIAN.DELETE} hideChildren>
                            <Popconfirm
                                title="Vô hiệu hóa kỹ thuật viên này?"
                                okText="Xác nhận"
                                cancelText="Hủy"
                                onConfirm={() => handleDeactivate(String(entity.id))}
                            >
                                <StopOutlined
                                    style={{
                                        fontSize: 18,
                                        color: "#ff4d4f",
                                        cursor: "pointer",
                                    }}
                                />
                            </Popconfirm>
                        </Access>
                    ) : (
                        <Access permission={ALL_PERMISSIONS.TECHNICIAN.RESTORE} hideChildren>
                            <Popconfirm
                                title="Phục hồi kỹ thuật viên này?"
                                okText="Xác nhận"
                                cancelText="Hủy"
                                onConfirm={() => handleRestore(String(entity.id))}
                            >
                                <ReloadOutlined
                                    style={{
                                        fontSize: 18,
                                        color: "#52c41a",
                                        cursor: "pointer",
                                    }}
                                />
                            </Popconfirm>
                        </Access>
                    )}
                </Space>
            ),
        },
    ];

    // ---------- Render ---------- //
    return (
        <PageContainer
            title="Quản lý kỹ thuật viên"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo tên hoặc mã KTV..."
                        addLabel="Thêm kỹ thuật viên"
                        showFilterButton={false}
                        onSearch={(val) => setSearchValue(val)}
                        onReset={reloadTable}
                        onAddClick={() => {
                            setDataInit(null);
                            setOpenModal(true);
                        }}
                    />

                    <div className="flex flex-wrap gap-3 items-center">
                        <AdvancedFilterSelect
                            fields={[
                                {
                                    key: "technicianType",
                                    label: "Loại KTV",
                                    options: [
                                        { label: "Nội bộ", value: "INTERNAL", color: "green" },
                                        { label: "Thuê ngoài", value: "OUTSOURCE", color: "blue" },
                                    ],
                                },
                                {
                                    key: "status",
                                    label: "Trạng thái",
                                    options: [
                                        { label: "Đang hoạt động", value: "active", color: "green" },
                                        { label: "Ngừng hoạt động", value: "inactive", color: "red" },
                                    ],
                                },
                            ]}
                            onChange={(filters) => {
                                setTechnicianTypeFilter(filters.technicianType || null);
                                setStatusFilter(filters.status || null);
                            }}
                        />

                        <DateRangeFilter
                            label="Ngày tạo"
                            fieldName="createdAt"
                            onChange={(filter) => setCreatedAtFilter(filter)}
                        />
                    </div>
                </div>
            }
        >
            <Access permission={ALL_PERMISSIONS.TECHNICIAN.GET_PAGINATE}>
                <DataTable<ITechnician>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={technicians}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: technicians,
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
                                <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                    {total.toLocaleString()}
                                </span>{" "}
                                kỹ thuật viên
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            <ModalTechnician
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewTechnician
                onClose={setOpenViewDetail}
                open={openViewDetail}
                technicianId={selectedId}
            />
        </PageContainer>
    );
};

export default TechnicianPage;
