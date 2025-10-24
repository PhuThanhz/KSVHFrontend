import DataTable from "@/components/admin/data-table";
import type { IEmployee } from "@/types/backend";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag, Select } from "antd";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { useEmployeesQuery } from "@/hooks/useEmployees";
import ModalEmployee from "@/components/admin/employee/modal.employee";
import ViewDetailEmployee from "@/components/admin/employee/view.employee";
import { callFetchCompany, callFetchDepartment, callFetchPosition } from "@/config/api";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import { sfLike } from "spring-filter-query-builder";
import dayjs from "dayjs";

const EmployeePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IEmployee | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [companyFilter, setCompanyFilter] = useState<string | null>(null);
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [positionFilter, setPositionFilter] = useState<string | null>(null);

    const [companyOptions, setCompanyOptions] = useState<{ label: string; value: string }[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<{ label: string; value: string }[]>([]);
    const [positionOptions, setPositionOptions] = useState<{ label: string; value: string }[]>([]);

    const [query, setQuery] = useState<string>(() =>
        queryString.stringify({ page: 1, size: 10, sort: "createdAt,desc" })
    );

    const { data, isFetching } = useEmployeesQuery(query);

    // Fetch danh sách Company, Department, Position để filter
    useEffect(() => {
        (async () => {
            const [com, dep, pos] = await Promise.all([
                callFetchCompany("page=1&size=100"),
                callFetchDepartment("page=1&size=100"),
                callFetchPosition("page=1&size=100"),
            ]);
            setCompanyOptions(
                com?.data?.result?.map((c: any) => ({ label: c.name, value: c.name })) || []
            );
            setDepartmentOptions(
                dep?.data?.result?.map((d: any) => ({ label: d.name, value: d.name })) || []
            );
            setPositionOptions(
                pos?.data?.result?.map((p: any) => ({ label: p.name, value: p.name })) || []
            );
        })();
    }, []);

    // build query string
    const buildQuery = (params: any, sort: any) => {
        const q: any = { page: params.current, size: params.pageSize, filter: "" };

        if (params.fullName)
            q.filter = sfLike("fullName", params.fullName);
        if (params.employeeCode)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("employeeCode", params.employeeCode)}`
                : sfLike("employeeCode", params.employeeCode);

        // Filter by Company, Department, Position
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

        // Filter by CreatedAt
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

    // columns
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
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (text: any) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "-"),
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 120,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.EMPLOYEE.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.EMPLOYEE.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#ffa500", cursor: "pointer" }}
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
                        current: data?.meta?.page,
                        pageSize: data?.meta?.pageSize,
                        total: data?.meta?.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    toolBarRender={() => [
                        <Space key="toolbar" size={12} align="center" wrap>
                            <Select
                                placeholder="Công ty"
                                allowClear
                                style={{ width: 180 }}
                                options={companyOptions}
                                onChange={(value) => setCompanyFilter(value || null)}
                            />
                            <Select
                                placeholder="Phòng ban"
                                allowClear
                                style={{ width: 180 }}
                                options={departmentOptions}
                                onChange={(value) => setDepartmentFilter(value || null)}
                            />
                            <Select
                                placeholder="Chức vụ"
                                allowClear
                                style={{ width: 180 }}
                                options={positionOptions}
                                onChange={(value) => setPositionFilter(value || null)}
                            />
                            <DateRangeFilter
                                label="Ngày tạo"
                                fieldName="createdAt"
                                size="middle"
                                width={320}
                                onChange={(filterStr) => setCreatedAtFilter(filterStr)}
                            />
                            <Access permission={ALL_PERMISSIONS.EMPLOYEE.CREATE}>
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
