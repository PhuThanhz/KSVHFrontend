import React from 'react';
import { Button, Dropdown, Space, Avatar, message, Badge } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { PATHS } from '@/constants/paths';

interface IProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
}

const HeaderAdmin: React.FC<IProps> = ({ collapsed, setCollapsed }) => {
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
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: (
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleLogout()}
                >
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
    ];

    const unreadCount = 3;

    const avatarSrc = user?.avatar
        ? `${backendURL}/storage/AVATAR/${user.avatar}`
        : undefined;

    return (
        <div
            className='admin-header'
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginRight: 20,
                alignItems: 'center',
                height: 64,
            }}
        >
            {/* Nút thu/phóng sidebar */}
            <Button
                type='text'
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />

            <Space size={20} align='center'>
                <Badge count={unreadCount} size='small' offset={[-3, 5]}>
                    <BellOutlined
                        style={{
                            fontSize: 20,
                            cursor: 'pointer',
                            color: '#595959',
                        }}
                        onClick={() => message.info('Mở danh sách thông báo')}
                    />
                </Badge>

                <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                    <Space style={{ cursor: 'pointer' }}>
                        <span>Welcome {user?.name}</span>
                        <Avatar
                            src={avatarSrc}
                            icon={!avatarSrc && <UserOutlined />}
                            style={{ backgroundColor: avatarSrc ? 'transparent' : '#87d068' }}
                        >
                            {!avatarSrc && user?.name?.substring(0, 2)?.toUpperCase()}
                        </Avatar>
                    </Space>
                </Dropdown>
            </Space>
        </div>
    );
};

export default HeaderAdmin;
