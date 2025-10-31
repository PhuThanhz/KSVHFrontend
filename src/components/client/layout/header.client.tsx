import { useState, useEffect, useMemo } from 'react';
import {
    ContactsOutlined,
    FireOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    TwitterOutlined,
    HistoryOutlined,
    ToolOutlined,
} from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, Space, message, Menu, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from '../modal/manage.account';
import { useMyPurchaseHistoryQuery, useMyMaintenanceRequestsQuery } from '@/hooks/useCustomerPurchaseHistory';
import { PATHS } from '@/constants/paths';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const user = useAppSelector((state) => state.account.user);

    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);
    const [current, setCurrent] = useState(PATHS.CLIENT.HOME);
    const location = useLocation();

    // ========================= Gọi API lấy lịch sử mua hàng =========================
    const { data: dataPurchase, isLoading: loadingPurchase } = useMyPurchaseHistoryQuery();
    const purchaseHistory = useMemo(() => dataPurchase?.result ?? [], [dataPurchase]);

    // ========================= Gọi API lấy danh sách phiếu bảo trì =========================
    const { data: dataMaintenance, isLoading: loadingMaintenance } =
        useMyMaintenanceRequestsQuery("page=1&pageSize=10");
    const maintenanceRequests = useMemo(() => dataMaintenance?.result ?? [], [dataMaintenance]);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    const onClick: MenuProps['onClick'] = (e) => setCurrent(e.key);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate(PATHS.HOME);
        }
    };

    /** ========================= MENU CHÍNH ========================= */
    const items: MenuProps['items'] = [];

    /** ========================= DROPDOWN MENU (quyền khách hàng) ========================= */
    const itemsDropdown: MenuProps['items'] = [
        // Nếu có lịch sử mua hàng
        ...(isAuthenticated && !loadingPurchase && purchaseHistory.length > 0
            ? [
                {
                    label: <Link to={PATHS.CLIENT.PURCHASE_HISTORY}>Lịch sử mua hàng</Link>,
                    key: PATHS.CLIENT.PURCHASE_HISTORY,
                    icon: <HistoryOutlined />,
                },
            ]
            : []),

        // Nếu có phiếu bảo trì
        ...(isAuthenticated && !loadingMaintenance && maintenanceRequests.length > 0
            ? [
                {
                    label: <Link to={PATHS.CLIENT.MY_MAINTENANCE_REQUESTS}>Phiếu bảo trì của tôi</Link>,
                    key: PATHS.CLIENT.MY_MAINTENANCE_REQUESTS,
                    icon: <ToolOutlined />,
                },
            ]
            : []),

        // Quản lý tài khoản
        {
            label: (
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenManageAccount(true)}
                >
                    Quản lý tài khoản
                </label>
            ),
            key: 'manage-account',
            icon: <ContactsOutlined />,
        },

        // Nếu có quyền admin
        ...(user.role?.permissions?.length
            ? [
                {
                    label: <Link to={PATHS.ADMIN.ROOT}>Trang Quản Trị</Link>,
                    key: 'admin',
                    icon: <FireOutlined />,
                },
            ]
            : []),

        // Đăng xuất
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={handleLogout}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
            icon: <LogoutOutlined />,
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles['header-section']}>
                <div className={styles['container']}>
                    {!isMobile ? (
                        <div style={{ display: 'flex', gap: 30 }}>
                            <div className={styles['brand']}>
                                <FaReact
                                    onClick={() => navigate(PATHS.CLIENT.HOME)}
                                    title="AMMS"
                                />
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#fff',
                                            colorBgContainer: '#222831',
                                            colorText: '#a7a7a7',
                                        },
                                    }}
                                >
                                    <Menu
                                        onClick={onClick}
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                    />
                                </ConfigProvider>

                                <div className={styles['extra']}>
                                    {!isAuthenticated ? (
                                        <Link to={PATHS.LOGIN}>Đăng Nhập</Link>
                                    ) : (
                                        <Dropdown
                                            menu={{ items: itemsDropdown }}
                                            trigger={['click']}
                                        >
                                            <Space style={{ cursor: 'pointer' }}>
                                                <span>Welcome {user?.name}</span>
                                                <Avatar>
                                                    {user?.name
                                                        ?.substring(0, 2)
                                                        ?.toUpperCase()}
                                                </Avatar>
                                            </Space>
                                        </Dropdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles['header-mobile']}>
                            <span>AMMS</span>
                            <MenuFoldOutlined
                                onClick={() => setOpenMobileMenu(true)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Drawer
                title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="horizontal"
                    items={itemsMobiles}
                    overflowedIndicator={null}
                />
            </Drawer>

            <ManageAccount open={openManageAccount} onClose={setOpenManageAccount} />
        </>
    );
};

export default Header;
