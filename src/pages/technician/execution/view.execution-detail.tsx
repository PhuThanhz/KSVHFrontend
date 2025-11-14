import {
    Modal,
    Descriptions,
    Divider,
    Typography,
    Spin,
    Tag,
    Empty,
    Row,
    Col,
    Image,
    Tabs,
} from "antd";
import dayjs from "dayjs";
import { useExecutionDetailQuery } from "@/hooks/maintenance/useMaintenanceExecutions";
import type { IResMaterialDTO } from "@/types/backend";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    requestId?: string | null;
}

/** ===================== Modal Xem Chi Tiết Thi Công ===================== */
const ViewExecutionDetail = ({ open, onClose, requestId }: IProps) => {
    const { data, isLoading, isError } = useExecutionDetailQuery(requestId || undefined);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const requestInfo = data?.requestInfo;
    const surveyInfo = data?.surveyInfo;
    const planInfo = data?.planInfo;
    const materials = data?.materials;
    const device = requestInfo?.device;

    // Hình ảnh thiết bị
    const deviceImages = [device?.image1, device?.image2, device?.image3].filter(Boolean);

    // Hình khảo sát
    const surveyImages = [
        surveyInfo?.attachment1,
        surveyInfo?.attachment2,
        surveyInfo?.attachment3,
    ].filter((f): f is string => Boolean(f));

    /** Bảng hiển thị vật tư */
    const renderMaterialTable = (list: IResMaterialDTO[]) => (
        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #f0f0f0",
                marginBottom: 12,
            }}
        >
            <thead style={{ background: "#fafafa" }}>
                <tr>
                    <th style={{ border: "1px solid #f0f0f0", padding: 8 }}>Mã vật tư</th>
                    <th style={{ border: "1px solid #f0f0f0", padding: 8 }}>Tên vật tư</th>
                    <th style={{ border: "1px solid #f0f0f0", padding: 8 }}>Số lượng</th>
                    <th style={{ border: "1px solid #f0f0f0", padding: 8 }}>Kho</th>
                    <th style={{ border: "1px solid #f0f0f0", padding: 8 }}>Ghi chú</th>
                </tr>
            </thead>
            <tbody>
                {list.map((m: IResMaterialDTO, idx: number) => (
                    <tr key={idx}>
                        <td style={{ border: "1px solid #f0f0f0", padding: 8 }}>{m.partCode}</td>
                        <td style={{ border: "1px solid #f0f0f0", padding: 8 }}>{m.partName}</td>
                        <td style={{ border: "1px solid #f0f0f0", padding: 8 }}>{m.quantity}</td>
                        <td style={{ border: "1px solid #f0f0f0", padding: 8 }}>
                            {m.warehouseName || "-"}
                        </td>
                        <td style={{ border: "1px solid #f0f0f0", padding: 8 }}>
                            {m.isNewProposal
                                ? "Đề xuất mới"
                                : m.isShortage
                                    ? "Thiếu vật tư"
                                    : "-"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    /** Tabs */
    const renderTabs = () => (
        <Tabs defaultActiveKey="1">
            {/* Tab 1: Thông tin phiếu */}
            <TabPane tab="Thông tin phiếu" key="1">
                <Descriptions bordered size="small" column={2} layout="vertical">
                    <Descriptions.Item label="Mã phiếu">
                        {requestInfo?.requestCode}
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        <Tag color="blue">{requestInfo?.status}</Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Tên thiết bị">
                        {device?.deviceName || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Mã thiết bị">
                        {device?.deviceCode || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Vị trí">
                        {requestInfo?.locationDetail || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Đơn vị">
                        {device?.companyName || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Phòng ban">
                        {device?.departmentName || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Loại bảo trì">
                        {requestInfo?.maintenanceType || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Mức độ ưu tiên">
                        {requestInfo?.priorityLevel || "-"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Ngày tạo phiếu">
                        {requestInfo?.createdAt
                            ? dayjs(requestInfo.createdAt).format("DD/MM/YYYY HH:mm")
                            : "-"}
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

                {/* Ảnh thiết bị */}
                <Title level={5}>Ảnh thiết bị</Title>
                {deviceImages.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {deviceImages.map((img, idx) => (
                            <Image
                                key={idx}
                                width={120}
                                height={120}
                                src={`${backendURL}/storage/DEVICE/${img}`}
                                style={{
                                    borderRadius: 8,
                                    objectFit: "cover",
                                    border: "1px solid #f0f0f0",
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <Empty description="Không có ảnh thiết bị" />
                )}

                <Divider />

                {/* Ảnh phiếu */}
                <Title level={5}>Ảnh phiếu yêu cầu</Title>
                {[
                    requestInfo?.attachment1,
                    requestInfo?.attachment2,
                    requestInfo?.attachment3,
                ].filter(Boolean).length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {[requestInfo?.attachment1, requestInfo?.attachment2, requestInfo?.attachment3]
                            .filter(Boolean)
                            .map((img, idx) => (
                                <Image
                                    key={idx}
                                    width={120}
                                    height={120}
                                    src={`${backendURL}/storage/MAINTENANCE_REQUEST/${img}`}
                                    style={{
                                        borderRadius: 8,
                                        objectFit: "cover",
                                        border: "1px solid #f0f0f0",
                                    }}
                                />
                            ))}
                    </div>
                ) : (
                    <Empty description="Không có ảnh phiếu yêu cầu" />
                )}
            </TabPane>

            {/* Tab 2: Khảo sát */}
            <TabPane tab="Khảo sát" key="2">
                {surveyInfo ? (
                    <>
                        <Descriptions bordered size="small" column={2}>
                            <Descriptions.Item label="Kỹ thuật viên">
                                {surveyInfo.technicianName || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày khảo sát">
                                {surveyInfo.surveyDate
                                    ? dayjs(surveyInfo.surveyDate).format("DD/MM/YYYY")
                                    : "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Nguyên nhân">
                                {surveyInfo.causeName || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mức độ hư hại">
                                {surveyInfo.damageLevel || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại bảo trì thực tế">
                                {surveyInfo.maintenanceTypeActual || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mô tả sự cố thực tế">
                                {surveyInfo.actualIssueDescription || "-"}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Title level={5}>Ảnh khảo sát</Title>
                        {surveyImages.length > 0 ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {surveyImages.map((img, idx) => (
                                    <Image
                                        key={idx}
                                        width={120}
                                        height={120}
                                        src={`${backendURL}/storage/survey_attachment/${img}`}
                                        style={{
                                            borderRadius: 8,
                                            objectFit: "cover",
                                            border: "1px solid #f0f0f0",
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Empty description="Không có hình khảo sát" />
                        )}
                    </>
                ) : (
                    <Empty description="Không có thông tin khảo sát" />
                )}
            </TabPane>

            {/* Tab 3: Kế hoạch */}
            <TabPane tab="Kế hoạch" key="3">
                {planInfo ? (
                    <Descriptions bordered size="small" column={2}>
                        <Descriptions.Item label="Phương án">
                            {planInfo.solutionName || "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Người tạo">
                            {planInfo.createdBy || "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {planInfo.createdAt
                                ? dayjs(planInfo.createdAt).format("DD/MM/YYYY HH:mm")
                                : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">
                            {planInfo.note || "-"}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Empty description="Không có thông tin kế hoạch" />
                )}
            </TabPane>

            {/* Tab 4: Vật tư */}
            <TabPane tab="Vật tư" key="4">
                {materials ? (
                    <>
                        {materials.providedMaterials?.length > 0 && (
                            <>
                                <Title level={5}>Vật tư được cấp</Title>
                                {renderMaterialTable(materials.providedMaterials)}
                            </>
                        )}

                        {materials.pendingMaterials?.length > 0 && (
                            <>
                                <Title level={5}>Vật tư đang chờ</Title>
                                {renderMaterialTable(materials.pendingMaterials)}
                            </>
                        )}

                        {!materials.providedMaterials?.length &&
                            !materials.pendingMaterials?.length ? (
                            <Empty description="Không có vật tư thi công" />
                        ) : null}
                    </>
                ) : (
                    <Empty description="Không có thông tin vật tư" />
                )}
            </TabPane>
        </Tabs>
    );

    return (
        <Modal
            open={open}
            onCancel={() => onClose(false)}
            footer={null}
            width={1000}
            title={<Title level={4}>Chi tiết thi công bảo trì</Title>}
        >
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <Spin size="large" />
                </div>
            ) : isError || !data ? (
                <Empty description="Không tìm thấy thông tin thi công" />
            ) : (
                renderTabs()
            )}
        </Modal>
    );
};

export default ViewExecutionDetail;
