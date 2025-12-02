import React, { useState } from 'react';
import { Card, Col, Row, Statistic, Progress, Segmented } from 'antd';
import CountUp from 'react-countup';

interface StatusDataItem {
    name: string;
    percent: number;
    count: number;
}

interface PriorityDataItem {
    name: string;
    value: number;
    color: string;
}

interface DeviceStatusItem {
    name: string;
    value: number;
    color: string;
}

interface TechnicianDataItem {
    name: string;
    totalRequests: number;
    inProgress: number;
    completed: number;
    overdue: number;
}

const DashboardPage: React.FC = () => {
    const [chartType, setChartType] = useState<'Phân trăm' | 'Số lượng'>('Phân trăm');

    const formatter = (value: number | string): React.ReactNode => <CountUp end={Number(value)} separator="," />;

    // Data for "Theo dõi trạng thái yêu cầu"
    const statusData: StatusDataItem[] = [
        { name: 'Chờ phân công', percent: 2, count: 2 },
        { name: 'Đang phân công', percent: 3, count: 3 },
        { name: 'Đã phân công', percent: 9, count: 6 },
        { name: 'Từ chối phân công', percent: 3, count: 3 },
        { name: 'Đã khảo sát', percent: 13, count: 15 },
        { name: 'Đã lập kế hoạch', percent: 10, count: 10 },
        { name: 'Từ chối duyệt', percent: 5, count: 6 },
        { name: 'Chờ vật tư', percent: 9, count: 9 },
        { name: 'Đang thực hiện', percent: 16, count: 16 },
        { name: 'Chờ nghiệm thu', percent: 4, count: 4 },
        { name: 'Đã nghiệm thu', percent: 3, count: 3 },
        { name: 'Từ chối nghiệm thu', percent: 5, count: 5 },
        { name: 'Hoàn thành', percent: 33, count: 33 }
    ];

    const maxValue = chartType === 'Phân trăm'
        ? Math.max(...statusData.map((d: StatusDataItem) => d.percent))
        : Math.max(...statusData.map((d: StatusDataItem) => d.count));

    // Data for "Phân loại yêu cầu theo mức độ ưu tiên"
    const priorityData: PriorityDataItem[] = [
        { name: 'Khẩn cấp', value: 55, color: '#ff4d4f' },
        { name: 'Cao', value: 18, color: '#ff7a45' },
        { name: 'Trung bình', value: 15, color: '#ffc53d' },
        { name: 'Thấp', value: 12, color: '#52c41a' }
    ];

    // Data for "Tình trạng thiết bị sau bảo trì"
    const deviceStatusData: DeviceStatusItem[] = [
        { name: 'Hoạt động bình thường', value: 78, color: '#001f5c' },
        { name: 'Theo dõi thêm', value: 10, color: '#1890ff' },
        { name: 'Hoạt động với hiệu suất thấp', value: 7, color: '#91d5ff' },
        { name: 'Khác', value: 5, color: '#d9d9d9' }
    ];

    // Data for "Top 5 khối lượng công việc của kỹ thuật viên"
    const technicianData: TechnicianDataItem[] = [
        {
            name: 'Nguyễn Thành Đạt',
            totalRequests: 95,
            inProgress: 40,
            completed: 50,
            overdue: 5
        },
        {
            name: 'Phan Hồng Vĩnh',
            totalRequests: 75,
            inProgress: 35,
            completed: 35,
            overdue: 5
        },
        {
            name: 'Võ Phương Nghi',
            totalRequests: 70,
            inProgress: 30,
            completed: 38,
            overdue: 2
        }
    ];

    const renderBarChart = (): React.ReactNode => {
        return (
            <div style={{ padding: '20px 0' }}>
                {statusData.map((item: StatusDataItem, index: number) => {
                    const value = chartType === 'Phân trăm' ? item.percent : item.count;
                    const heightPercent = (value / maxValue) * 100;

                    return (
                        <div key={index} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: '#666', minWidth: 120 }}>{item.name}</span>
                                <div style={{
                                    flex: 1,
                                    height: 30,
                                    background: '#e6f4ff',
                                    borderRadius: 4,
                                    position: 'relative',
                                    marginLeft: 8
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${heightPercent}%`,
                                        background: 'linear-gradient(90deg, #91d5ff 0%, #1890ff 100%)',
                                        borderRadius: 4,
                                        transition: 'width 0.3s ease'
                                    }} />
                                    <span style={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        color: heightPercent > 50 ? '#fff' : '#000'
                                    }}>
                                        {value}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderPieChart = (data: PriorityDataItem[] | DeviceStatusItem[], showPercentage: boolean = true): React.ReactNode => {
        const total = data.reduce((sum: number, item: PriorityDataItem | DeviceStatusItem) => sum + item.value, 0);
        let currentAngle = 0;

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="100" cy="100" r="90" fill="#f0f0f0" />
                    {data.map((item: PriorityDataItem | DeviceStatusItem, index: number) => {
                        const percentage = (item.value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angle;

                        const x1 = 100 + 90 * Math.cos((startAngle * Math.PI) / 180);
                        const y1 = 100 + 90 * Math.sin((startAngle * Math.PI) / 180);
                        const x2 = 100 + 90 * Math.cos((endAngle * Math.PI) / 180);
                        const y2 = 100 + 90 * Math.sin((endAngle * Math.PI) / 180);

                        const largeArc = angle > 180 ? 1 : 0;

                        const pathData = [
                            `M 100 100`,
                            `L ${x1} ${y1}`,
                            `A 90 90 0 ${largeArc} 1 ${x2} ${y2}`,
                            'Z'
                        ].join(' ');

                        currentAngle = endAngle;

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill={item.color}
                                stroke="#fff"
                                strokeWidth="2"
                            />
                        );
                    })}
                    <circle cx="100" cy="100" r="50" fill="#fff" />
                </svg>

                <div style={{ marginLeft: 20 }}>
                    {data.map((item: PriorityDataItem | DeviceStatusItem, index: number) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{
                                width: 12,
                                height: 12,
                                background: item.color,
                                borderRadius: 2,
                                marginRight: 8
                            }} />
                            <span style={{ fontSize: 13, color: '#666' }}>
                                {item.name} {showPercentage && `(${item.value}%)`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderTechnicianChart = (): React.ReactNode => {
        const maxTotal = Math.max(...technicianData.map((t: TechnicianDataItem) => t.totalRequests));

        return (
            <div style={{ padding: '20px 0' }}>
                {technicianData.map((tech: TechnicianDataItem, index: number) => {
                    const totalWidth = (tech.totalRequests / maxTotal) * 100;
                    const inProgressWidth = (tech.inProgress / tech.totalRequests) * 100;
                    const completedWidth = (tech.completed / tech.totalRequests) * 100;
                    const overdueWidth = (tech.overdue / tech.totalRequests) * 100;

                    return (
                        <div key={index} style={{ marginBottom: 20 }}>
                            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 500 }}>
                                {tech.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    flex: 1,
                                    height: 32,
                                    background: '#f0f0f0',
                                    borderRadius: 4,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${totalWidth}%`,
                                        display: 'flex',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            width: `${inProgressWidth}%`,
                                            background: '#1890ff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: 11,
                                            fontWeight: 'bold'
                                        }}>
                                            {tech.inProgress > 10 && tech.inProgress}
                                        </div>
                                        <div style={{
                                            width: `${completedWidth}%`,
                                            background: '#ffa940',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: 11,
                                            fontWeight: 'bold'
                                        }}>
                                            {tech.completed > 10 && tech.completed}
                                        </div>
                                        <div style={{
                                            width: `${overdueWidth}%`,
                                            background: '#ff4d4f',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: 11,
                                            fontWeight: 'bold'
                                        }}>
                                            {tech.overdue > 3 && tech.overdue}
                                        </div>
                                    </div>
                                </div>
                                <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 'bold', minWidth: 40 }}>
                                    {tech.totalRequests}
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 12, height: 12, background: '#1890ff', marginRight: 6 }} />
                        <span style={{ fontSize: 12 }}>Đang xử lý</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 12, height: 12, background: '#ffa940', marginRight: 6 }} />
                        <span style={{ fontSize: 12 }}>Đã xử lý</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 12, height: 12, background: '#ff4d4f', marginRight: 6 }} />
                        <span style={{ fontSize: 12 }}>Trễ hạn</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            {/* Top Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 8 }}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#666' }}>Tổng số yêu cầu bảo trì</span>}
                            value={158}
                            formatter={formatter}
                            valueStyle={{ color: '#1890ff', fontSize: 32, fontWeight: 'bold' }}
                            suffix={<span style={{ fontSize: 14, color: '#52c41a', marginLeft: 8 }}>+2,5%</span>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 8 }}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#666' }}>Số yêu cầu đang xử lý</span>}
                            value={108}
                            formatter={formatter}
                            valueStyle={{ color: '#1890ff', fontSize: 32, fontWeight: 'bold' }}
                            suffix={<span style={{ fontSize: 14, color: '#52c41a', marginLeft: 8 }}>+11%</span>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 8 }}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#666' }}>Số yêu cầu đã xử lý</span>}
                            value={50}
                            formatter={formatter}
                            valueStyle={{ color: '#1890ff', fontSize: 32, fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 8 }}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#666' }}>Số yêu cầu đang quá hạn</span>}
                            value={2}
                            formatter={formatter}
                            valueStyle={{ color: '#1890ff', fontSize: 32, fontWeight: 'bold' }}
                            suffix={<span style={{ fontSize: 14, color: '#52c41a', marginLeft: 8 }}>+50%</span>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} style={{ borderRadius: 8 }}>
                        <Statistic
                            title={<span style={{ fontSize: 14, color: '#666' }}>Tổng Chi phí bảo trì</span>}
                            value={32.23}
                            formatter={formatter}
                            suffix="M"
                            valueStyle={{ color: '#1890ff', fontSize: 32, fontWeight: 'bold' }}
                            prefix={<span style={{ fontSize: 14, color: '#52c41a', marginRight: 8 }}>+11%</span>}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Charts Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {/* Status Chart */}
                <Col xs={24} lg={16}>
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>Theo dõi trạng thái hiệu yêu cầu</span>}
                        bordered={false}
                        style={{ borderRadius: 8 }}
                        extra={
                            <Segmented
                                options={['Phân trăm', 'Số lượng']}
                                value={chartType}
                                onChange={(value) => setChartType(value as 'Phân trăm' | 'Số lượng')}
                            />
                        }
                    >
                        {renderBarChart()}
                    </Card>
                </Col>

                {/* Time to Process */}
                <Col xs={24} lg={8}>
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>Thời gian xử lý trung bình</span>}
                        bordered={false}
                        style={{ borderRadius: 8 }}
                    >
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Progress
                                type="dashboard"
                                percent={28}
                                strokeColor={{
                                    '0%': '#52c41a',
                                    '100%': '#52c41a',
                                }}
                                format={() => (
                                    <div>
                                        <div style={{ fontSize: 48, fontWeight: 'bold', color: '#000' }}>4</div>
                                        <div style={{ fontSize: 24, color: '#000' }}>ngày</div>
                                    </div>
                                )}
                                strokeWidth={12}
                                width={200}
                            />
                            <div style={{ marginTop: 20, color: '#52c41a', fontSize: 18, fontWeight: 600 }}>-10%</div>
                            <div style={{ marginTop: 8, color: '#999', fontSize: 14 }}>5 ngày</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Second Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {/* Priority Pie Chart */}
                <Col xs={24} lg={8}>
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>Phân loại yêu cầu theo mức độ ưu tiên</span>}
                        bordered={false}
                        style={{ borderRadius: 8 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                            {renderPieChart(priorityData)}
                        </div>
                    </Card>
                </Col>

                {/* Completion Percentage */}
                <Col xs={24} lg={8}>
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>% Hoàn thành đúng hạn</span>}
                        bordered={false}
                        style={{ borderRadius: 8 }}
                    >
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Progress
                                type="dashboard"
                                percent={94}
                                strokeColor={{
                                    '0%': '#ff4d4f',
                                    '100%': '#ff4d4f',
                                }}
                                format={(percent?: number) => (
                                    <div>
                                        <div style={{ fontSize: 56, fontWeight: 'bold', color: '#000' }}>{percent}%</div>
                                    </div>
                                )}
                                strokeWidth={12}
                                width={200}
                            />
                            <div style={{ marginTop: 20, color: '#ff4d4f', fontSize: 18, fontWeight: 600 }}>-5,2%</div>
                        </div>
                    </Card>
                </Col>

                {/* Device Status */}
                <Col xs={24} lg={8}>
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>Tình trạng thiết bị sau bảo trì</span>}
                        bordered={false}
                        style={{ borderRadius: 8 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                            {renderPieChart(deviceStatusData)}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Bottom Row */}
            <Row gutter={[16, 16]}>
                {/* Cost Chart */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>Chi phí bảo trì theo thời gian</span>}
                        bordered={false}
                        style={{ borderRadius: 8 }}
                    >
                        <div style={{ padding: '20px 0', textAlign: 'center' }}>
                            <div style={{
                                width: '100%',
                                height: 300,
                                background: 'linear-gradient(180deg, rgba(24,144,255,0.1) 0%, rgba(255,122,69,0.2) 50%, rgba(145,213,255,0.1) 100%)',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Simulated area chart effect */}
                                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                                    <path
                                        d="M 0,150 Q 100,100 200,120 T 400,110 T 600,140 T 800,100 L 800,300 L 0,300 Z"
                                        fill="rgba(255,122,69,0.3)"
                                        stroke="#ff7a45"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M 0,180 Q 100,150 200,160 T 400,150 T 600,180 T 800,160 L 800,300 L 0,300 Z"
                                        fill="rgba(24,144,255,0.3)"
                                        stroke="#1890ff"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M 0,220 Q 100,200 200,210 T 400,200 T 600,220 T 800,210 L 800,300 L 0,300 Z"
                                        fill="rgba(145,213,255,0.3)"
                                        stroke="#91d5ff"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: 12, height: 12, background: '#ff7a45', marginRight: 6 }} />
                                    <span style={{ fontSize: 12 }}>Tổng chi phí</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: 12, height: 12, background: '#1890ff', marginRight: 6 }} />
                                    <span style={{ fontSize: 12 }}>Chi phí vật tư</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: 12, height: 12, background: '#91d5ff', marginRight: 6 }} />
                                    <span style={{ fontSize: 12 }}>Chi phí thuê ngoài</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Technician Workload */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>Top 5 khối lượng công việc của kỹ thuật viên</span>}
                        bordered={false}
                        style={{ borderRadius: 8 }}
                    >
                        {renderTechnicianChart()}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;