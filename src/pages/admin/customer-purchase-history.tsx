import DataTable from "@/components/admin/data-table";
import type { ICustomerPurchaseHistoryAdmin } from "@/types/backend";
import { EyeOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { Space, Tag, Typography } from "antd";
import { useState, useMemo } from "react";
import queryString from "query-string";
import { useCustomerPurchaseHistoriesQuery } from "@/hooks/useCustomerPurchaseHistory";
import ModalPurchaseDetail from "@/components/admin/customer/modal.customer-purchase-detail";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const { Text } = Typography;

const CustomerPurchaseHistoryPage = () => {
    const [query, setQuery] = useState(() =>
        queryString.stringify(
            {
                page: 1,
                size: 100,
                sort: "purchaseDate,desc",
            },
            { encode: false }
        )
    );

    const { data, isFetching } = useCustomerPurchaseHistoriesQuery(query);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedRecord, setSelectedRecord] =
        useState<ICustomerPurchaseHistoryAdmin | null>(null);

    /** ===================== GỘP NHÓM THEO KHÁCH HÀNG ===================== **/
    const groupedData = useMemo(() => {
        if (!data?.result) return [];

        const map = new Map<string, any>();

        data.result.forEach((item) => {
            const code = item.customer?.customerCode || "UNKNOWN";
            const deviceWithDate = {
                ...item.device,
                purchaseDate: item.purchaseDate, // thêm ngày mua
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

    /** ===================== COLUMNS ===================== **/
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

    /** ===================== BUILD QUERY ===================== **/
    const buildQuery = (params: any, sort: any) => {
        const q: any = { page: params.current, size: params.pageSize, filter: "" };
        if (params.customerCode)
            q.filter = `customer.customerCode~'${params.customerCode}'`;
        if (params.customerName)
            q.filter = q.filter
                ? `${q.filter} and customer.name~'${params.customerName}'`
                : `customer.name~'${params.customerName}'`;

        let sortBy = "sort=purchaseDate,desc";
        if (sort?.customerName)
            sortBy =
                sort.customerName === "ascend"
                    ? "sort=customer.name,asc"
                    : "sort=customer.name,desc";

        const temp = queryString.stringify(q);
        return `${temp}&${sortBy}`;
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.CUSTOMER_PURCHASE_HISTORY.GET_PAGINATE}>
                <DataTable<ICustomerPurchaseHistoryAdmin>
                    headerTitle="Danh sách lịch sử mua hàng của khách hàng"
                    rowKey={(record) =>
                        String(record.customer?.customerCode || record.id || "")
                    }
                    loading={isFetching}
                    columns={columns}
                    dataSource={groupedData}
                    request={async (params, sort): Promise<any> => {
                        const newQuery = buildQuery(params, sort);
                        setQuery(newQuery);
                    }}
                    pagination={{
                        defaultPageSize: 10,
                        current: 1,
                        total: groupedData.length,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        size: "default",
                    }}
                    rowSelection={false}
                />
            </Access>

            <ModalPurchaseDetail
                open={openViewDetail}
                setOpen={setOpenViewDetail}
                data={selectedRecord as any}
            />
        </div>
    );
};

export default CustomerPurchaseHistoryPage;
