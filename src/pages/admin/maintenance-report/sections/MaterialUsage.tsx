// // src/pages/admin/maintenance-report/sections/MaterialUsage.tsx

// import { useState, useMemo } from "react";
// import { Card, Table, Space, message } from "antd";
// import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
// import dayjs from "dayjs";

// import MaterialUsageFilter from "../filters/MaterialUsageFilter";
// import ExportButton from "@/components/admin/maintenance-report/ExportButton";
// import Access from "@/components/share/access";

// import { useMaterialUsageReportQuery } from "@/hooks/useMaintenanceReports";
// import { callExportMaterialUsageReport } from "@/config/api";

// import { ALL_PERMISSIONS } from "@/config/permissions";

// import type { IMaterialUsageFilter, IMaterialUsageReport } from "@/types/backend";

// interface ITableParams {
//     pagination: Partial<TablePaginationConfig>;
// }

// const MaterialUsageSection = () => {
//     const [filter, setFilter] = useState<IMaterialUsageFilter>({});
//     const [tableParams, setTableParams] = useState<ITableParams>({
//         pagination: {
//             current: 1,
//             pageSize: 10,
//             showSizeChanger: true,
//             pageSizeOptions: [10, 20, 50, 100],
//         },
//     });

//     const [exportLoading, setExportLoading] = useState(false);

//     const queryString = useMemo(() => {
//         const params = new URLSearchParams();
//         params.set("page", String((tableParams.pagination.current ?? 1) - 1));
//         params.set("size", String(tableParams.pagination.pageSize ?? 10));
//         return params.toString();
//     }, [tableParams]);

//     const { data, isLoading } = useMaterialUsageReportQuery(filter, queryString);

//     const pagination: TablePaginationConfig = {
//         ...tableParams.pagination,
//         total: data?.meta?.total ?? 0,
//     };

//     const handleTableChange = (pagination: TablePaginationConfig) => {
//         setTableParams({ pagination });
//     };

//     const handleFilterChange = (next: IMaterialUsageFilter) => {
//         setFilter(next);
//         setTableParams((prev) => ({
//             ...prev,
//             pagination: { ...prev.pagination, current: 1 },
//         }));
//     };

//     const buildExportQuery = (f: IMaterialUsageFilter) => {
//         const params = new URLSearchParams();
//         if (f.materialType) params.set("materialType", f.materialType);
//         if (f.warehouseName) params.set("warehouseName", f.warehouseName);
//         if (f.unitName) params.set("unitName", f.unitName);
//         if (f.fromDate) params.set("fromDate", f.fromDate);
//         if (f.toDate) params.set("toDate", f.toDate);
//         return params.toString();
//     };

//     const handleExport = async () => {
//         try {
//             setExportLoading(true);
//             const qs = buildExportQuery(filter);
//             const res = await callExportMaterialUsageReport(qs);

//             const blob = new Blob([res.data], {
//                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = `bao_cao_vat_tu_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error(error);
//             message.error("Xuất báo cáo thất bại");
//         } finally {
//             setExportLoading(false);
//         }
//     };

//     const columns: ColumnsType<IMaterialUsageReport> = [
//         { title: "Mã vật tư", dataIndex: "partCode", key: "partCode", width: 140, fixed: "left" },
//         { title: "Tên vật tư", dataIndex: "partName", key: "partName", width: 180 },
//         { title: "Loại vật tư", dataIndex: "materialType", key: "materialType", width: 160 },
//         { title: "Kho", dataIndex: "warehouseName", key: "warehouseName", width: 160 },
//         { title: "Đơn vị", dataIndex: "unitName", key: "unitName", width: 120 },
//         { title: "Số lần cấp", dataIndex: "supplyCount", key: "supplyCount", width: 120 },
//         { title: "Số lượng đã dùng", dataIndex: "totalQuantityUsed", key: "totalQuantityUsed", width: 150 },
//         { title: "Tồn kho", dataIndex: "stockRemaining", key: "stockRemaining", width: 120 },
//         { title: "Giá", dataIndex: "unitPrice", key: "unitPrice", width: 120 },
//         { title: "Thành tiền", dataIndex: "totalAmount", key: "totalAmount", width: 140 },
//     ];

//     return (
//         <Card title="Báo cáo vật tư" bodyStyle={{ paddingTop: 12 }}>
//             <Space direction="vertical" style={{ width: "100%" }} size="middle">

//                 <Access permission={ALL_PERMISSIONS.REPORT_EXPORT.MATERIAL_USAGE} hideChildren>
//                     <ExportButton onExport={handleExport} loading={exportLoading} />
//                 </Access>

//                 <MaterialUsageFilter
//                     filter={filter}
//                     onChange={handleFilterChange}
//                     loading={isLoading}
//                 />

//                 <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.MATERIAL_USAGE}>
//                     <Table<IMaterialUsageReport>
//                         rowKey={(r) => r.partCode}
//                         columns={columns}
//                         dataSource={data?.result ?? []}
//                         loading={isLoading}
//                         pagination={pagination}
//                         scroll={{ x: 1500 }}
//                         onChange={handleTableChange}
//                         size="middle"
//                     />
//                 </Access>

//             </Space>
//         </Card>
//     );
// };

// export default MaterialUsageSection;
