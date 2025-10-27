import DataTable from "@/components/admin/data-table";
import type { ITechnician } from "@/types/backend";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag, Select, Popconfirm, Badge } from "antd";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";
import {
    useTechniciansQuery,
} from "@/hooks/useTechnicians";
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
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [supplierFilter, setSupplierFilter] = useState<string | null>(null);
    const [skillFilter, setSkillFilter] = useState<string | null>(null);
    const [technicianTypeFilter, setTechnicianTypeFilter] = useState<string | null>(null);

    const [supplierOptions, setSupplierOptions] = useState<{ label: string; value: string }[]>([]);
    const [skillOptions, setSkillOptions] = useState<{ label: string; value: string }[]>([]);

    const [query, setQuery] = useState<string>(() =>
        queryString.stringify({ page: 1, size: 10, sort: "createdAt,desc" }, { encode: false })
    );

    const { data, isFetching } = useTechniciansQuery(query);

    const { data: suppliersData } = useTechnicianSuppliersQuery("page=1&size=100");
    const { data: skillsData } = useSkillsQuery("page=1&size=100");

    useEffect(() => {
        if (suppliersData?.result) {
            setSupplierOptions(
                suppliersData.result.map((s) => ({
                    label: s.name,
                    value: s.name,
                }))
            );
        }
    }, [suppliersData]);

    useEffect(() => {
        if (skillsData?.result) {
            setSkillOptions(
                skillsData.result.map((s) => ({
                    label: s.techniqueName,
                    value: s.techniqueName,
                }))
            );
        }
    }, [skillsData]);

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

        if (createdAtFilter)
            q.filter = q.filter
                ? `${q.filter} and ${createdAtFilter}`
                : createdAtFilter;

        if (!q.filter) delete q.filter;

        let sortBy = "sort=createdAt,desc";
        if (sort?.fullName)
            sortBy = sort.fullName === "ascend" ? "sort=fullName,asc" : "sort=fullName,desc";
        else if (sort?.technicianCode)
            sortBy = sort.technicianCode === "ascend" ? "sort=technicianCode,asc" : "sort=technicianCode,desc";

        return `${queryString.stringify(q)}&${sortBy}`;
    };

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
            title: "Trạng thái",
            dataIndex: "activeStatus",
            render: (v) =>
                v ? (
                    <Badge status="success" text="Hoạt động" />
                ) : (
                    <Badge status="error" text="Ngừng" />
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
                                setSelectedId(Number(entity.id));
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
                                kỹ thuật viên
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
