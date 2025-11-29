import React, { useEffect, useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import { useAppSelector } from "@/redux/hooks";
import { generateMenuItems } from "./menuItems";
import { CloseOutlined } from "@ant-design/icons";

const { Sider } = Layout;

interface IProps {
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
    activeMenu: string;
    setActiveMenu: (val: string) => void;
    mobileOpen?: boolean;
    setMobileOpen?: (val: boolean) => void;
}

const SliderAdmin: React.FC<IProps> = ({
    collapsed,
    setCollapsed,
    activeMenu,
    setActiveMenu,
    mobileOpen = false,
    setMobileOpen = () => { },
}) => {
    const permissions = useAppSelector(
        (state) => state.account.user.role.permissions
    );
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        setMenuItems(generateMenuItems(permissions));
    }, [permissions]);
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setMobileOpen(false);
            }
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const Logo = (
        <div className="flex items-center justify-center h-20 border-b border-gray-100 bg-white rounded-tl-xl">
            <div className="flex items-center gap-2">
                <img
                    src="/logo/logo.png"
                    alt="AMMS Logo"
                    className={`transition-all ${collapsed && !isMobile ? "w-10" : "w-12"}`}
                />
                {!collapsed && (
                    <span className="font-semibold text-lg text-gray-800">AMMS</span>
                )}
            </div>
        </div>
    );

    const MenuList = (
        <Menu
            selectedKeys={[activeMenu]}
            mode="inline"
            items={menuItems}
            onClick={(e) => {
                setActiveMenu(e.key);
                if (isMobile) setMobileOpen(false);
            }}
            className="border-none text-gray-700"
        />
    );

    return isMobile ? (
        <Drawer
            placement="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            width={260}
            bodyStyle={{ padding: 0 }}
            className="[&_.ant-drawer-body]:p-0"
            closeIcon={null}
        >
            {/* Header Drawer */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white rounded-tl-xl rounded-tr-xl">
                <div className="flex items-center gap-2">
                    <img src="/logo/logo.png" alt="AMMS Logo" className="w-8" />
                    <span className="font-semibold text-lg text-gray-800">AMMS</span>
                </div>
                <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                    <CloseOutlined className="text-gray-600 text-lg" />
                </button>
            </div>
            {MenuList}
        </Drawer>
    ) : (
        <Sider
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={250}
            collapsedWidth={80}
            className="!sticky top-0 h-screen bg-white border-r border-gray-100 shadow-sm transition-all rounded-tl-xl"
        >
            {Logo}
            {MenuList}
        </Sider>
    );
};

export default SliderAdmin;
