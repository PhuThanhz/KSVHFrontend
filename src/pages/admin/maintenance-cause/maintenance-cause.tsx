import DataTable from "@/components/common/data-table";
import type { IMaintenanceCause } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Popconfirm, Tag } from "antd";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { useMaintenanceCausesQuery } from "@/hooks/maintenance/useMaintenanceCause";
import ModalMaintenanceCause from "@/pages/admin/maintenance-cause/modal.maintenance-cause";
import ViewMaintenanceCause from "@/pages/admin/maintenance-cause/view.maintenance-cause";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import dayjs from "dayjs";

const MaintenanceCausePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IMaintenanceCause | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [query, setQuery] = useState<string>(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        })
    );

    const { data, isFetching } = useMaintenanceCausesQuery(query);

    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: "",
        };

        if (params.causeName) q.filter = `causeName~'${params.causeName}'`;

        let sortBy = "sort=createdAt,desc";
        if (sort?.causeName)
            sortBy = sort.causeName === "ascend" ? "sort=causeName,asc" : "sort=causeName,desc";

        let temp = queryString.stringify(q);
        return `${temp}&${sortBy}`;
    };


    const columns: ProColumns<IMaintenanceCause>[] = [
        {
            title: "STT",
            width: 60,
            align: "center",
            render: (_, __, index) =>
                (index + 1) + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            hideInSearch: true,
        },
        {
            title: "Tên nguyên nhân",
            dataIndex: "causeName",
            sorter: true,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            hideInSearch: true,
            render: (_, record) =>
                record.createdAt ? dayjs(record.createdAt).format("DD-MM-YYYY HH:mm") : "-",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            hideInSearch: true,
            render: (_, record) =>
                record.updatedAt ? dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm") : "-",
        },
        {
            title: "Hành động",
            width: 120,
            hideInSearch: true,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.MAINTENANCE_CAUSE.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ color: "#1890ff", fontSize: 18, cursor: "pointer" }}
                            onClick={() => {
                                setSelectedId(entity.id!);
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.MAINTENANCE_CAUSE.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ color: "#faad14", fontSize: 18, cursor: "pointer" }}
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
            <Access permission={ALL_PERMISSIONS.MAINTENANCE_CAUSE.GET_PAGINATE}>
                <DataTable<IMaintenanceCause>
                    headerTitle="Danh sách nguyên nhân hư hỏng"
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
                        showQuickJumper: true,
                        showSizeChanger: true,
                        size: "default",
                        showTotal: (total, range) => (
                            <div style={{ fontSize: 13 }}>
                                Hiển thị <b>{range[0]}–{range[1]}</b> /{" "}
                                <b style={{ color: "#1677ff" }}>{total.toLocaleString()}</b> nguyên nhân
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
                        <Access permission={ALL_PERMISSIONS.MAINTENANCE_CAUSE.CREATE} key="create">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setDataInit(null);
                                    setOpenModal(true);
                                }}
                            >
                                Thêm mới
                            </Button>
                        </Access>,
                    ]}
                />
            </Access>

            <ModalMaintenanceCause
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewMaintenanceCause
                open={openViewDetail}
                onClose={setOpenViewDetail}
                causeId={selectedId}
            />
        </div>
    );
};

export default MaintenanceCausePage;
