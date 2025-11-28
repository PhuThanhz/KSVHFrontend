import { useState, useEffect } from "react";
import {
    ContactsOutlined,
    FireOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    HistoryOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Drawer,
    Dropdown,
    Space,
    message,
    Menu,
    ConfigProvider,
} from "antd";
import type { MenuProps } from "antd";
import { isMobile } from "react-device-detect";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import ManageAccount from "../modal/manage.account";
import { PATHS } from "@/constants/paths";
import { usePermission } from "@/hooks/usePermission";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.account);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [openManageAccount, setOpenManageAccount] = useState(false);
    const [current, setCurrent] = useState(PATHS.CLIENT.HOME);
    const location = useLocation();

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const avatarUrl = user?.avatar
        ? `${backendURL}/storage/AVATAR/${user.avatar}`
        : undefined;

    const { hasPermission } = usePermission?.() || { hasPermission: () => true };

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    const onClick: MenuProps["onClick"] = (e) => setCurrent(e.key);

    const handleLogout = async () => {
        try {
            await callLogout();
        } catch {
        } finally {
            localStorage.removeItem("access_token");
            sessionStorage.clear();
            dispatch(setLogoutAction());
            navigate(PATHS.HOME, { replace: true });
            message.success("Đăng xuất thành công");
        }
    };

    /** ========================= DROPDOWN MENU ========================= */
    const canViewPurchaseHistory = hasPermission(
        "UI_MODULE",
        "VIEW",
        "/ui/client/purchase-history"
    );
    const canViewMaintenance = hasPermission(
        "UI_MODULE",
        "VIEW",
        "/ui/client/maintenance/my-requests"
    );
    const canAccessAdmin = hasPermission(
        "UI_MODULE",
        "VIEW",
        "/ui/admin/dashboard"
    );
    const canAccessTechnician = hasPermission(
        "UI_MODULE",
        "VIEW",
        "/ui/technician/home"
    );

    const itemsDropdown: MenuProps["items"] = isAuthenticated
        ? [
            ...(canAccessTechnician
                ? [
                    {
                        label: (
                            <Link to={PATHS.TECHNICIAN.ROOT}>
                                Trang kỹ thuật viên
                            </Link>
                        ),
                        key: "technician",
                        icon: <ToolOutlined />,
                    },
                ]
                : []),
            ...(canViewPurchaseHistory
                ? [
                    {
                        label: (
                            <Link to={PATHS.CLIENT.PURCHASE_HISTORY}>
                                Lịch sử mua hàng
                            </Link>
                        ),
                        key: "purchase-history",
                        icon: <HistoryOutlined />,
                    },
                ]
                : []),
            ...(canViewMaintenance
                ? [
                    {
                        label: (
                            <Link to={PATHS.CLIENT.MY_MAINTENANCE_REQUESTS}>
                                Phiếu bảo trì của tôi
                            </Link>
                        ),
                        key: "maintenance",
                        icon: <ToolOutlined />,
                    },
                ]
                : []),
            {
                label: (
                    <span
                        className="cursor-pointer"
                        onClick={() => setOpenManageAccount(true)}
                    >
                        Quản lý tài khoản
                    </span>
                ),
                key: "manage-account",
                icon: <ContactsOutlined />,
            },
            ...(canAccessAdmin
                ? [
                    {
                        label: (
                            <Link to={PATHS.ADMIN.ROOT}>Trang Quản Trị</Link>
                        ),
                        key: "admin",
                        icon: <FireOutlined />,
                    },
                ]
                : []),
            {
                label: (
                    <span className="cursor-pointer" onClick={handleLogout}>
                        Đăng xuất
                    </span>
                ),
                key: "logout",
                icon: <LogoutOutlined />,
            },
        ]
        : [
            {
                label: <Link to={PATHS.LOGIN}>Đăng Nhập</Link>,
                key: "login",
            },
        ];

    const items: MenuProps["items"] = [];
    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            {/* Header Section */}
            <header className="bg-[#222831] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo + Text */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate(PATHS.CLIENT.HOME)}
                    >
                        <img
                            src="/logo/logo.png"
                            alt="AMMS Logo"
                            className="h-10 w-auto object-contain hover:opacity-80 transition-opacity duration-200"
                        />
                        {!isMobile && (
                            <span className="text-white font-bold text-lg leading-none">
                                AMMS
                            </span>
                        )}
                    </div>

                    {/* Desktop Menu & User */}
                    {!isMobile && (
                        <div className="flex items-center gap-6">
                            {/* Top Menu */}
                            {items.length > 0 && (
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: "#fff",
                                            colorBgContainer: "#222831",
                                            colorText: "#a7a7a7",
                                        },
                                    }}
                                >
                                    <Menu
                                        onClick={onClick}
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                        className="border-0 bg-transparent"
                                    />
                                </ConfigProvider>
                            )}

                            {/* User */}
                            {isAuthenticated ? (
                                <Dropdown
                                    menu={{ items: itemsDropdown }}
                                    trigger={["click"]}
                                >
                                    <Space className="cursor-pointer px-3 py-2 rounded-md hover:bg-[#393E46] transition-colors duration-200">
                                        <Avatar
                                            src={avatarUrl}
                                            alt={user?.name}
                                            className="border-2 border-[#61dafb]"
                                        >
                                            {!avatarUrl &&
                                                user?.name
                                                    ?.substring(0, 2)
                                                    ?.toUpperCase()}
                                        </Avatar>
                                        <span className="text-white font-medium">
                                            {user?.name || "Người dùng"}
                                        </span>
                                    </Space>
                                </Dropdown>
                            ) : (
                                <Link
                                    to={PATHS.LOGIN}
                                    className="text-white hover:text-[#61dafb] transition-colors duration-200 px-4 py-2 rounded-md hover:bg-[#393E46]"
                                >
                                    Đăng Nhập
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    {isMobile && (
                        <MenuFoldOutlined
                            onClick={() => setOpenMobileMenu(true)}
                            className="text-white text-2xl cursor-pointer hover:text-[#61dafb] transition-colors duration-200"
                        />
                    )}
                </div>
            </header>

            {/* Mobile Drawer */}
            <Drawer
                title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="inline"
                    items={itemsMobiles}
                />
            </Drawer>

            {/* Manage Account Modal */}
            <ManageAccount
                open={openManageAccount}
                onClose={setOpenManageAccount}
            />
        </>
    );
};

export default Header;
