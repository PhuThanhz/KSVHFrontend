import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import SliderAdmin from "./slider.admin";
import HeaderAdmin from "./header.admin";
import { useAppSelector } from "@/redux/hooks";
import NotPermitted from "@/components/share/not-permitted";
import Loading from "@/components/common/loading/loading";

const { Content } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    const { isAuthenticated, isLoading, user } = useAppSelector(
        (state) => state.account
    );
    const roleName = user?.role?.name;

    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location]);

    if (isLoading) return <Loading />;

    if (!isAuthenticated)
        return (
            <NotPermitted message="Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn." />
        );

    const allowedRoles = ["SUPER_ADMIN", "EMPLOYEE"];
    if (!allowedRoles.includes(roleName ?? ""))
        return (
            <NotPermitted message="Bạn không có quyền truy cập nội dung này." />
        );

    return (
        <Layout className="min-h-screen bg-gray-50">
            <SliderAdmin
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <Layout className="transition-all duration-300 bg-gray-50">
                <HeaderAdmin
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />
                <Content className="m-0 bg-transparent">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
