// ===================== HeaderAdmin.tsx =====================
import React from 'react';
import { Button, Dropdown, Space, Avatar, message, Badge } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { PATHS } from '@/constants/paths';

interface IProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
    mobileOpen?: boolean;
    setMobileOpen?: (val: boolean) => void;
}

const HeaderAdmin: React.FC<IProps> = ({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen
}) => {
    const user = useAppSelector((state) => state.account.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL;

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

    const itemsDropdown = [
        {
            label: <Link to={'/'} className="flex items-center gap-2">
                <HomeOutlined />
                <span>Trang chủ</span>
            </Link>,
            key: 'home',
        },
        {
            label: (
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleLogout()}
                >
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                </div>
            ),
            key: 'logout',
        },
    ];

    const unreadCount = 3;

    const avatarSrc = user?.avatar
        ? `${backendURL}/storage/AVATAR/${user.avatar}`
        : undefined;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                {/* Left Section - Menu Toggle */}
                <div className="flex items-center gap-4">
                    <Button
                        type="text"
                        icon={
                            isMobile
                                ? <MenuFoldOutlined className="text-lg sm:text-xl" />
                                : collapsed
                                    ? <MenuUnfoldOutlined className="text-lg sm:text-xl" />
                                    : <MenuFoldOutlined className="text-lg sm:text-xl" />
                        }
                        onClick={() => {
                            if (isMobile && setMobileOpen) {
                                setMobileOpen(!mobileOpen);
                            } else {
                                setCollapsed(!collapsed);
                            }
                        }}
                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 hover:bg-gray-100 rounded-lg transition-colors"
                    />

                    {/* Brand on Mobile */}
                    {isMobile && (
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-base sm:text-lg">
                            <span>AMMS Admin</span>
                        </div>
                    )}
                </div>

                {/* Right Section - Notifications & User Menu */}
                <Space size={isMobile ? 12 : 20} align="center">
                    {/* Notifications */}
                    <Badge
                        count={unreadCount}
                        size={isMobile ? "small" : "default"}
                        offset={[-2, 2]}
                    >
                        <div
                            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                            onClick={() => message.info('Mở danh sách thông báo')}
                        >
                            <BellOutlined className="text-lg sm:text-xl text-gray-600 hover:text-blue-600 transition-colors" />
                        </div>
                    </Badge>

                    {/* User Menu */}
                    <Dropdown
                        menu={{ items: itemsDropdown }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Space className="cursor-pointer hover:bg-gray-100 rounded-lg px-2 sm:px-3 py-1 sm:py-2 transition-colors">
                            {!isMobile && (
                                <span className="text-sm font-medium text-gray-700 max-w-[120px] sm:max-w-[150px] truncate">
                                    {user?.name || 'Admin'}
                                </span>
                            )}
                            <Avatar
                                size={isMobile ? 32 : 40}
                                src={avatarSrc}
                                icon={!avatarSrc && <UserOutlined />}
                                className="border-2 border-blue-500"
                                style={{
                                    backgroundColor: avatarSrc ? 'transparent' : '#1890ff'
                                }}
                            >
                                {!avatarSrc && user?.name?.substring(0, 2)?.toUpperCase()}
                            </Avatar>
                        </Space>
                    </Dropdown>
                </Space>
            </div>
        </header>
    );
};

export default HeaderAdmin;