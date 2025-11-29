import React, { useEffect, useState } from "react";
import { Dropdown, Avatar, Badge, Tooltip, message } from "antd";
import { LogoutOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout, callFetchMyNotifications } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import { PATHS } from "@/constants/paths";
import NotificationPanel from "@/components/common/notification/NotificationPanel";
import type { INotification, IModelPaginate } from "@/types/backend";

const HeaderTechnician: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.account);

    const [menuOpen, setMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const handleLogout = async () => {
        try {
            await callLogout();
        } catch {
            // ignore
        } finally {
            localStorage.removeItem("access_token");
            sessionStorage.clear();
            dispatch(setLogoutAction());
            message.success("Đăng xuất thành công");
            navigate(PATHS.HOME, { replace: true });
        }
    };

    /** Gọi API để lấy số thông báo chưa đọc */
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

        // Cập nhật lại mỗi 60s
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, []);

    const dropdownItems: MenuProps["items"] = [
        {
            key: "info",
            label: (
                <div className="flex flex-col p-1">
                    <span className="font-bold text-gray-800">
                        {user?.name || "Kỹ thuật viên"}
                    </span>
                    <span className="text-xs text-gray-500">Kỹ thuật viên</span>
                </div>
            ),
            disabled: true,
        },
        { type: "divider" },
        {
            key: "logout",
            label: (
                <span
                    onClick={handleLogout}
                    className="text-red-500 flex items-center gap-2"
                >
                    <LogoutOutlined /> Đăng xuất
                </span>
            ),
        },
    ];

    const avatarSrc = user?.avatar
        ? `${backendURL}/storage/AVATAR/${user.avatar}`
        : undefined;

    return (
        <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-pink-50 to-white z-50 px-6 pt-6 pb-4 shadow-sm">
            <div className="flex items-center justify-between">
                {/* ====== LEFT SIDE ====== */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 m-0">
                        Morning,{" "}
                        <span className="text-pink-500">
                            {user?.name?.split(" ").pop() || "Technician"}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Have a nice day!</p>
                </div>

                {/* ====== RIGHT SIDE ====== */}
                <div className="flex items-center gap-6">
                    {/* Nút chuông thông báo */}
                    <Tooltip title="Thông báo" placement="bottomRight">
                        <Badge
                            count={unreadCount}
                            overflowCount={99}
                            size="default"
                            offset={[-2, 6]}
                            style={{
                                backgroundColor: "#ff4d4f",
                                fontWeight: 600,
                            }}
                        >
                            <BellOutlined
                                className="text-xl text-gray-600 hover:text-pink-500 cursor-pointer transition-all"
                                onClick={() => setShowNotifications(!showNotifications)}
                            />
                        </Badge>
                    </Tooltip>

                    {/* Avatar + Menu */}
                    <Dropdown
                        menu={{ items: dropdownItems }}
                        trigger={["click"]}
                        open={menuOpen}
                        onOpenChange={setMenuOpen}
                        placement="bottomRight"
                    >
                        <div className="cursor-pointer">
                            <Avatar
                                size={48}
                                src={avatarSrc}
                                icon={!avatarSrc && <UserOutlined />}
                                className={`shadow-md ${avatarSrc
                                    ? ""
                                    : "bg-gradient-to-br from-pink-400 to-orange-400 text-white font-bold"
                                    }`}
                            >
                                {!avatarSrc && user?.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                        </div>
                    </Dropdown>
                </div>
            </div>

            {/* Panel thông báo */}
            {showNotifications && (
                <NotificationPanel
                    onClose={() => {
                        setShowNotifications(false);
                        fetchUnreadCount(); // cập nhật lại khi đóng panel
                    }}
                />
            )}
        </header>
    );
};

export default HeaderTechnician;
