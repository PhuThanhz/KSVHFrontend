import React, { useEffect, useState } from "react";
import { Button, Dropdown, Space, Avatar, message, Badge, Tooltip } from "antd";
import {
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout, callFetchMyNotifications } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import { PATHS } from "@/constants/paths";
import NotificationPanel from "@/components/common/notification/NotificationPanel";
import type { INotification, IModelPaginate } from "@/types/backend";

interface IProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (val: boolean) => void;
}

const HeaderAdmin: React.FC<IProps> = ({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
}) => {
    const user = useAppSelector((s) => s.account.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [menuOpen, setMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const avatarSrc = user?.avatar
        ? `${backendURL}/storage/AVATAR/${user.avatar}`
        : undefined;

    /** ======== Logout ======== */
    const handleLogout = async () => {
        try {
            await callLogout();
        } finally {
            localStorage.removeItem("access_token");
            sessionStorage.clear();
            dispatch(setLogoutAction());
            navigate(PATHS.HOME, { replace: true });
            message.success("Đăng xuất thành công");
        }
    };

    /** ======== Gọi API lấy thông báo chưa đọc ======== */
    const fetchUnreadCount = async () => {
        try {
            const res = await callFetchMyNotifications(`page=0&size=50&sort=createdAt,desc`);
            const data = res.data as IModelPaginate<INotification>;
            if (data?.result) {
                const unread = data.result.filter((n) => !n.read).length;
                setUnreadCount(unread);
            }
        } catch (err) {
            console.error("Lỗi khi lấy số thông báo chưa đọc:", err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, []);

    /** ======== Dropdown user ======== */
    const menuItems = [
        {
            key: "home",
            label: (
                <Link to="/" className="flex items-center gap-2">
                    <HomeOutlined /> Trang chủ
                </Link>
            ),
        },
        {
            key: "logout",
            label: (
                <div
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-red-500"
                >
                    <LogoutOutlined /> Đăng xuất
                </div>
            ),
        },
    ];

    /** ======== JSX ======== */
    return (
        <header
            className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200 
                rounded-bl-xl rounded-br-xl transition-all duration-300"
        >
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                {/* ===== LEFT: Toggle / Brand ===== */}
                <div className="flex items-center gap-3">
                    <Button
                        type="text"
                        onClick={() =>
                            window.innerWidth < 1024
                                ? setMobileOpen(!mobileOpen)
                                : setCollapsed(!collapsed)
                        }
                        className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gray-100 transition-all"
                        style={{ border: "none" }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.6}
                            stroke="currentColor"
                            className="w-7 h-7 text-gray-700"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.5 6.5h17M3.5 12h17m-17 5.5h17"
                            />
                        </svg>
                    </Button>

                    {isMobile && (
                        <span className="text-blue-600 font-bold text-base">AMMS Admin</span>
                    )}
                </div>

                {/* ===== RIGHT: Notification + User ===== */}
                <Space size={isMobile ? 10 : 20} align="center">
                    {/* Thông báo */}
                    <Tooltip title="Thông báo" placement="bottomRight">
                        <Badge
                            count={unreadCount}
                            overflowCount={99}
                            offset={[-2, 5]}
                            style={{
                                backgroundColor: "#ff4d4f",
                                fontWeight: 600,
                            }}
                        >
                            <BellOutlined
                                className="text-xl text-gray-600 hover:text-blue-500 cursor-pointer transition-all"
                                onClick={() => setShowNotifications(!showNotifications)}
                            />
                        </Badge>
                    </Tooltip>

                    {/* User Dropdown */}
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={["click"]}
                        open={menuOpen}
                        onOpenChange={setMenuOpen}
                        placement="bottomRight"
                    >
                        <Space className="cursor-pointer hover:bg-gray-100 rounded-lg px-2 sm:px-3 py-1 sm:py-2 transition-all">
                            {!isMobile && (
                                <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                                    {user?.name || "Admin"}
                                </span>
                            )}
                            <Avatar
                                size={isMobile ? 32 : 40}
                                src={avatarSrc}
                                icon={!avatarSrc && <UserOutlined />}
                                className="border-2 border-blue-500"
                                style={{
                                    backgroundColor: avatarSrc ? "transparent" : "#1890ff",
                                }}
                            >
                                {!avatarSrc && user?.name?.substring(0, 2)?.toUpperCase()}
                            </Avatar>
                        </Space>
                    </Dropdown>
                </Space>
            </div>

            {/* ===== Notification Panel ===== */}
            {showNotifications && (
                <NotificationPanel
                    onClose={() => {
                        setShowNotifications(false);
                        fetchUnreadCount();
                    }}
                />
            )}
        </header>
    );
};

export default HeaderAdmin;
