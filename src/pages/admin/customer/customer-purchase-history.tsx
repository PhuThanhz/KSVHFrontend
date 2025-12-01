import { useRef, useState, useMemo } from "react";
import { Space, Tag, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import queryString from "query-string";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter-date/SearchFilter";

import type { ICustomerPurchaseHistoryAdmin } from "@/types/backend";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useCustomerPurchaseHistoriesQuery } from "@/hooks/useCustomerPurchaseHistory";
import ModalPurchaseDetail from "@/pages/admin/customer/modal.customer-purchase-detail";
import { PAGINATION_CONFIG } from "@/config/pagination";

const { Text } = Typography;

const CustomerPurchaseHistoryPage = () => {
    const [query, setQuery] = useState<string>(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=purchaseDate,desc`
    );

    const tableRef = useRef<ActionType>(null);
    const { data, isFetching } = useCustomerPurchaseHistoriesQuery(query);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedRecord, setSelectedRecord] =
        useState<ICustomerPurchaseHistoryAdmin | null>(null);

    /** Gộp nhóm theo khách hàng */
    const groupedData = useMemo(() => {
        if (!data?.result) return [];

        const map = new Map<string, any>();
        data.result.forEach((item) => {
            const code = item.customer?.customerCode || "UNKNOWN";
            const deviceWithDate = {
                ...item.device,
                purchaseDate: item.purchaseDate,
            };
            if (!map.has(code)) {
                map.set(code, {
                    ...item,
                    devices: [deviceWithDate],
                });
            } else {
                map.get(code).devices.push(deviceWithDate);
            }
        });

        return Array.from(map.values());
    }, [data]);

    /** Build query */
    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            filter: "",
        };

        if (params.customerCode)
            q.filter = `customer.customerCode~'${params.customerCode}'`;

        if (params.customerName)
            q.filter = q.filter
                ? `${q.filter} and customer.name~'${params.customerName}'`
                : `customer.name~'${params.customerName}'`;

        const temp = queryString.stringify(q, { encode: false });

        let sortBy = "sort=purchaseDate,desc";
        if (sort?.customerName)
            sortBy =
                sort.customerName === "ascend"
                    ? "sort=customer.name,asc"
                    : "sort=customer.name,desc";

        return `${temp}&${sortBy}`;
    };

    /** Cột bảng */
    const columns: ProColumns<ICustomerPurchaseHistoryAdmin>[] = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            hideInSearch: true,
            render: (_dom, _record, index) => index + 1,
        },
        {
            title: "Mã KH",
            dataIndex: ["customer", "customerCode"],
            key: "customerCode",
            render: (dom) => <Tag color="blue">{(dom as string) || "-"}</Tag>,
        },
        {
            title: "Tên khách hàng",
            dataIndex: ["customer", "name"],
            key: "customerName",
            sorter: true,
        },
        {
            title: "Email khách hàng",
            dataIndex: ["customer", "email"],
            key: "customerEmail",
        },
        {
            title: "Thiết bị đã mua",
            key: "devices",
            hideInSearch: true,
            render: (_dom, record: any) => {
                const deviceNames =
                    record.devices?.map((d: any) => d?.deviceName || "-") || [];
                return (
                    <Text>
                        {deviceNames.length > 3
                            ? `${deviceNames.slice(0, 3).join(", ")} ... (${deviceNames.length} thiết bị)`
                            : deviceNames.join(", ")}
                    </Text>
                );
            },
        },
        {
            title: "Tổng số thiết bị",
            key: "totalDevices",
            align: "center",
            hideInSearch: true,
            render: (_dom, record: any) => (
                <Tag color="purple">{record.devices?.length || 0}</Tag>
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            width: 100,
            align: "center",
            hideInSearch: true,
            render: (_dom, record: any) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.CUSTOMER_PURCHASE_HISTORY.GET_BY_ID}
                        hideChildren
                    >
                        <EyeOutlined
                            style={{
                                fontSize: 18,
                                color: "#1677ff",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSelectedRecord(record);
                                setOpenViewDetail(true);
                            }}
                        />
                    </Access>
                </Space>
            ),
        },
    ];

    /** Tổng dữ liệu */
    const meta = {
        page: data?.meta?.page ?? PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: data?.meta?.pageSize ?? PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: groupedData.length,
    };

    /** Reload lại bảng */
    const reloadTable = () => {
        setQuery(
            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=purchaseDate,desc`
        );
    };

    return (
        <PageContainer
            title="Lịch sử mua hàng của khách hàng"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm theo mã hoặc tên khách hàng..."
                    showFilterButton={false}
                    onSearch={(val) =>
                        setQuery(
                            `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&filter=(customer.customerCode~'${val}' or customer.name~'${val}')`
                        )
                    }
                    onReset={() => reloadTable()}
                />
            }
        >
            <Access permission={ALL_PERMISSIONS.CUSTOMER_PURCHASE_HISTORY.GET_PAGINATE}>
                <DataTable<ICustomerPurchaseHistoryAdmin>
                    actionRef={tableRef}
                    rowKey={(record) =>
                        String(record.customer?.customerCode || record.id || "")
                    }
                    loading={isFetching}
                    columns={columns}
                    dataSource={groupedData}
                    request={async (params, sort) => {
                        const q = buildQuery(params, sort);
                        setQuery(q);
                        return Promise.resolve({
                            data: groupedData || [],
                            success: true,
                            total: meta.total || 0,
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
                                khách hàng
                            </div>
                        ),
                    }}
                    rowSelection={false}
                />
            </Access>

            {/* Modal chi tiết */}
            <ModalPurchaseDetail
                open={openViewDetail}
                setOpen={setOpenViewDetail}
                data={selectedRecord as any}
            />
        </PageContainer>
    );
};

export default CustomerPurchaseHistoryPage;
