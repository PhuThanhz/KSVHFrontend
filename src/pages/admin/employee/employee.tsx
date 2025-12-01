import { useEffect, useRef, useState } from "react";
import { Button, Space, Tag, Badge } from "antd";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import queryString from "query-string";
import dayjs from "dayjs";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";
import AdvancedFilterSelect from "@/components/common/filter-date/AdvancedFilterSelect";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

import type { IEmployee } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { PAGINATION_CONFIG } from "@/config/pagination";
import { sfLike } from "spring-filter-query-builder";

import { useEmployeesQuery } from "@/hooks/user/useEmployees";
import { useCompaniesQuery } from "@/hooks/useCompanies";
import { useDepartmentsQuery } from "@/hooks/useDepartments";
import { usePositionsQuery } from "@/hooks/usePositions";

import ModalEmployee from "@/pages/admin/employee/modal.employee";
import ViewDetailEmployee from "@/pages/admin/employee/view.employee";

const EmployeePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IEmployee | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [companyFilter, setCompanyFilter] = useState<string | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [positionFilter, setPositionFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");

    const [companyOptions, setCompanyOptions] = useState<{ label: string; value: string }[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<{ label: string; value: string }[]>([]);
    const [positionOptions, setPositionOptions] = useState<{ label: string; value: string }[]>([]);

    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
    );

    const tableRef = useRef<ActionType>(null);

    const { data, isFetching } = useEmployeesQuery(query);
    const { data: companiesData } = useCompaniesQuery("page=1&size=100");
    const { data: departmentsData } = useDepartmentsQuery("page=1&size=100");
    const { data: positionsData } = usePositionsQuery("page=1&size=100");

    useEffect(() => {
        if (companiesData?.result)
            setCompanyOptions(companiesData.result.map((c) => ({ label: c.name, value: c.name })));
        if (departmentsData?.result)
            setDepartmentOptions(departmentsData.result.map((d) => ({ label: d.name, value: d.name })));
        if (positionsData?.result)
            setPositionOptions(positionsData.result.map((p) => ({ label: p.name, value: p.name })));
    }, [companiesData, departmentsData, positionsData]);

    // ==================================================================
    // TỰ ĐỘNG BUILD QUERY KHI FILTER THAY ĐỔI
    // ==================================================================
    useEffect(() => {
        const q: any = {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            sort: "createdAt,desc",
        };

        const filters: string[] = [];

        if (searchValue)
            filters.push(`(fullName~'${searchValue}' or employeeCode~'${searchValue}')`);
        if (companyFilter) filters.push(`company.name='${companyFilter}'`);
        if (departmentFilter) filters.push(`department.name='${departmentFilter}'`);
        if (positionFilter) filters.push(`position.name='${positionFilter}'`);
        if (statusFilter)
            filters.push(`active=${statusFilter === "active"}`);
        if (createdAtFilter) filters.push(createdAtFilter);

        if (filters.length > 0) q.filter = filters.join(" and ");

        setQuery(queryString.stringify(q, { encode: false }));
    }, [
        searchValue,
        companyFilter,
        departmentFilter,
        positionFilter,
        statusFilter,
        createdAtFilter,
    ]);

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const employees = data?.result ?? [];

    /** Build query sort/pagination cho DataTable */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };

        const parts: string[] = [];

        if (searchValue)
            parts.push(`(fullName~'${searchValue}' or employeeCode~'${searchValue}')`);
        if (companyFilter) parts.push(`company.name='${companyFilter}'`);
        if (departmentFilter) parts.push(`department.name='${departmentFilter}'`);
        if (positionFilter) parts.push(`position.name='${positionFilter}'`);
        if (statusFilter)
            parts.push(`active=${statusFilter === "active"}`);
        if (createdAtFilter) parts.push(createdAtFilter);

        if (parts.length > 0) q.filter = parts.join(" and ");

        let temp = queryString.stringify(q, { encode: false });

        let sortBy = "";
        if (sort?.fullName)
            sortBy = sort.fullName === "ascend" ? "sort=fullName,asc" : "sort=fullName,desc";
        else if (sort?.employeeCode)
            sortBy = sort.employeeCode === "ascend"
                ? "sort=employeeCode,asc"
                : "sort=employeeCode,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    const reloadTable = () => {
        setSearchValue("");
        setCompanyFilter(null);
        setDepartmentFilter(null);
        setPositionFilter(null);
        setStatusFilter(null);
        setCreatedAtFilter(null);
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
        );
    };

    // ==================================================================
    // COLUMNS
    // ==================================================================
    const columns: ProColumns<IEmployee>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index + 1 + ((meta.page || 1) - 1) * (meta.pageSize || 10),
            hideInSearch: true,
        },
        { title: "Mã NV", dataIndex: "employeeCode", sorter: true },
        { title: "Họ và tên", dataIndex: "fullName", sorter: true },
        {
            title: "Công ty",
            dataIndex: ["company", "name"],
            render: (_, record) => <Tag color="blue">{record.company?.name}</Tag>,
            hideInSearch: true,
        },
        {
            title: "Phòng ban",
            dataIndex: ["department", "name"],
            render: (_, record) => <Tag color="purple">{record.department?.name}</Tag>,
            hideInSearch: true,
        },
        {
            title: "Chức vụ",
            dataIndex: ["position", "name"],
            render: (_, record) => <Tag color="green">{record.position?.name}</Tag>,
            hideInSearch: true,
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            align: "center",
            width: 160,
            hideInSearch: true,
            render: (_, record) =>
                record.active ? (
                    <Badge status="success" text="Đang hoạt động" />
                ) : (
                    <Badge status="error" text="Ngừng hoạt động" />
                ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (text: any) =>
                text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "-",
        },
        {
            title: "Hành động",
            hideInSearch: true,
            align: "center",
            width: 140,
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.EMPLOYEE.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1677ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(String(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.EMPLOYEE.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#fa8c16", cursor: "pointer" }}
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

    // ==================================================================
    // RENDER
    // ==================================================================
    return (
        <PageContainer
            title="Quản lý nhân viên"
            filter={
                <div className="flex flex-col gap-3">
                    <SearchFilter
                        searchPlaceholder="Tìm theo mã hoặc tên nhân viên..."
                        addLabel="Thêm nhân viên"
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
                                    key: "company",
                                    label: "Công ty",
                                    options: companyOptions,
                                },
                                {
                                    key: "department",
                                    label: "Phòng ban",
                                    options: departmentOptions,
                                },
                                {
                                    key: "position",
                                    label: "Chức vụ",
                                    options: positionOptions,
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
                                setCompanyFilter(filters.company || null);
                                setDepartmentFilter(filters.department || null);
                                setPositionFilter(filters.position || null);
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
            <Access permission={ALL_PERMISSIONS.EMPLOYEE.GET_PAGINATE}>
                <DataTable<IEmployee>
                    actionRef={tableRef}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={employees}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: employees,
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
                                    style={{ fontWeight: 600, color: "#1677ff" }}
                                >
                                    {total.toLocaleString()}
                                </span>{" "}
                                nhân viên
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            <ModalEmployee
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailEmployee
                onClose={setOpenViewDetail}
                open={openViewDetail}
                employeeId={selectedId}
            />
        </PageContainer>
    );
};

export default EmployeePage;
