// // src/pages/admin/maintenance-report/sections/TechnicianActivity.tsx

// import { useState, useMemo } from "react";
// import { Card, Table, Space, message } from "antd";
// import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
// import dayjs from "dayjs";

// import TechnicianActivityFilter from "../filters/TechnicianActivityFilter";
// import ExportButton from "@/components/admin/maintenance-report/ExportButton";
// import Access from "@/components/share/access";

// import { useTechnicianActivityReportQuery } from "@/hooks/useMaintenanceReports";

// import { callExportTechnicianActivityReport } from "@/config/api";

// import { ALL_PERMISSIONS } from "@/config/permissions";

// import type {
//     ITechnicianActivityFilter,
//     ITechnicianActivityReport,
// } from "@/types/backend";

// interface ITableParams {
//     pagination: Partial<TablePaginationConfig>;
// }

// const TechnicianActivitySection = () => {
//     const [filter, setFilter] = useState<ITechnicianActivityFilter>({});
//     const [tableParams, setTableParams] = useState<ITableParams>({
//         pagination: {
//             current: 1,
//             pageSize: 10,
//             showSizeChanger: true,
//             pageSizeOptions: [10, 20, 50, 100],
//         },
//     });

//     const [exportLoading, setExportLoading] = useState(false);

//     /* ---------------------- Build Query String ---------------------- */
//     const queryString = useMemo(() => {
//         const params = new URLSearchParams();
//         params.set("page", String((tableParams.pagination.current ?? 1) - 1));
//         params.set("size", String(tableParams.pagination.pageSize ?? 10));
//         return params.toString();
//     }, [tableParams]);

//     const { data, isLoading } = useTechnicianActivityReportQuery(filter, queryString);

//     const pagination: TablePaginationConfig = {
//         ...tableParams.pagination,
//         total: data?.meta?.total ?? 0,
//     };

//     const handleTableChange = (pagination: TablePaginationConfig) => {
//         setTableParams({ pagination });
//     };

//     const handleFilterChange = (next: ITechnicianActivityFilter) => {
//         setFilter(next);
//         setTableParams((prev) => ({
//             ...prev,
//             pagination: {
//                 ...prev.pagination,
//                 current: 1,
//             },
//         }));
//     };

//     /* ---------------------- EXPORT EXCEL ---------------------- */
//     const buildExportQuery = (f: ITechnicianActivityFilter) => {
//         const params = new URLSearchParams();


//         if (f.toDate) params.set("toDate", f.toDate);

//         return params.toString();
//     };

//     const handleExport = async () => {
//         try {
//             setExportLoading(true);
//             const qs = buildExportQuery(filter);
//             const res = await callExportTechnicianActivityReport(qs);

//             const blob = new Blob([res.data], {
//                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = `hoat_dong_ky_thuat_vien_${dayjs().format(
//                 "YYYYMMDD_HHmmss"
//             )}.xlsx`;
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             message.error("Xuất báo cáo thất bại");
//         } finally {
//             setExportLoading(false);
//         }
//     };

//     /* ---------------------- TABLE COLUMNS ---------------------- */
//     const columns: ColumnsType<ITechnicianActivityReport> = [
//         {
//             title: "Tên kỹ thuật viên",
//             dataIndex: "technicianName",
//             key: "technicianName",
//             width: 180,
//             fixed: "left",
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
//             title: "Mã yêu cầu",
//             dataIndex: "requestCode",
//             key: "requestCode",
//             width: 150,
//         },
//         {
//             title: "Tên thiết bị",
//             dataIndex: "deviceName",
//             key: "deviceName",
//             width: 200,
//         },
//         {
//             title: "Ngày bắt đầu",
//             dataIndex: "startDate",
//             key: "startDate",
//             width: 130,
//             render: (v: string | undefined) =>
//                 v ? dayjs(v).format("DD/MM/YYYY") : "",
//         },
//         {
//             title: "Ngày kết thúc",
//             dataIndex: "endDate",
//             key: "endDate",
//             width: 130,
//             render: (v: string | undefined) =>
//                 v ? dayjs(v).format("DD/MM/YYYY") : "",
//         },
//         {
//             title: "Thời lượng (giờ)",
//             dataIndex: "durationHours",
//             key: "durationHours",
//             width: 130,
//         },
//         {
//             title: "Ghi chú",
//             dataIndex: "notes",
//             key: "notes",
//             width: 220,
//             ellipsis: true,
//         },
//     ];

//     return (
//         <Card title="Báo cáo hoạt động kỹ thuật viên" bodyStyle={{ paddingTop: 12 }}>
//             <Space direction="vertical" style={{ width: "100%" }} size="middle">

//                 <Access permission={ALL_PERMISSIONS.REPORT_EXPORT.TECHNICIAN_ACTIVITY} hideChildren>
//                     <ExportButton onExport={handleExport} loading={exportLoading} />
//                 </Access>

//                 <TechnicianActivityFilter
//                     filter={filter}
//                     onChange={handleFilterChange}
//                     loading={isLoading}
//                 />

//                 <Access permission={ALL_PERMISSIONS.MAINTENANCE_REPORT.TECHNICIAN_ACTIVITY}>
//                     <Table<ITechnicianActivityReport>
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

// export default TechnicianActivitySection;
