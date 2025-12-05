import {
    Tabs,
    Descriptions,
    Tag,
    Divider,
    Typography,
    Spin,
    Image,
    Table,
    Alert,
} from "antd";
import { useMaintenanceRequestByIdQuery } from "@/hooks/maintenance/useMaintenanceRequests";
import dayjs from "dayjs";

const { Title } = Typography;
const { TabPane } = Tabs;
import type {
    MaintenanceRequestStatus
} from '@/types/backend';
interface ViewMaintenanceDetailProps {
    requestId: string;
}
import VideoPopup from "@/components/ui/VideoPopup";

const ViewMaintenanceDetail = ({ requestId }: ViewMaintenanceDetailProps) => {
    const { data, isLoading } = useMaintenanceRequestByIdQuery(requestId);

    if (isLoading) return <Spin size="large" />;

    const info = data?.requestInfo;
    const assign = data?.assignmentInfo;
    const reject = data?.rejectInfo;
    const survey = data?.surveyInfo;
    const plan = data?.planInfo;
    const planReject = data?.planRejectInfo;
    const execution = data?.executionInfo;
    const acceptanceList = data?.acceptanceInfos || [];
    const acceptanceReject = data?.acceptanceRejectInfo;
    const device = info?.device;

    const formatDate = (d?: string) =>
        d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "-";

    const renderImages = (path: string, files: (string | null | undefined)[]) => (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {files.filter(Boolean).map((f, i) => (
                <Image
                    key={i}
                    width={130}
                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/${path}/${f}`}
                />
            ))}
        </div>
    );

    const renderTag = (type: string | undefined) => {
        switch (type) {
            case "CUSTOMER":
                return <Tag color="purple">Khách hàng</Tag>;
            case "EMPLOYEE":
                return <Tag color="blue">Nhân viên</Tag>;
            default:
                return "-";
        }
    };

    const statusColorMap: Record<MaintenanceRequestStatus, string> = {
        CHO_PHAN_CONG: "gold",          // Chờ phân công
        DANG_PHAN_CONG: "blue",         // Đang phân công
        DA_XAC_NHAN: "cyan",            // Đã xác nhận
        DA_KHAO_SAT: "lime",            // Đã khảo sát
        DA_LAP_KE_HOACH: "orange",      // Đã lập kế hoạch
        TU_CHOI_PHE_DUYET: "red",       // Từ chối phê duyệt
        DA_PHE_DUYET: "green",          // Đã phê duyệt
        DANG_BAO_TRI: "processing",     // Đang bảo trì
        CHO_NGHIEM_THU: "volcano",      // Chờ nghiệm thu
        TU_CHOI_NGHIEM_THU: "red",      // Từ chối nghiệm thu
        HOAN_THANH: "success",          // Hoàn thành
        HUY: "magenta",                 // Hủy
    };


    return (
        <div style={{ padding: 16 }}>
            <Tabs defaultActiveKey="1" type="card">
                {/* TAB 1: THÔNG TIN YÊU CẦU */}
                <TabPane tab="1. Yêu cầu" key="1">
                    <Title level={5}>Thông tin phiếu yêu cầu</Title>
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Mã phiếu">{info?.requestCode}</Descriptions.Item>
                        <Descriptions.Item label="Người tạo">{info?.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Mã người tạo">
                            <Tag>{info?.employeeOrCustomerCode}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại người tạo">
                            {renderTag(info?.creatorType)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{info?.phone}</Descriptions.Item>
                        <Descriptions.Item label="Địa điểm">{info?.locationDetail}</Descriptions.Item>
                        <Descriptions.Item label="Sự cố">{info?.issueName}</Descriptions.Item>
                        <Descriptions.Item label="Mức ưu tiên">
                            <Tag color="volcano">{info?.priorityLevel}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại bảo trì">{info?.maintenanceType}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={statusColorMap[info?.status as MaintenanceRequestStatus] || "default"}>
                                {info?.status || "-"}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú" span={2}>{info?.note}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">{formatDate(info?.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{formatDate(info?.updatedAt)}</Descriptions.Item>
                    </Descriptions>

                    {device && (
                        <>
                            <Divider />
                            <Title level={5}>Thông tin thiết bị</Title>
                            <Descriptions bordered column={2} size="small">
                                <Descriptions.Item label="Mã thiết bị">
                                    <Tag color="geekblue">{device.deviceCode}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Tên thiết bị">{device.deviceName}</Descriptions.Item>
                                <Descriptions.Item label="Sở hữu">
                                    <Tag color={device.ownershipType === "CUSTOMER" ? "magenta" : "green"}>
                                        {device.ownershipType === "CUSTOMER" ? "Khách hàng" : "Nội bộ"}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Công ty">{device.companyName}</Descriptions.Item>
                                <Descriptions.Item label="Phòng ban">{device.departmentName}</Descriptions.Item>
                            </Descriptions>

                            {(device.image1 || device.image2 || device.image3) && (
                                <>
                                    <Divider />
                                    <Title level={5}>Hình ảnh thiết bị</Title>
                                    {renderImages("device", [device.image1, device.image2, device.image3])}
                                </>
                            )}
                        </>
                    )}

                    {(info?.attachment1 || info?.attachment2 || info?.attachment3) && (
                        <>
                            <Divider />
                            <Title level={5}>Ảnh đính kèm yêu cầu</Title>
                            {renderImages("maintenance_request", [
                                info?.attachment1,
                                info?.attachment2,
                                info?.attachment3,
                            ])}
                        </>
                    )}
                </TabPane>

                {/* TAB 2: PHÂN CÔNG */}
                {assign && (
                    <TabPane tab="2. Phân công" key="2">
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Kỹ thuật viên">{assign.technicianName}</Descriptions.Item>
                            <Descriptions.Item label="Mã kỹ thuật viên">{assign.technicianCode}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{assign.technicianPhone}</Descriptions.Item>
                            <Descriptions.Item label="Người phân công">{assign.assignedBy}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian phân công">{formatDate(assign.assignedAt)}</Descriptions.Item>
                        </Descriptions>
                        {reject?.logs && reject.logs.length > 0 && (
                            <>
                                <Divider />
                                <Title level={5}>Lịch sử từ chối phân công</Title>
                                <Table
                                    dataSource={reject.logs}
                                    pagination={false}
                                    rowKey={(_, index) => String(index)}
                                    size="small"
                                    columns={[
                                        { title: "Kỹ thuật viên", dataIndex: "technicianName" },
                                        { title: "Lý do", dataIndex: "reasonName" },
                                        { title: "Ghi chú", dataIndex: "note" },
                                        { title: "Người từ chối", dataIndex: "rejectedBy" },
                                        { title: "Thời gian", dataIndex: "rejectedAt", render: (t) => formatDate(t) },
                                    ]}
                                />

                            </>
                        )}
                    </TabPane>
                )}

                {/* TAB 3: KHẢO SÁT */}
                {survey && (
                    <TabPane tab="3. Khảo sát" key="3">
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Nguyên nhân">{survey.causeName}</Descriptions.Item>
                            <Descriptions.Item label="Mức độ hư hại">{survey.damageLevel}</Descriptions.Item>
                            <Descriptions.Item label="Loại bảo trì thực tế">{survey.maintenanceTypeActual}</Descriptions.Item>
                            <Descriptions.Item label="Ngày khảo sát">{formatDate(survey.surveyDate)}</Descriptions.Item>
                            <Descriptions.Item label="Kỹ thuật viên khảo sát">{survey.technicianName}</Descriptions.Item>
                            <Descriptions.Item label="Mô tả sự cố" span={2}>{survey.actualIssueDescription}</Descriptions.Item>
                        </Descriptions>
                        {(survey.attachment1 || survey.attachment2 || survey.attachment3) && (
                            <>
                                <Divider />
                                <Title level={5}>Ảnh khảo sát</Title>
                                {renderImages("survey_attachment", [
                                    survey.attachment1,
                                    survey.attachment2,
                                    survey.attachment3,
                                ])}
                            </>
                        )}
                    </TabPane>
                )}

                {/* TAB 4: KẾ HOẠCH */}
                {plan && (
                    <TabPane tab="4. Kế hoạch" key="4">
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Giải pháp" span={2}>
                                {plan.solutionName ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        {plan.solutionName
                                            .split(",")
                                            .map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        background: "#fafafa",
                                                        borderRadius: 4,
                                                        padding: "4px 8px",
                                                        border: "1px solid #f0f0f0",
                                                    }}
                                                >
                                                    <b>{idx + 1}.</b> {item.trim()}
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    "-"
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sử dụng vật tư">{plan.useMaterial ? "Có" : "Không"}</Descriptions.Item>
                            <Descriptions.Item label="Người lập">{plan.createdBy}</Descriptions.Item>
                            <Descriptions.Item label="Ngày lập">
                                {plan.createdAt ? formatDate(plan.createdAt) : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú" span={2}>{plan.note}</Descriptions.Item>
                        </Descriptions>

                        {plan.materials && plan.materials.length > 0 && (
                            <>
                                <Divider />
                                <Title level={5}>Vật tư kế hoạch</Title>
                                <Table
                                    dataSource={plan.materials}
                                    rowKey="partCode"
                                    pagination={false}
                                    size="small"
                                    columns={[
                                        { title: "Mã vật tư", dataIndex: "partCode" },
                                        { title: "Tên vật tư", dataIndex: "partName" },
                                        { title: "Số lượng", dataIndex: "quantity" },
                                        { title: "Thiếu", dataIndex: "isShortage", render: (v) => (v ? "Có" : "Không") },
                                        { title: "Đề xuất mới", dataIndex: "isNewProposal", render: (v) => (v ? "Có" : "Không") },
                                    ]}
                                />
                            </>
                        )}

                        {planReject && (
                            <>
                                <Divider />
                                <Alert
                                    message="Kế hoạch bị từ chối"
                                    type="error"
                                    showIcon
                                    description={
                                        <>
                                            <b>Lý do:</b> {planReject.reasonName || "-"} <br />
                                            <b>Người từ chối:</b> {planReject.rejectedBy || "-"} <br />
                                            <b>Ghi chú:</b> {planReject.note || "-"} <br />
                                            <b>Thời gian:</b> {formatDate(planReject.rejectedAt)}
                                        </>
                                    }
                                />
                            </>
                        )}
                    </TabPane>
                )}

                {/* TAB 5: THI CÔNG */}
                {execution && (
                    <TabPane tab="5. Thi công" key="5">
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Kỹ thuật viên chính">{execution.mainTechnician}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">{execution.status}</Descriptions.Item>
                            <Descriptions.Item label="Bắt đầu">{formatDate(execution.startAt)}</Descriptions.Item>
                            <Descriptions.Item label="Kết thúc">{formatDate(execution.endAt)}</Descriptions.Item>
                            <Descriptions.Item label="Tổng công việc">{execution.totalTasks}</Descriptions.Item>
                            <Descriptions.Item label="Hoàn thành">{execution.completedTasks}</Descriptions.Item>
                        </Descriptions>

                        {/* Danh sách công việc thi công */}
                        {execution.tasks && execution.tasks.length > 0 && (
                            <>
                                <Divider />
                                <Title level={5}>Công việc thi công</Title>
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    {execution.tasks.map((task, idx) => (
                                        <div
                                            key={task.id || idx}
                                            style={{
                                                border: "1px solid #f0f0f0",
                                                borderRadius: 8,
                                                padding: 12,
                                                background: "#fafafa",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexWrap: "wrap",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div>
                                                    <Tag color={task.done ? "green" : "red"}>
                                                        {task.done ? "Hoàn thành" : "Chưa hoàn thành"}
                                                    </Tag>
                                                    <b style={{ marginLeft: 8 }}>{task.content}</b>
                                                </div>
                                                <div style={{ fontSize: 13, color: "#888" }}>
                                                    {task.doneAt && (
                                                        <span>
                                                            <b>Hoàn thành:</b> {formatDate(task.doneAt)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ marginTop: 8 }}>
                                                <p>
                                                    <b>Người thực hiện:</b> {task.doneBy || "-"}
                                                </p>
                                                <p>
                                                    <b>Ghi chú:</b> {task.note || "-"}
                                                </p>
                                            </div>

                                            {/* Ảnh minh chứng */}
                                            {(task.image1 || task.image2 || task.image3) && (
                                                <div style={{ marginTop: 10 }}>
                                                    <b>Hình ảnh:</b>
                                                    <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                                                        {[task.image1, task.image2, task.image3]
                                                            .filter(Boolean)
                                                            .map((img, i) => (
                                                                <Image
                                                                    key={i}
                                                                    width={130}
                                                                    height={90}
                                                                    style={{ objectFit: "cover", borderRadius: 6 }}
                                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/execution_task/${img}`}
                                                                    alt={`task-${idx}-img-${i}`}
                                                                />
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                            {task.video && (
                                                <div style={{ marginTop: 12 }}>
                                                    <b>Video:</b>
                                                    <div style={{ marginTop: 8 }}>
                                                        <VideoPopup
                                                            videoUrl={`${import.meta.env.VITE_BACKEND_URL}/storage/execution_task/${task.video}`}
                                                            thumbnail={
                                                                task.image1
                                                                    ? `${import.meta.env.VITE_BACKEND_URL}/storage/execution_task/${task.image1}`
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )}


                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Vật tư sử dụng */}
                        {execution.materials && execution.materials.length > 0 && (
                            <>
                                <Divider />
                                <Title level={5}>Vật tư sử dụng</Title>
                                <Table
                                    dataSource={execution.materials}
                                    rowKey="partCode"
                                    pagination={false}
                                    size="small"
                                    columns={[
                                        { title: "Mã vật tư", dataIndex: "partCode" },
                                        { title: "Tên vật tư", dataIndex: "partName" },
                                        { title: "Số lượng", dataIndex: "quantity" },
                                        { title: "Kho", dataIndex: "warehouseName" },
                                    ]}
                                />
                            </>
                        )}

                        {/* Lịch sử từ chối thi công */}
                        {execution.rejectHistory && execution.rejectHistory.length > 0 && (
                            <>
                                <Divider />
                                <Title level={5}>Lịch sử từ chối thi công</Title>
                                <Table
                                    dataSource={execution.rejectHistory}
                                    rowKey="rejectedAt"
                                    pagination={false}
                                    size="small"
                                    columns={[
                                        { title: "Lý do", dataIndex: "reasonName" },
                                        { title: "Người từ chối", dataIndex: "rejectedBy" },
                                        { title: "Ghi chú", dataIndex: "note" },
                                        { title: "Thời gian", render: (_, r) => formatDate(r.rejectedAt) },
                                    ]}
                                />
                            </>
                        )}

                        {/* Danh sách yêu cầu hỗ trợ */}
                        {execution.supportRequests && execution.supportRequests.length > 0 && (
                            <>
                                <Divider />
                                <Title level={5}>Yêu cầu hỗ trợ thi công</Title>
                                <Table
                                    dataSource={execution.supportRequests}
                                    rowKey="createdAt"
                                    pagination={false}
                                    size="small"
                                    columns={[
                                        { title: "Người yêu cầu", dataIndex: "requesterName" },
                                        { title: "Người hỗ trợ", dataIndex: "supporterName" },
                                        { title: "Lý do", dataIndex: "reason" },
                                        { title: "Trạng thái", dataIndex: "status" },
                                        { title: "Ngày tạo", render: (_, r) => formatDate(r.createdAt) },
                                    ]}
                                />
                            </>
                        )}
                    </TabPane>
                )}


                {/* TAB 6: NGHIỆM THU */}
                {(acceptanceList.length > 0 || acceptanceReject) && (
                    <TabPane tab="6. Nghiệm thu" key="6">
                        {acceptanceList.length > 0 && (
                            <>
                                <Title level={5}>Danh sách nghiệm thu</Title>
                                <Table
                                    dataSource={acceptanceList}
                                    pagination={false}
                                    size="small"
                                    rowKey="acceptanceId"
                                    scroll={{ x: "max-content" }}
                                    columns={[
                                        { title: "Người nghiệm thu", dataIndex: "createdBy" },
                                        { title: "Loại", dataIndex: "approverType" },
                                        { title: "Đánh giá", dataIndex: "rating" },
                                        {
                                            title: "Đúng hạn",
                                            render: (_, r) => (r.isOnTime ? "✔️" : "❌"),
                                        },
                                        {
                                            title: "Chuyên nghiệp",
                                            render: (_, r) => (r.isProfessional ? "✔️" : "❌"),
                                        },
                                        {
                                            title: "Thiết bị hoạt động",
                                            render: (_, r) => (r.isDeviceWorking ? "✔️" : "❌"),
                                        },
                                        { title: "Nhận xét", dataIndex: "comment" },
                                        { title: "Ngày tạo", render: (_, r) => formatDate(r.createdAt) },
                                    ]}
                                />
                            </>
                        )}

                        {acceptanceReject && (
                            <>
                                <Divider />
                                <Alert
                                    message="Từ chối nghiệm thu"
                                    type="error"
                                    showIcon
                                    description={
                                        <>
                                            <b>Lý do:</b> {acceptanceReject.reasonName || "-"} <br />
                                            <b>Người từ chối:</b> {acceptanceReject.rejectedBy || "-"} <br />
                                            <b>Ghi chú:</b> {acceptanceReject.note || "-"} <br />
                                            <b>Thời gian:</b> {formatDate(acceptanceReject.rejectedAt)}
                                        </>
                                    }
                                />
                            </>
                        )}
                    </TabPane>
                )}
            </Tabs>
        </div>
    );
};

export default ViewMaintenanceDetail;
