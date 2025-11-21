// // src/pages/admin/maintenance-report/sections/PeriodicMaintenance.tsx

// import { useState, useMemo } from "react";
// import { Card, Table, Space, message } from "antd";
// import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
// import dayjs from "dayjs";

// import PeriodicMaintenanceFilter from "../filters/PeriodicMaintenanceFilter";
// import ExportButton from "@/components/admin/maintenance-report/ExportButton";
// import Access from "@/components/share/access";

// import {
//     usePeriodicMaintenanceReportQuery,
// } from "@/hooks/useMaintenanceReports";

// import {
//     callExportPeriodicMaintenanceReport,
// } from "@/config/api";

// import { ALL_PERMISSIONS } from "@/config/permissions";

// import type {
//     IPeriodicMaintenanceFilter,
//     IPeriodicMaintenanceReport,
// } from "@/types/backend";

// interface ITableParams {
//     pagination: Partial<TablePaginationConfig>;
// }

// const PeriodicMaintenanceSection = () => {
//     const [filter, setFilter] = useState<IPeriodicMaintenanceFilter>({});
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

//     const { data, isLoading } = usePeriodicMaintenanceReportQuery(
//         filter,
//         queryString
//     );

//     const pagination: TablePaginationConfig = {
//         ...tableParams.pagination,
//         total: data?.meta?.total ?? 0,
//     };

//     const handleTableChange = (pagination: TablePaginationConfig) => {
//         setTableParams({ pagination });
//     };

//     const handleFilterChange = (next: IPeriodicMaintenanceFilter) => {
//         setFilter(next);
//         setTableParams((prev) => ({
//             ...prev,
//             pagination: { ...prev.pagination, current: 1 },
//         }));
//     };

//     const buildExportQuery = (f: IPeriodicMaintenanceFilter) => {
//         const params = new URLSearchParams();
//         if (f.companyId) params.set("companyId", String(f.companyId));
//         if (f.departmentId) params.set("departmentId", String(f.departmentId));
//         if (f.deviceCode) params.set("deviceCode", f.deviceCode);
//         if (f.deviceName) params.set("deviceName", f.deviceName);
//         if (f.startDate) params.set("startDate", f.startDate);
//         if (f.endDate) params.set("endDate", f.endDate);
//         return params.toString();
//     };

//     const handleExport = async () => {
//         try {
//             setExportLoading(true);
//             const qs = buildExportQuery(filter);
//             const res = await callExportPeriodicMaintenanceReport(qs);

//             const blob = new Blob([res.data], {
//                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = `bao_cao_bao_tri_dinh_ky_${dayjs().format(
//                 "YYYYMMDD_HHmmss"
//             )}.xlsx`;
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

//     const columns: ColumnsType<IPeriodicMaintenanceReport> = [
//         {
//             title: "Ngày bảo trì",
//             dataIndex: "maintenanceDate",
//             key: "maintenanceDate",
//             width: 140,
//             render: (v: string | undefined) =>
//                 v ? dayjs(v).format("DD/MM/YYYY") : "",
//         },
//         {
//             title: "Mã thiết bị",
//             dataIndex: "deviceCode",
//             key: "deviceCode",
//             width: 150,
//             fixed: "left",
//         },
//         {
//             title: "Tên thiết bị",
//             dataIndex: "deviceName",
//             key: "deviceName",
//             width: 200,
//         },
//         {
//             title: "Công ty",
//             dataIndex: "companyName",
//             key: "companyName",
//             width: 180,
//         },
//         {
//             title: "Phòng ban",
//             dataIndex: "departmentName",
//             key: "departmentName",
//             width: 160,
//         },
//         {
//             title: "Vị trí",
//             dataIndex: "location",
//             key: "location",
//             width: 160,
//         },
//         {
//             title: "Kỹ thuật viên",
//             dataIndex: "technicianName",
//             key: "technicianName",
//             width: 180,
//         },
//         {
//             title: "Tình trạng sau bảo trì",
//             dataIndex: "postMaintenanceStatus",
//             key: "postMaintenanceStatus",
//             width: 200,
//         },
//         {
//             title: "Trạng thái",
//             dataIndex: "status",
//             key: "status",
//             width: 130,
//         },
//     ];

//     return (
//         <Card title="Báo cáo bảo trì định kỳ" bodyStyle={{ paddingTop: 12 }}>
//             <Space direction="vertical" style={{ width: "100%" }} size="middle">

//                 <Access permission={ALL_PERMISSIONS.REPORT_EXPORT.PERIODIC_MAINTENANCE} hideChildren>
//                     <ExportButton onExport={handleExport} loading={exportLoading} />
//                 </Access>

//                 <PeriodicMaintenanceFilter
//                     filter={filter}
//                     onChange={handleFilterChange}
//                     loading={isLoading}
//                 />

//                 <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.PERIODIC_MAINTENANCE}>
//                     <Table<IPeriodicMaintenanceReport>
//                         rowKey={(r) => r.deviceCode + (r.maintenanceDate || "")}
//                         columns={columns}
//                         dataSource={data?.result ?? []}
//                         loading={isLoading}
//                         pagination={pagination}
//                         scroll={{ x: 1600 }}
//                         onChange={handleTableChange}
//                         size="middle"
//                     />
//                 </Access>

//             </Space>
//         </Card>
//     );
// };

// export default PeriodicMaintenanceSection;
