import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import SliderAdmin from './slider.admin';
import HeaderAdmin from './header.admin';
import { useAppSelector } from '@/redux/hooks';
import NotPermitted from '@/components/share/not-permitted';
import Loading from '@/components/share/loading';

const { Content } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');

    const { isAuthenticated, isLoading, user } = useAppSelector(state => state.account);
    const roleName = user?.role?.name;

    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location]);

    if (isLoading) return <Loading />;

    if (!isAuthenticated) {
        return <NotPermitted message="Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn." />;
    }

    const allowedRoles = ['SUPER_ADMIN', 'EMPLOYEE'];
    if (!allowedRoles.includes(roleName ?? '')) {
        return <NotPermitted message="Rất tiếc, nội dung bạn đang tìm không khả dụng hoặc đã bị hạn chế truy cập." />;
    }

    return (
        <Layout style={{ minHeight: '100vh' }} className="layout-admin">
            {!isMobile && (
                <SliderAdmin
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                />
            )}
            <Layout>
                {!isMobile && (
                    <HeaderAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
                )}
                <Content style={{ padding: '15px' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
