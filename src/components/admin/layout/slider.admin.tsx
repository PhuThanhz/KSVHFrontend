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
                // --- Quản lý người dùng ---
                ...((checkPermission(ALL_PERMISSIONS.USERS.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.EMPLOYEE.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.CUSTOMER?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.TECHNICIAN.GET_PAGINATE))
                    ? [
                        {
                            label: "Quản lý người dùng",
                            key: "/admin/user",
                            icon: <UserOutlined />,
                            children: [
                                ...(checkPermission(ALL_PERMISSIONS.USERS.GET_PAGINATE)
                                    ? [
                                        {
                                            label: <Link to="/admin/user">Tất cả người dùng</Link>,
                                            key: "/admin/user/all",
                                            icon: <UserOutlined />,
                                        },
                                    ]
                                    : []),
                                ...(checkPermission(ALL_PERMISSIONS.EMPLOYEE.GET_PAGINATE)
                                    ? [
                                        {
                                            label: <Link to="/admin/employee">Nhân viên</Link>,
                                            key: "/admin/employee",
                                            icon: <TeamOutlined />,
                                        },
                                    ]
                                    : []),
                                ...(checkPermission(ALL_PERMISSIONS.CUSTOMER?.GET_PAGINATE ?? {})
                                    ? [
                                        {
                                            label: <Link to="/admin/customer">Khách hàng</Link>,
                                            key: "/admin/customer",
                                            icon: <TeamOutlined />,
                                        },
                                    ]
                                    : []),
                                ...(checkPermission(ALL_PERMISSIONS.TECHNICIAN.GET_PAGINATE)
                                    ? [
                                        {
                                            label: <Link to="/admin/technician">Kỹ thuật viên</Link>,
                                            key: "/admin/technician",
                                            icon: <ToolOutlined />,
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),

                ...((checkPermission(ALL_PERMISSIONS.ROLES.GET_PAGINATE) ||
                    checkPermission(ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE))
                    ? [
                        {
                            label: "Cấu hình phân quyền",
                            key: "/admin/authorization",
                            icon: <ApiOutlined />,
                            children: [
                                ...(checkPermission(ALL_PERMISSIONS.ROLES.GET_PAGINATE)
                                    ? [
                                        {
                                            label: <Link to="/admin/role">Quản lý vai trò</Link>,
                                            key: "/admin/role",
                                            icon: <ExceptionOutlined />,
                                        },
                                    ]
                                    : []),
                                ...(checkPermission(ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE)
                                    ? [
                                        {
                                            label: <Link to="/admin/permission">Quản lý phân quyền</Link>,
                                            key: "/admin/permission",
                                            icon: <ApiOutlined />,
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),


                ...((checkPermission(ALL_PERMISSIONS.COMPANY?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.DEPARTMENT?.GET_PAGINATE ?? {}) ||
                    checkPermission(ALL_PERMISSIONS.POSITION?.GET_PAGINATE ?? {}))
                    ? [
                        {
                            label: "Cấu trúc tổ chức",
                            key: "/admin/organization",
                            icon: <ApartmentOutlined />,
                            children: [
                                ...(checkPermission(ALL_PERMISSIONS.COMPANY?.GET_PAGINATE ?? {})
                                    ? [
                                        {
                                            label: <Link to="/admin/company">Quản lý công ty</Link>,
                                            key: "/admin/company",
                                            icon: <BankOutlined />,
                                        },
                                    ]
                                    : []),
                                ...(checkPermission(ALL_PERMISSIONS.DEPARTMENT?.GET_PAGINATE ?? {})
                                    ? [
                                        {
                                            label: <Link to="/admin/department">Quản lý phòng ban</Link>,
                                            key: "/admin/department",
                                            icon: <ApartmentOutlined />,
                                        },
                                    ]
                                    : []),
                                ...(checkPermission(ALL_PERMISSIONS.POSITION?.GET_PAGINATE ?? {})
                                    ? [
                                        {
                                            label: <Link to="/admin/position">Quản lý chức vụ</Link>,
                                            key: "/admin/position",
                                            icon: <TeamOutlined />,
                                        },
                                    ]
                                    : []),
                            ],
                        },
                    ]
                    : []),

                ...(checkPermission(ALL_PERMISSIONS.SKILL.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/skill">Quản lý kỹ năng</Link>,
                            key: "/admin/skill",
                            icon: <ToolOutlined />,
                        },
                    ]
                    : []),

                ...(checkPermission(ALL_PERMISSIONS.ASSET_TYPE?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/asset-type">Quản lý loại tài sản</Link>,
                            key: "/admin/asset-type",
                            icon: <DeploymentUnitOutlined />,
                        },
                    ]
                    : []),



                ...(checkPermission(ALL_PERMISSIONS.DEVICE_TYPES.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/device-type">Quản lý loại thiết bị</Link>,
                            key: "/admin/device-type",
                            icon: <AppstoreAddOutlined />,
                        },
                    ]
                    : []),

                ...(checkPermission(ALL_PERMISSIONS.SOLUTION?.GET_PAGINATE ?? {})

                    ? [
                        {
                            label: <Link to="/admin/solution">Quản lý phương án xử lý</Link>,
                            key: "/admin/solution",
                            icon: <AppstoreAddOutlined />,
                        },
                    ]
                    : []),
                ...(checkPermission(ALL_PERMISSIONS.WAREHOUSE?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/warehouse">Quản lý kho</Link>,
                            key: "/admin/warehouse",
                            icon: <BankOutlined />,
                        },
                    ]
                    : []),
                ...(checkPermission(ALL_PERMISSIONS.UNIT.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/unit">Quản lý đơn vị</Link>,
                            key: "/admin/unit",
                            icon: <DeploymentUnitOutlined />,
                        },
                    ]
                    : []),
                // --- Reject Reason ---
                ...(checkPermission(ALL_PERMISSIONS.REJECT_REASON.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/reject-reason">Quản lý lý do từ chối</Link>,
                            key: "/admin/reject-reason",
                            icon: <StopOutlined />,
                        },
                    ]
                    : []),
                ...(checkPermission(ALL_PERMISSIONS.TECHNICIAN_SUPPLIER.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/technician-supplier">Quản lý nhà cung cấp kỹ thuật viên</Link>,
                            key: "/admin/technician-supplier",
                            icon: <ToolOutlined />,
                        },
                    ]
                    : []),

                ...(checkPermission(ALL_PERMISSIONS.ISSUE.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/issue">Quản lý vấn đề</Link>,
                            key: "/admin/issue",
                            icon: <ToolOutlined />,
                        },
                    ]
                    : []),

                ...(checkPermission(ALL_PERMISSIONS.MATERIAL_SUPPLIER?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/material-supplier">Quản lý nhà cung cấp vật tư</Link>,
                            key: "/admin/material-supplier",
                            icon: <ShopOutlined />,
                        },
                    ]
                    : []),

                ...(checkPermission(ALL_PERMISSIONS.INVENTORY_ITEM.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/inventory-items">Quản lý vật tư tồn kho</Link>,
                            key: "/admin/inventory-items",
                            icon: <AppstoreOutlined />,
                        },
                    ]
                    : []),

                ...(checkPermission(ALL_PERMISSIONS.DEVICE.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/device">Quản lý thiết bị</Link>,
                            key: "/admin/device",
                            icon: <LaptopOutlined />,
                        },
                    ]
                    : []),
                ...(checkPermission(ALL_PERMISSIONS.SHIFT_TEMPLATE?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/shift-template">Quản lý ca làm việc mẫu</Link>,
                            key: "/admin/shift-template",
                            icon: <AppstoreOutlined />,
                        },
                    ]
                    : []),

                ...(checkPermission(ALL_PERMISSIONS.TECHNICIAN_AVAILABILITY?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/technician-availability">Ca làm việc kỹ thuật viên</Link>,
                            key: "/admin/technician-availability",
                            icon: <ToolOutlined />,
                        },
                    ]
                    : []),
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
