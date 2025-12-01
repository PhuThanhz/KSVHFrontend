import DataTable from "@/components/common/data-table";
import type { ICompany } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag, Popconfirm } from "antd";
import { useState } from "react";
import queryString from "query-string";
import ModalCompany from "@/pages/admin/company/modal.company";
import ViewDetailCompany from "@/pages/admin/company/view.company";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import { useCompaniesQuery, useDeleteCompanyMutation } from "@/hooks/useCompanies";
import DateRangeFilter from "@/components/common/filter-date/DateRangeFilter";

const CompanyPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<ICompany | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );


    const { data, isFetching } = useCompaniesQuery(query);
    const { mutate: deleteCompany } = useDeleteCompanyMutation();

    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.name) q.filter = sfLike("name", params.name);
        if (params.companyCode)
            q.filter = q.filter
                ? `${q.filter} and ${sfLike("companyCode", params.companyCode)}`
                : sfLike("companyCode", params.companyCode);

        if (createdAtFilter) {
            q.filter = q.filter ? `${q.filter} and ${createdAtFilter}` : createdAtFilter;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q, { encode: false });

        // Sort
        let sortBy = "";
        if (sort?.name)
            sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
        else sortBy = "sort=createdAt,desc";

        return `${temp}&${sortBy}`;
    };

    const columns: ProColumns<ICompany>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                (index + 1) +
                ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            hideInSearch: true,
        },
        {
            title: "Mã công ty",
            dataIndex: "companyCode",
            sorter: true,
        },
        {
            title: "Tên công ty",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            hideInSearch: true,
            ellipsis: true,
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
            title: "Hành động",
            hideInSearch: true,
            width: 140,
            align: "center",
            render: (_, entity) => (
                <Space>

                    <Access permission={ALL_PERMISSIONS.COMPANY.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedCompanyId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.COMPANY.UPDATE} hideChildren>
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

                    <Access permission={ALL_PERMISSIONS.COMPANY.DELETE} hideChildren>
                        <Popconfirm
                            title="Xác nhận xóa công ty này?"
                            onConfirm={() => {
                                if (entity.id) deleteCompany(Number(entity.id));
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
            <Access permission={ALL_PERMISSIONS.COMPANY.GET_PAGINATE}>
                <DataTable<ICompany>
                    headerTitle="Danh sách công ty"
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
                                công ty
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
                            <Access permission={ALL_PERMISSIONS.COMPANY.CREATE} hideChildren>
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

            <ModalCompany
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailCompany
                onClose={setOpenViewDetail}
                open={openViewDetail}
                companyId={selectedCompanyId}
            />
        </div>
    );
};

export default CompanyPage;
