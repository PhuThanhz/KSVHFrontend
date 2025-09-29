import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  DownOutlined,
  EllipsisOutlined,
  HomeOutlined,
  PlusOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  EditOutlined,
  CalendarOutlined,
  ToolOutlined,
  FolderOpenOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useSidebar } from "../../context/SidebarContext";
import { PATHS } from "../../constants/paths";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  badgeCount?: number;
  subItems?: { name: string; path: string; badgeCount?: number }[];
  divider?: boolean; // Thêm divider trước mục này
};

// =======================
// MENU CHÍNH
// =======================
const navItems: NavItem[] = [
  { icon: <HomeOutlined />, name: "Trang chủ", path: PATHS.HOME },
  { icon: <PlusOutlined />, name: "Tạo yêu cầu bảo trì", path: PATHS.CREATE_REQUEST },
  { icon: <FileTextOutlined />, name: "Yêu cầu bảo trì", path: PATHS.REQUESTS, badgeCount: 5 },
  { icon: <CheckCircleOutlined />, name: "Xác nhận phân công", path: PATHS.ASSIGN_CONFIRM, badgeCount: 2 },
  { icon: <EditOutlined />, name: "Cập nhật thông tin khảo sát", path: PATHS.SURVEY_UPDATE, badgeCount: 2 },
  { icon: <AppstoreOutlined />, name: "Tạo kế hoạch bảo trì", path: PATHS.CREATE_PLAN, badgeCount: 2 },
  { icon: <CheckCircleOutlined />, name: "Phê duyệt kế hoạch bảo trì", path: PATHS.APPROVE_PLAN, badgeCount: 3 },
  { icon: <CheckCircleOutlined />, name: "Nghiệm thu", path: PATHS.ACCEPTANCE, badgeCount: 7 },
  { icon: <CalendarOutlined />, name: "Lịch sử bảo trì/sửa chữa", path: PATHS.HISTORY },
  { icon: <CalendarOutlined />, name: "Lịch bảo trì định kỳ", path: PATHS.PERIODIC_MAINTENANCE, badgeCount: 5 },

  // Divider trước nhóm quản lý
  {
    icon: <ToolOutlined />,
    name: "Quản lý thiết bị/công cụ dụng cụ",
    path: PATHS.EQUIPMENT_MANAGEMENT,
    divider: true,
  },
  {
    icon: <FolderOpenOutlined />,
    name: "Quản lý danh mục",
    subItems: [
      { name: "Danh mục thiết bị", path: PATHS.CATEGORY_EQUIPMENT },
      { name: "Danh mục phụ tùng", path: PATHS.CATEGORY_PARTS },
    ],
  },
  { icon: <BarChartOutlined />, name: "Báo cáo", path: PATHS.REPORT },
];
const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      const ref = subMenuRefs.current[key];
      if (ref) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: ref.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  // Render từng nhóm menu
  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col">
      {items.map((nav, index) => {
        const active = nav.path && isActive(nav.path);
        const isOpen = openSubmenu?.index === index;
        return (
          <li key={nav.name} className="mb-1"> {/* giảm khoảng cách */}
            {nav.divider && (
              <div className="my-2 border-t border-gray-200 border-gray-700" />  // divider ngăn cách
            )}
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`
                  group flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium
                  transition-all duration-300 ease-in-out
                  ${isOpen
                    ? "bg-gradient-to-r from-indigo-500/10 to-transparent text-indigo-600 shadow-inner"
                    : "hover:bg-gradient-to-r hover:from-indigo-500/5 hover:to-transparent hover:text-indigo-500"
                  }
                  ${!isExpanded && !isHovered ? "lg:justify-center" : ""}
                `}
              >
                <span
                  className={`text-lg transition-transform duration-300 ${isOpen ? "scale-110 text-indigo-500" : "group-hover:scale-105"}`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="ml-3 flex-1 text-left">{nav.name}</span>
                    <DownOutlined
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-500" : "group-hover:text-indigo-500"}`}
                    />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`
                    group flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium
                    transition-all duration-300 ease-in-out
                    ${active
                      ? "bg-gradient-to-r from-indigo-500/20 to-transparent text-indigo-600 shadow-inner"
                      : "hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-transparent hover:text-indigo-500"
                    }
                  `}
                >
                  <span
                    className={`text-lg transition-transform duration-300 ${active
                      ? "scale-110 text-indigo-500"
                      : "group-hover:scale-105 group-hover:text-indigo-500"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="ml-3 flex-1 flex justify-between items-center">
                      {nav.name}
                      {nav.badgeCount && nav.badgeCount > 0 && (
                        <span className="ml-2 rounded-full bg-red-500 text-white text-xs px-2 py-0.5">
                          {nav.badgeCount}
                        </span>
                      )}
                    </span>
                  )}
                </Link>
              )
            )}

            {/* Submenu */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el: HTMLDivElement | null) => {
                  subMenuRefs.current[`${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOpen ? `${subMenuHeight[`${index}`]}px` : "0px",
                }}
              >
                <ul className="mt-1 ml-7 space-y-1 border-l border-indigo-200 border-indigo-700 pl-4">
                  {nav.subItems.map((subItem) => {
                    const activeSub = isActive(subItem.path);
                    return (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`
                            flex items-center justify-between rounded-md px-3 py-2 text-sm
                            transition-all duration-300
                            ${activeSub
                              ? "bg-indigo-500/10 text-indigo-600 shadow-inner"
                              : "hover:bg-indigo-500/10 hover:text-indigo-500"
                            }
                          `}
                        >
                          {subItem.name}
                          {subItem.badgeCount && subItem.badgeCount > 0 && (
                            <span className="ml-2 rounded-full bg-red-500 text-white text-xs px-2 py-0.5">
                              {subItem.badgeCount}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`
    fixed mt-16 flex flex-col lg:mt-0 top-0 px-3
    left-0 bg-gray-100 text-gray-900
    h-screen border-r border-gray-200
    transition-[width,transform] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
    ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >


      {/* Logo */}
      <div
        className={`py-6 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <h3
          className="text-2xl font-extrabold text-pink-600 tracking-wide"
        >
          LOLUS CMMS
        </h3>
      </div>



      {/* Menu với no-scrollbar để ẩn thanh cuộn */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-4">
          <h2
            className={`
              mb-3 text-xs uppercase tracking-wide
              flex leading-[20px] text-gray-400 text-gray-500
              ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}
            `}
          >
            {isExpanded || isHovered || isMobileOpen ? "Menu" : <EllipsisOutlined />}
          </h2>
          {renderMenuItems(navItems)}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
