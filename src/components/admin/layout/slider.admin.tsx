import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
    AppstoreOutlined,
    UserOutlined,
    TeamOutlined,
    ApiOutlined,
    ExceptionOutlined,
    BankOutlined,
    ApartmentOutlined,
    DeploymentUnitOutlined,
    BugOutlined,
    AppstoreAddOutlined,
    ToolOutlined,
    StopOutlined,
    ShopOutlined,
    LaptopOutlined,
    HistoryOutlined,
    NodeIndexOutlined,
    CheckCircleOutlined,
    SettingOutlined,
    InboxOutlined,
    SolutionOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { ALL_PERMISSIONS } from "@/config/permissions";

const { Sider } = Layout;

interface IProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
    activeMenu: string;
    setActiveMenu: (val: string) => void;
}

const SliderAdmin: React.FC<IProps> = ({
    collapsed,
    setCollapsed,
    activeMenu,
    setActiveMenu,
}) => {
    const permissions = useAppSelector((state) => state.account.user.role.permissions);
    const [menuItems, setMenuItems] = useState<any[]>([]);

    useEffect(() => {
        const ACL_ENABLE = import.meta.env.VITE_ACL_ENABLE;

        if (permissions?.length || ACL_ENABLE === "false") {
            const checkPermission = (perm: any) =>
                permissions?.find(
                    (item) =>
                        item.apiPath === perm.apiPath && item.method === perm.method
                ) || ACL_ENABLE === "false";

            const full = [
                {
                    label: <Link to="/admin">Dashboard</Link>,
                    key: "/admin",
                    icon: <AppstoreOutlined />,
                },

                // ========== QUẢN LÝ NGƯỜI DÙNG ==========
                ...(checkPermission(ALL_PERMISSIONS.USERS.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.EMPLOYEE.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.CUSTOMER?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.CUSTOMER_PURCHASE_HISTORY?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.TECHNICIAN.GET_PAGINATE)
                    ? [
                        {
                            label: "Quản lý người dùng",
                            key: "/admin/user-group",
                            icon: <UserOutlined />,
                            children: [
                                ...(checkPermission(ALL_PERMISSIONS.USERS.GET_PAGINATE)
                                    ? [{
                                        label: <Link to="/admin/user">Tất cả người dùng</Link>,
                                        key: "/admin/user",
                                        icon: <UserOutlined />,
                                    }] : []),
                                ...(checkPermission(ALL_PERMISSIONS.EMPLOYEE.GET_PAGINATE)
                                    ? [{
                                        label: <Link to="/admin/employee">Nhân viên</Link>,
                                        key: "/admin/employee",
                                        icon: <TeamOutlined />,
                                    }] : []),
                                ...(checkPermission(ALL_PERMISSIONS.CUSTOMER?.GET_PAGINATE ?? {})
                                    ? [{
                                        label: <Link to="/admin/customer">Khách hàng</Link>,
                                        key: "/admin/customer",
                                        icon: <TeamOutlined />,
                                    }] : []),
                                ...(checkPermission(ALL_PERMISSIONS.CUSTOMER_PURCHASE_HISTORY?.GET_PAGINATE ?? {})
                                    ? [{
                                        label: <Link to="/admin/customer-purchase-history">Lịch sử mua hàng</Link>,
                                        key: "/admin/customer-purchase-history",
                                        icon: <HistoryOutlined />,
                                    }] : []),
                                ...(checkPermission(ALL_PERMISSIONS.TECHNICIAN.GET_PAGINATE)
                                    ? [{
                                        label: <Link to="/admin/technician">Kỹ thuật viên</Link>,
                                        key: "/admin/technician",
                                        icon: <ToolOutlined />,
                                    }] : []),
                                ...(checkPermission(ALL_PERMISSIONS.TECHNICIAN_AVAILABILITY?.GET_PAGINATE ?? {})
                                    ? [{
                                        label: <Link to="/admin/technician-availability">Ca làm việc KTV</Link>,
                                        key: "/admin/technician-availability",
                                        icon: <ToolOutlined />,
                                    }] : []),
                            ],
                        },
                    ] : []),

                // ========== QUẢN LÝ BẢO TRÌ ==========
                ...(checkPermission(ALL_PERMISSIONS.MAINTENANCE_REQUESTS?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.MAINTENANCE_APPROVAL?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.MAINTENANCE_CAUSE?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.SOLUTION?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.ISSUE.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.MAINTENANCE_EXECUTION_ADMIN?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.ISSUE_SKILL_MAPPING.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.MAINTENANCE_HISTORY.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.MAINTENANCE_ACCEPTANCE?.GET_PAGINATE ?? {})
                    ? [{
                        label: "Quản lý bảo trì",
                        key: "/admin/maintenance-group",
                        icon: <ToolOutlined />,
                        children: [
                            ...(checkPermission(ALL_PERMISSIONS.MAINTENANCE_REQUESTS?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/maintenance">Yêu cầu bảo trì</Link>,
                                    key: "/admin/maintenance",
                                    icon: <ToolOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.MAINTENANCE_APPROVAL?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/maintenance-approval">Phê duyệt kế hoạch</Link>,
                                    key: "/admin/maintenance-approval",
                                    icon: <CheckCircleOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.MAINTENANCE_EXECUTION_ADMIN?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/maintenance-execution">Theo dõi thi công </Link>,
                                    key: "/admin/maintenance-execution",
                                    icon: <SolutionOutlined />,
                                }]
                                : []),
                            ...(checkPermission(ALL_PERMISSIONS.MAINTENANCE_ACCEPTANCE?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/maintenance-acceptance">Nghiệm thu</Link>,
                                    key: "/admin/maintenance-acceptance",
                                    icon: <CheckCircleOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.MAINTENANCE_HISTORY?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/maintenance-history">lịch sử bảo trì</Link>,
                                    key: "/admin/maintenance-history",
                                    icon: <CheckCircleOutlined />,
                                }] : []),

                            ...(checkPermission(ALL_PERMISSIONS.ISSUE.GET_PAGINATE)
                                ? [{
                                    label: <Link to="/admin/issue">Quản lý vấn đề</Link>,
                                    key: "/admin/issue",
                                    icon: <BugOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.MAINTENANCE_CAUSE?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/maintenance-cause">Nguyên nhân hư hỏng</Link>,
                                    key: "/admin/maintenance-cause",
                                    icon: <BugOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.SOLUTION?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/solution">Phương án xử lý</Link>,
                                    key: "/admin/solution",
                                    icon: <SolutionOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.ISSUE_SKILL_MAPPING.GET_PAGINATE)
                                ? [{
                                    label: <Link to="/admin/issue-skill-mapping">Phân công tự động</Link>,
                                    key: "/admin/issue-skill-mapping",
                                    icon: <NodeIndexOutlined />,
                                }] : []),
                        ],
                    }] : []),

                // ========== QUẢN LÝ THIẾT BỊ & TÀI SẢN ==========
                ...(checkPermission(ALL_PERMISSIONS.DEVICE.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.DEVICE_TYPES.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.ASSET_TYPE?.GET_PAGINATE ?? {})
                    ? [{
                        label: "Quản lý thiết bị & tài sản",
                        key: "/admin/device-asset-group",
                        icon: <LaptopOutlined />,
                        children: [
                            ...(checkPermission(ALL_PERMISSIONS.DEVICE.GET_PAGINATE)
                                ? [{
                                    label: <Link to="/admin/device">Thiết bị</Link>,
                                    key: "/admin/device",
                                    icon: <LaptopOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.DEVICE_TYPES.GET_PAGINATE)
                                ? [{
                                    label: <Link to="/admin/device-type">Loại thiết bị</Link>,
                                    key: "/admin/device-type",
                                    icon: <AppstoreAddOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.ASSET_TYPE?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/asset-type">Loại tài sản</Link>,
                                    key: "/admin/asset-type",
                                    icon: <DeploymentUnitOutlined />,
                                }] : []),
                        ],
                    }] : []),

                // ========== QUẢN LÝ KHO & VẬT TƯ ==========
                ...(checkPermission(ALL_PERMISSIONS.WAREHOUSE?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.INVENTORY_ITEM.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.MATERIAL_SUPPLIER?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.UNIT.GET_PAGINATE)
                    ? [{
                        label: "Quản lý kho & vật tư",
                        key: "/admin/inventory-group",
                        icon: <InboxOutlined />,
                        children: [
                            ...(checkPermission(ALL_PERMISSIONS.WAREHOUSE?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/warehouse">Kho</Link>,
                                    key: "/admin/warehouse",
                                    icon: <BankOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.INVENTORY_ITEM.GET_PAGINATE)
                                ? [{
                                    label: <Link to="/admin/inventory-items">Vật tư tồn kho</Link>,
                                    key: "/admin/inventory-items",
                                    icon: <AppstoreOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.MATERIAL_SUPPLIER?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/material-supplier">Nhà cung cấp vật tư</Link>,
                                    key: "/admin/material-supplier",
                                    icon: <ShopOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.UNIT.GET_PAGINATE)
                                ? [{
                                    label: <Link to="/admin/unit">Đơn vị</Link>,
                                    key: "/admin/unit",
                                    icon: <DeploymentUnitOutlined />,
                                }] : []),
                        ],
                    }] : []),

                // ========== CẤU TRÚC TỔ CHỨC ==========
                ...(checkPermission(ALL_PERMISSIONS.COMPANY?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.DEPARTMENT?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.POSITION?.GET_PAGINATE ?? {})
                    ? [{
                        label: "Cấu trúc tổ chức",
                        key: "/admin/organization",
                        icon: <ApartmentOutlined />,
                        children: [
                            ...(checkPermission(ALL_PERMISSIONS.COMPANY?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/company">Công ty</Link>,
                                    key: "/admin/company",
                                    icon: <BankOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.DEPARTMENT?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/department">Phòng ban</Link>,
                                    key: "/admin/department",
                                    icon: <ApartmentOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.POSITION?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/position">Chức vụ</Link>,
                                    key: "/admin/position",
                                    icon: <TeamOutlined />,
                                }] : []),
                        ],
                    }] : []),

                // ========== HỆ THỐNG & CẤU HÌNH ==========
                ...(checkPermission(ALL_PERMISSIONS.ROLES.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.SKILL.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.SHIFT_TEMPLATE?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.REJECT_REASON.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.GET_PAGINATE)
                    ? [{
                        label: "Hệ thống & cấu hình",
                        key: "/admin/system-config",
                        icon: <SettingOutlined />,
                        children: [
                            ...(checkPermission(ALL_PERMISSIONS.ROLES.GET_PAGINATE) ||
                                checkPermission(ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE)
                                ? [{
                                    label: "Phân quyền",
                                    key: "/admin/authorization",
                                    icon: <ApiOutlined />,
                                    children: [
                                        ...(checkPermission(ALL_PERMISSIONS.ROLES.GET_PAGINATE)
                                            ? [{
                                                label: <Link to="/admin/role">Vai trò</Link>,
                                                key: "/admin/role",
                                                icon: <ExceptionOutlined />,
                                            }] : []),
                                        ...(checkPermission(ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE)
                                            ? [{
                                                label: <Link to="/admin/permission">Quyền hạn</Link>,
                                                key: "/admin/permission",
                                                icon: <ApiOutlined />,
                                            }] : []),
                                    ],
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.SKILL.GET_PAGINATE)
                                ? [{
                                    label: <Link to="/admin/skill">Kỹ năng</Link>,
                                    key: "/admin/skill",
                                    icon: <ToolOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.SHIFT_TEMPLATE?.GET_PAGINATE ?? {})
                                ? [{
                                    label: <Link to="/admin/shift-template">Ca làm việc mẫu</Link>,
                                    key: "/admin/shift-template",
                                    icon: <AppstoreOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.REJECT_REASON.GET_PAGINATE)
                                ? [{
                                    label: <Link to="/admin/reject-reason">Lý do từ chối</Link>,
                                    key: "/admin/reject-reason",
                                    icon: <StopOutlined />,
                                }] : []),
                            ...(checkPermission(ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.GET_PAGINATE)
                                ? [{
                                    label: <Link to="/admin/technician-supplier">NCC kỹ thuật viên</Link>,
                                    key: "/admin/technician-supplier",
                                    icon: <ShopOutlined />,
                                }] : []),
                        ],
                    }] : []),
            ];

            setMenuItems(full);
        }
    }, [permissions]);

    return (
        <Sider
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={250}
            collapsedWidth={80}
        >
            <div
                style={{
                    height: 32,
                    margin: 16,
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 15,
                }}
            >
                <BugOutlined /> AMMS
            </div>
            <Menu
                selectedKeys={[activeMenu]}
                mode="inline"
                items={menuItems}
                onClick={(e) => setActiveMenu(e.key)}
            />
        </Sider>
    );
};

export default SliderAdmin;