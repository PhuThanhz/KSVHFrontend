import DataTable from "@/components/common/data-table";
import type { IDepartment } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Popconfirm, Tag } from "antd";
import { useState } from "react";
import queryString from "query-string";
import ModalDepartment from "./modal.department";
import ViewDetailDepartment from "./view.department";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import {
    useDepartmentsQuery,
    useDeleteDepartmentMutation,
} from "@/hooks/useDepartments";
import DateRangeFilter from "@/components/common/DateRangeFilter";

const DepartmentPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IDepartment | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );

    const { data, isFetching } = useDepartmentsQuery(query);
    const { mutate: deleteDepartment } = useDeleteDepartmentMutation();

    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.departmentCode)
            q.filter = sfLike("departmentCode", params.departmentCode);
        if (params.name)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("name", params.name)}`
                : sfLike("name", params.name);
        if (params.company)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("company.name", params.company)}`
                : sfLike("company.name", params.company);

        if (createdAtFilter) {
            q.filter = q.filter ? `${q.filter} and ${createdAtFilter}` : createdAtFilter;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q, { encode: false });

        // sort
        let sortBy = "";
        if (sort?.departmentCode)
            sortBy =
                sort.departmentCode === "ascend"
                    ? "sort=departmentCode,asc"
                    : "sort=departmentCode,desc";
        else if (sort?.name)
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    const columns: ProColumns<IDepartment>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            hideInSearch: true,
        },
        {
            title: "Mã phòng ban",
            dataIndex: "departmentCode",
            sorter: true,
        },
        {
            title: "Tên phòng ban",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Công ty",
            dataIndex: ["company", "name"],
            sorter: false,
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 130,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.DEPARTMENT.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedDeptId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.DEPARTMENT.UPDATE} hideChildren>
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

                    <Access permission={ALL_PERMISSIONS.DEPARTMENT.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa phòng ban này?"
                            onConfirm={() => {
                                if (entity.id) deleteDepartment(Number(entity.id));
                            }}
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
            <Access permission={ALL_PERMISSIONS.DEPARTMENT.GET_PAGINATE}>
                <DataTable<IDepartment>
                    headerTitle="Danh sách phòng ban"
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
                                phòng ban
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
                        <Space key="toolbar" size={12} align="center" wrap>
                            <DateRangeFilter
                                label="Ngày tạo"
                                fieldName="createdAt"
                                size="middle"
                                width={320}
                                onChange={(filterStr) => setCreatedAtFilter(filterStr)}
                            />
                            <Access permission={ALL_PERMISSIONS.DEPARTMENT.CREATE} hideChildren>
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

            <ModalDepartment
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailDepartment
                onClose={setOpenViewDetail}
                open={openViewDetail}
                departmentId={selectedDeptId}
            />
        </div>
    );
};

export default DepartmentPage;
