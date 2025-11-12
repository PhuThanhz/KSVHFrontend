import DataTable from "@/components/admin/data-table";
import type { ITechnician } from "@/types/backend";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag, Select, Badge } from "antd";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";
import {
    useTechniciansQuery,
} from "@/hooks/user/useTechnicians";
import { useTechnicianSuppliersQuery } from "@/hooks/useTechnicianSuppliers";
import { useSkillsQuery } from "@/hooks/useSkills";
import ModalTechnician from "@/components/admin/technician/modal.technician";
import ViewTechnician from "@/components/admin/technician/view.technician";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import DateRangeFilter from "@/components/common/DateRangeFilter";

const TechnicianPage = () => {
    // ---------------- State ---------------- //
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ITechnician | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [technicianTypeFilter, setTechnicianTypeFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [query, setQuery] = useState<string>(() =>
        queryString.stringify({ page: 1, size: 10, sort: "createdAt,desc" }, { encode: false })
    );

    const { data, isFetching } = useTechniciansQuery(query);

    const { data: suppliersData } = useTechnicianSuppliersQuery("page=1&size=100");
    const { data: skillsData } = useSkillsQuery("page=1&size=100");

    // ---------- Filter Builder ---------- //
    const buildQuery = (params: any, sort: any) => {
        const q: any = { page: params.current, size: params.pageSize, filter: "" };

        if (params.fullName)
            q.filter = sfLike("fullName", params.fullName);
        if (params.technicianCode)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("technicianCode", params.technicianCode)}`
                : sfLike("technicianCode", params.technicianCode);

        if (technicianTypeFilter)
            q.filter = q.filter
                ? `${q.filter} and technicianType='${technicianTypeFilter}'`
                : `technicianType='${technicianTypeFilter}'`;

        if (statusFilter !== null)
            q.filter = q.filter
                ? `${q.filter} and activeStatus=${statusFilter === "active"}`
                : `activeStatus=${statusFilter === "active"}`;

        if (createdAtFilter)
            q.filter = q.filter
                ? `${q.filter} and ${createdAtFilter}`
                : createdAtFilter;

        if (!q.filter) delete q.filter;

        // Sắp xếp
        let sortBy = "sort=createdAt,desc";
        if (sort?.fullName)
            sortBy = sort.fullName === "ascend" ? "sort=fullName,asc" : "sort=fullName,desc";
        else if (sort?.technicianCode)
            sortBy = sort.technicianCode === "ascend" ? "sort=technicianCode,asc" : "sort=technicianCode,desc";

        return `${queryString.stringify(q)}&${sortBy}`;
    };

    // ---------- Columns ---------- //
    const columns: ProColumns<ITechnician>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
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
            dataIndex: "activeStatus",
            align: "center",
            render: (value) =>
                value ? (
                    <Badge status="success" text="Đang hoạt động" />
                ) : (
                    <Badge status="error" text="Ngừng hoạt động" />
                ),
            hideInSearch: true,
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 160,
            align: "center",
            render: (_, entity) => (
                <Space size="middle">
                    <Access permission={ALL_PERMISSIONS.TECHNICIAN.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(String(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.TECHNICIAN.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#faad14", cursor: "pointer" }}
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

    // ---------- Render ---------- //
    return (
        <div>
            <Access permission={ALL_PERMISSIONS.TECHNICIAN.GET_PAGINATE}>
                <DataTable<ITechnician>
                    headerTitle="Danh sách kỹ thuật viên"
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
                        total: data?.meta?.total,
                        showQuickJumper: true,
                        showSizeChanger: true,
                    }}
                    toolBarRender={() => [
                        <Space key="toolbar" size={12} align="center" wrap>
                            <Select
                                placeholder="Loại KTV"
                                allowClear
                                style={{ width: 160 }}
                                options={[
                                    { label: "Nội bộ", value: "INTERNAL" },
                                    { label: "Thuê ngoài", value: "OUTSOURCE" },
                                ]}
                                onChange={(v) => setTechnicianTypeFilter(v || null)}
                            />

                            <Select
                                placeholder="Trạng thái hoạt động"
                                allowClear
                                style={{ width: 180 }}
                                options={[
                                    { label: "Đang hoạt động", value: "active" },
                                    { label: "Ngừng hoạt động", value: "inactive" },
                                ]}
                                onChange={(v) => setStatusFilter(v || null)}
                            />

                            <DateRangeFilter
                                label="Ngày tạo"
                                fieldName="createdAt"
                                size="middle"
                                width={320}
                                onChange={(filterStr) => setCreatedAtFilter(filterStr)}
                            />

                            <Access permission={ALL_PERMISSIONS.TECHNICIAN.CREATE} hideChildren>
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

            {/* ---------- Modal + View Drawer ---------- */}
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
        </div>
    );
};

export default TechnicianPage;
