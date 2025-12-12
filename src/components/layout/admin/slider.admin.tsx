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
  setMobileOpen = () => {},
}) => {
  const permissions = useAppSelector(
    (state) => state.account.user.role.permissions
  );

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  /** ======== Khởi tạo menu theo quyền ======== */
  useEffect(() => {
    const items = generateMenuItems(permissions);
    setMenuItems(items);
  }, [permissions]);

  /** ======== Responsive resize ======== */
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

  /** ======== Auto mở nhóm khi đổi route ======== */
  useEffect(() => {
    const parts = activeMenu.split("/").filter(Boolean);
    if (parts.length >= 3) {
      const parent = "/" + parts.slice(0, 3).join("/");
      setOpenKeys([parent]);
    }
  }, [activeMenu]);

  /** ======== Logo ======== */
  const Logo = (
    <div className="flex items-center justify-center h-16 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-2">
        <img
          src="/logo/logo.png"
          alt="AMMS Logo"
          className={`transition-all ${collapsed && !isMobile ? "w-8" : "w-10"}`}
        />
        {!collapsed && (
          <span className="font-semibold text-gray-800 text-base tracking-tight">
            AMMS
          </span>
        )}
      </div>
    </div>
  );

  /** ======== Menu chính ======== */
  const MenuList = (
    <Menu
      mode="inline"
      theme="light"
      items={menuItems}
      selectedKeys={[activeMenu]}
      openKeys={openKeys}
      onOpenChange={(keys) => setOpenKeys(keys)}
      onClick={(e) => {
        setActiveMenu(e.key);
        if (isMobile) setMobileOpen(false);
      }}
      className="border-none bg-transparent text-gray-700
        [&_.ant-menu-item-selected]:bg-blue-50 
        [&_.ant-menu-item-selected]:text-blue-600
        [&_.ant-menu-submenu-title]:text-gray-800
        [&_.ant-menu-submenu-selected>.ant-menu-submenu-title]:!text-gray-800 
        [&_.ant-menu-submenu-selected>.ant-menu-submenu-title]:!bg-transparent
        [&_.ant-menu-submenu>.ant-menu>:not(.ant-menu-item-selected)]:text-gray-700
        [&_.ant-menu-title-content]:font-medium"
    />
  );

  /** ======== Giao diện mobile (Drawer) ======== */
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={260}
        bodyStyle={{ padding: 0, background: "#fff" }}
        className="custom-drawer"
        closeIcon={null}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <img src="/logo/logo.png" alt="AMMS Logo" className="w-8" />
            <span className="font-semibold text-gray-800 text-lg">AMMS</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 transition-all"
          >
            <CloseOutlined className="text-gray-600 text-lg" />
          </button>
        </div>
        {MenuList}
      </Drawer>
    );
  }

  /** ======== Giao diện desktop (Sider) — ĐÃ FIX KHÔNG TỰ THU ======== */
  return (
    <Sider
      theme="light"
      collapsed={collapsed}
      width={250}
      collapsedWidth={80}
      className="!sticky top-0 h-screen bg-white border-r border-gray-200 shadow-sm transition-all"
    >
      {Logo}
      <div className="overflow-y-auto h-[calc(100vh-64px)]">{MenuList}</div>
    </Sider>
  );
};

export default SliderAdmin;
