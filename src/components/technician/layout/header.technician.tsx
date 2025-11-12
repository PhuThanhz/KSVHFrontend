import React, { useState } from "react";
import { Dropdown, Space, Avatar, message } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import { PATHS } from "@/constants/paths";

const HeaderTechnician: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.account);
    const [menuOpen, setMenuOpen] = useState(false);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    /** ======================= LOGOUT ======================= */
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

    /** ======================= MENU DROPDOWN ======================= */
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

    /** ======================= AVATAR XỬ LÝ ======================= */
    const avatarSrc = user?.avatar
        ? `${backendURL}/storage/AVATAR/${user.avatar}`
        : undefined;

    /** ======================= RENDER ======================= */
    return (
        <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-pink-50 to-white z-50 px-6 pt-6 pb-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 m-0">
                        Morning,{" "}
                        <span className="text-pink-500">
                            {user?.name?.split(" ").pop() || "Technician"}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Have a nice day!</p>
                </div>

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
        </header>
    );
};

export default HeaderTechnician;
