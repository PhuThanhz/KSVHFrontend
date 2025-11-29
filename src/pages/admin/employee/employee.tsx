import DataTable from "@/components/common/data-table";
import type { IEmployee } from "@/types/backend";
import {
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import {
    Button,
    Space,
    Tag,
    Select,
    Badge,
} from "antd";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { useEmployeesQuery } from "@/hooks/user/useEmployees";
import ModalEmployee from "@/pages/admin/employee/modal.employee";
import ViewDetailEmployee from "@/pages/admin/employee/view.employee";
import { useCompaniesQuery } from "@/hooks/useCompanies";
import { useDepartmentsQuery } from "@/hooks/useDepartments";
import { usePositionsQuery } from "@/hooks/usePositions";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import { sfLike } from "spring-filter-query-builder";
import dayjs from "dayjs";

const EmployeePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IEmployee | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [companyFilter, setCompanyFilter] = useState<string | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [positionFilter, setPositionFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const [companyOptions, setCompanyOptions] = useState<{ label: string; value: string }[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<{ label: string; value: string }[]>([]);
    const [positionOptions, setPositionOptions] = useState<{ label: string; value: string }[]>([]);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );

    const { data, isFetching } = useEmployeesQuery(query);
    const { data: companiesData } = useCompaniesQuery("page=1&size=100");
    const { data: departmentsData } = useDepartmentsQuery("page=1&size=100");
    const { data: positionsData } = usePositionsQuery("page=1&size=100");

    useEffect(() => {
        if (companiesData?.result) {
            setCompanyOptions(companiesData.result.map((c) => ({ label: c.name, value: c.name })));
        }
    }, [companiesData]);

    useEffect(() => {
        if (departmentsData?.result) {
            setDepartmentOptions(departmentsData.result.map((d) => ({ label: d.name, value: d.name })));
        }
    }, [departmentsData]);

    useEffect(() => {
        if (positionsData?.result) {
            setPositionOptions(positionsData.result.map((p) => ({ label: p.name, value: p.name })));
        }
    }, [positionsData]);

    const buildQuery = (params: any, sort: any) => {
        const q: any = { page: params.current, size: params.pageSize, filter: "" };

        if (params.fullName)
            q.filter = sfLike("fullName", params.fullName);
        if (params.employeeCode)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("employeeCode", params.employeeCode)}`
                : sfLike("employeeCode", params.employeeCode);

        if (statusFilter !== null)
            q.filter = q.filter
                ? `${q.filter} and active=${statusFilter === "active"}`
                : `active=${statusFilter === "active"}`;

        // Filter công ty, phòng ban, chức vụ
        if (companyFilter)
            q.filter = q.filter
                ? `${q.filter} and company.name='${companyFilter}'`
                : `company.name='${companyFilter}'`;
        if (departmentFilter)
            q.filter = q.filter
                ? `${q.filter} and department.name='${departmentFilter}'`
                : `department.name='${departmentFilter}'`;
        if (positionFilter)
            q.filter = q.filter
                ? `${q.filter} and position.name='${positionFilter}'`
                : `position.name='${positionFilter}'`;

        // Filter ngày tạo
        if (createdAtFilter)
            q.filter = q.filter ? `${q.filter} and ${createdAtFilter}` : createdAtFilter;

        if (!q.filter) delete q.filter;

        // Sorting
        let sortBy = "sort=createdAt,desc";
        if (sort?.fullName)
            sortBy = sort.fullName === "ascend" ? "sort=fullName,asc" : "sort=fullName,desc";
        else if (sort?.employeeCode)
            sortBy = sort.employeeCode === "ascend" ? "sort=employeeCode,asc" : "sort=employeeCode,desc";

        return `${queryString.stringify(q)}&${sortBy}`;
    };

    const columns: ProColumns<IEmployee>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
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
            width: 140,
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
            render: (text: any) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "-"),
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 160,
            align: "center",
            render: (_, entity) => (
                <Space size="middle">
                    <Access permission={ALL_PERMISSIONS.EMPLOYEE.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(String(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.EMPLOYEE.UPDATE} hideChildren>
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
            <Access permission={ALL_PERMISSIONS.EMPLOYEE.GET_PAGINATE}>
                <DataTable<IEmployee>
                    headerTitle="Danh sách nhân viên"
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
                                placeholder="Công ty"
                                allowClear
                                style={{ width: 160 }}
                                options={companyOptions}
                                onChange={(value) => setCompanyFilter(value || null)}
                            />
                            <Select
                                placeholder="Phòng ban"
                                allowClear
                                style={{ width: 160 }}
                                options={departmentOptions}
                                onChange={(value) => setDepartmentFilter(value || null)}
                            />
                            <Select
                                placeholder="Chức vụ"
                                allowClear
                                style={{ width: 160 }}
                                options={positionOptions}
                                onChange={(value) => setPositionFilter(value || null)}
                            />
                            <Select
                                placeholder="Trạng thái"
                                allowClear
                                style={{ width: 160 }}
                                options={[
                                    { label: "Đang hoạt động", value: "active" },
                                    { label: "Ngừng hoạt động", value: "inactive" },
                                ]}
                                onChange={(value) => setStatusFilter(value || null)}
                            />
                            <DateRangeFilter
                                label="Ngày tạo"
                                fieldName="createdAt"
                                onChange={(filterStr) => setCreatedAtFilter(filterStr)}
                            />
                            <Access permission={ALL_PERMISSIONS.EMPLOYEE.CREATE} hideChildren>
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
        </div>
    );
};

export default EmployeePage;
