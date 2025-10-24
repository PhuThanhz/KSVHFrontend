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

                // --- User ---
                ...(checkPermission(ALL_PERMISSIONS.USERS.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/user">Quản Lý Người Dùng</Link>,
                            key: "/admin/user",
                            icon: <UserOutlined />,
                        },
                    ]
                    : []),

                // --- Role ---
                ...(checkPermission(ALL_PERMISSIONS.ROLES.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/role">Quản lý vai trò</Link>,
                            key: "/admin/role",
                            icon: <ExceptionOutlined />,
                        },
                    ]
                    : []),

                // --- Permission ---
                ...(checkPermission(ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/permission">Quản lý phân quyền</Link>,
                            key: "/admin/permission",
                            icon: <ApiOutlined />,
                        },
                    ]
                    : []),

                // --- Company ---
                ...(checkPermission(ALL_PERMISSIONS.COMPANY?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/company">Quản lý công ty</Link>,
                            key: "/admin/company",
                            icon: <BankOutlined />,
                        },
                    ]
                    : []),

                // --- Department ---
                ...(checkPermission(ALL_PERMISSIONS.DEPARTMENT?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/department">Quản lý phòng ban</Link>,
                            key: "/admin/department",
                            icon: <ApartmentOutlined />,
                        },
                    ]
                    : []),

                // --- Asset Type ---
                ...(checkPermission(ALL_PERMISSIONS.ASSET_TYPE?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/asset-type">Quản lý loại thiết bị</Link>,
                            key: "/admin/asset-type",
                            icon: <DeploymentUnitOutlined />,
                        },
                    ]
                    : []),

                // --- Position (chức vụ) ---
                ...(checkPermission(ALL_PERMISSIONS.POSITION?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/position">Quản lý chức vụ</Link>,
                            key: "/admin/position",
                            icon: <TeamOutlined />,
                        },
                    ]
                    : []),
                ...(checkPermission(ALL_PERMISSIONS.EMPLOYEE.GET_PAGINATE)
                    ? [
                        {
                            label: <Link to="/admin/employee">Quản lý nhân viên</Link>,
                            key: "/admin/employee",
                            icon: <TeamOutlined />,
                        },
                    ]
                    : []),
                ...(checkPermission(ALL_PERMISSIONS.CUSTOMER?.GET_PAGINATE ?? {})
                    ? [
                        {
                            label: <Link to="/admin/customer">Quản lý khách hàng</Link>,
                            key: "/admin/customer",
                            icon: <TeamOutlined />,
                        },
                    ]
                    : []),
            ];

            setMenuItems(full);
        }
    }, [permissions]);

    return (
        <Sider theme="light" collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div
                style={{
                    height: 32,
                    margin: 16,
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 15,
                }}
            >
                <BugOutlined /> ADMIN
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
