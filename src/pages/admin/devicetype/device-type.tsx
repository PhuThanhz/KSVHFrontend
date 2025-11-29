import DataTable from "@/components/common/data-table";
import type { IDeviceType } from "@/types/backend";
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Space, Tag, Select, Popconfirm } from "antd";
import { useEffect, useMemo, useState } from "react";
import queryString from "query-string";
import ModalDeviceType from "@/pages/admin/devicetype/modal.device-type";
import ViewDetailDeviceType from "@/pages/admin/devicetype/view.device-type";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import { useDeviceTypesQuery, useDeleteDeviceTypeMutation } from "@/hooks/useDeviceTypes";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import { callFetchAssetType } from "@/config/api";

/**
 * 🔹 Trang quản lý loại thiết bị
 * Chuẩn hoá: tránh gọi API trùng, giữ query ổn định, refetch chính xác
 */
const DeviceTypePage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<IDeviceType | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedDeviceTypeId, setSelectedDeviceTypeId] = useState<number | null>(null);

    const [assetTypeFilter, setAssetTypeFilter] = useState<string | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
    const [assetTypeOptions, setAssetTypeOptions] = useState<{ label: string; value: string }[]>([]);

    const [query, setQuery] = useState(() =>
        queryString.stringify({
            page: 1,
            size: 10,
            sort: "createdAt,desc",
        }, { encode: false })
    );
    const { data, isFetching } = useDeviceTypesQuery(query);
    const { mutate: deleteDeviceType, isPending: isDeleting } = useDeleteDeviceTypeMutation();

    /** ====================== Lấy danh sách loại tài sản để lọc ====================== */
    useEffect(() => {
        let mounted = true;
        const fetchAssetTypes = async () => {
            try {
                const res = await callFetchAssetType("page=1&size=100");
                if (mounted && res?.data?.result) {
                    const list = res.data.result.map((a: any) => ({
                        label: a.assetTypeName,
                        value: a.assetTypeName,
                    }));
                    setAssetTypeOptions(list);
                }
            } catch (err) {
                console.error("Failed to fetch asset types", err);
            }
        };
        fetchAssetTypes();
        return () => {
            mounted = false;
        };
    }, []); // ✅ chỉ gọi 1 lần khi mount

    /** ====================== Build query filter ====================== */
    const buildQuery = useMemo(
        () =>
            (params: any, sort: any) => {
                const q: any = {
                    page: params.current,
                    size: params.pageSize,
                    filter: "",
                };

                if (params.typeName) q.filter = sfLike("typeName", params.typeName);

                if (params.deviceTypeCode)
                    q.filter = q.filter
                        ? `${q.filter} and ${sfLike("deviceTypeCode", params.deviceTypeCode)}`
                        : sfLike("deviceTypeCode", params.deviceTypeCode);

                if (assetTypeFilter) {
                    q.filter = q.filter
                        ? `${q.filter} and assetType.assetTypeName='${assetTypeFilter}'`
                        : `assetType.assetTypeName='${assetTypeFilter}'`;
                }

                if (createdAtFilter) {
                    q.filter = q.filter ? `${q.filter} and ${createdAtFilter}` : createdAtFilter;
                }

                if (!q.filter) delete q.filter;

                let temp = queryString.stringify(q, { encode: false });

                let sortBy = "";
                if (sort?.typeName)
                    sortBy = sort.typeName === "ascend" ? "sort=typeName,asc" : "sort=typeName,desc";
                else if (sort?.deviceTypeCode)
                    sortBy =
                        sort.deviceTypeCode === "ascend"
                            ? "sort=deviceTypeCode,asc"
                            : "sort=deviceTypeCode,desc";
                else sortBy = "sort=createdAt,desc";

                return `${temp}&${sortBy}`;
            },
        [assetTypeFilter, createdAtFilter]
    );

    /** ====================== Cấu hình cột bảng ====================== */
    const columns: ProColumns<IDeviceType>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) =>
                index + 1 + ((data?.meta?.page || 1) - 1) * (data?.meta?.pageSize || 10),
            hideInSearch: true,
        },
        {
            title: "Mã loại thiết bị",
            dataIndex: "deviceTypeCode",
            sorter: true,
        },
        {
            title: "Tên loại thiết bị",
            dataIndex: "typeName",
            sorter: true,
        },
        {
            title: "Loại tài sản",
            dataIndex: ["assetType", "assetTypeName"],
            sorter: true,
            hideInSearch: true,
            render: (_, record) =>
                record.assetType?.assetTypeName ? (
                    <Tag color="blue">{record.assetType.assetTypeName}</Tag>
                ) : (
                    <Tag color="default">Chưa có</Tag>
                ),
        },
        {
            title: "Hành động",
            hideInSearch: true,
            width: 160,
            align: "center",
            render: (_, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.DEVICE_TYPES.GET_BY_ID} hideChildren>
                        <EyeOutlined
                            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedDeviceTypeId(Number(entity.id));
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.DEVICE_TYPES.UPDATE} hideChildren>
                        <EditOutlined
                            style={{ fontSize: 18, color: "#faad14", cursor: "pointer" }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>

                    <Access permission={ALL_PERMISSIONS.DEVICE_TYPES.DELETE} hideChildren>
                        <Popconfirm
                            title="Xóa loại thiết bị?"
                            description="Bạn có chắc muốn xóa loại thiết bị này không?"
                            onConfirm={() => entity.id && deleteDeviceType(entity.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined style={{ fontSize: 18, color: "red", cursor: "pointer" }} />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    /** ====================== Render ====================== */
    return (
        <div>
            <Access permission={ALL_PERMISSIONS.DEVICE_TYPES.GET_PAGINATE}>
                <DataTable<IDeviceType>
                    headerTitle="Danh sách loại thiết bị"
                    rowKey="id"
                    loading={isFetching || isDeleting}
                    columns={columns}
                    dataSource={data?.result || []}
                    request={async (params, sort): Promise<any> => {
                        const newQuery = buildQuery(params, sort);
                        if (newQuery !== query) setQuery(newQuery);
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        current: data?.meta?.page,
                        pageSize: data?.meta?.pageSize,
                        total: data?.meta?.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <div style={{ fontSize: 13, color: "#595959" }}>
                                <span style={{ fontWeight: 500, color: "#000" }}>
                                    {range[0]}–{range[1]}
                                </span>{" "}
                                trên{" "}
                                <span style={{ fontWeight: 600, color: "#1677ff" }}>
                                    {total.toLocaleString()}
                                </span>{" "}
                                loại thiết bị
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
                                placeholder="Chọn loại tài sản"
                                allowClear
                                style={{ width: 220 }}
                                options={assetTypeOptions}
                                onChange={(value) => setAssetTypeFilter(value || null)}
                            />
                            <DateRangeFilter
                                label="Ngày tạo"
                                fieldName="createdAt"
                                size="middle"
                                width={320}
                                onChange={(filterStr) => setCreatedAtFilter(filterStr)}
                            />
                            <Access permission={ALL_PERMISSIONS.DEVICE_TYPES.CREATE} hideChildren>
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

            <ModalDeviceType
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailDeviceType
                onClose={setOpenViewDetail}
                open={openViewDetail}
                deviceTypeId={selectedDeviceTypeId}
            />
        </div>
    );
};

export default DeviceTypePage;
