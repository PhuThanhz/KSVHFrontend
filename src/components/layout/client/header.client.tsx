import { useState, useEffect } from "react";
import {
    ContactsOutlined,
    FireOutlined,
    LogoutOutlined,
    HistoryOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import {
    Avatar,
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
import ManageAccount from "../../common/modal/manage.account";
import { PATHS } from "@/constants/paths";
import { usePermission } from "@/hooks/usePermission";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.account);
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
                    <span className="cursor-pointer text-red-500" onClick={handleLogout}>
                        Đăng xuất
                    </span>
                ),
                key: "logout",
                icon: <LogoutOutlined style={{ color: "#ff4d4f" }} />,
            },
        ]
        : [
            {
                label: <Link to={PATHS.LOGIN}>Đăng Nhập</Link>,
                key: "login",
            },
        ];

    const items: MenuProps["items"] = [];

    return (
        <>
            {/* ================= HEADER ================= */}
            <header className="bg-[#222831] sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* LOGO */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate(PATHS.CLIENT.HOME)}
                    >
                        <img
                            src="/logo/logo.png"
                            alt="AMMS Logo"
                            className="h-10 w-auto object-contain hover:opacity-85 transition-opacity"
                        />
                        {!isMobile && (
                            <span className="text-white font-bold text-lg tracking-wide">
                                AMMS
                            </span>
                        )}
                    </div>

                    {/* =============== USER =============== */}
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <Dropdown
                                menu={{ items: itemsDropdown }}
                                trigger={["click"]}
                                placement="bottomRight"
                            >
                                <Space
                                    className="cursor-pointer rounded-md px-3 py-2 hover:bg-[#393E46] transition-all duration-200"
                                    size={10}
                                >
                                    <Avatar
                                        src={avatarUrl}
                                        alt={user?.name}
                                        className="border-2 border-[#61dafb]"
                                        size={isMobile ? 36 : 40}
                                    >
                                        {!avatarUrl &&
                                            user?.name
                                                ?.substring(0, 2)
                                                ?.toUpperCase()}
                                    </Avatar>
                                    {!isMobile && (
                                        <span className="text-white font-medium text-sm truncate max-w-[160px]">
                                            {user?.name || "Người dùng"}
                                        </span>
                                    )}
                                </Space>
                            </Dropdown>
                        ) : (
                            <Link
                                to={PATHS.LOGIN}
                                className="text-white bg-[#61dafb]/10 hover:bg-[#61dafb]/20 border border-[#61dafb]/30 px-4 py-2 rounded-md transition-all text-sm font-medium"
                            >
                                Đăng Nhập
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* ================= MANAGE ACCOUNT MODAL ================= */}
            <ManageAccount
                open={openManageAccount}
                onClose={setOpenManageAccount}
            />
        </>
    );
};

export default Header;
