import { useState, useEffect } from "react";
import {
    ContactsOutlined,
    FireOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    HistoryOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Drawer,
    Dropdown,
    Space,
    message,
    Menu,
    ConfigProvider,
} from "antd";
import type { MenuProps } from "antd";
import styles from "@/styles/client.module.scss";
import { isMobile } from "react-device-detect";
import { FaReact } from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callLogout } from "@/config/api";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import ManageAccount from "../modal/manage.account";
import { PATHS } from "@/constants/paths";
import { usePermission } from "@/hooks/usePermission";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.account);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [openManageAccount, setOpenManageAccount] = useState(false);
    const [current, setCurrent] = useState(PATHS.CLIENT.HOME);
    const location = useLocation();

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const avatarUrl = user?.avatar
        ? `${backendURL}/storage/AVATAR/${user.avatar}`
        : undefined;

    const { hasPermission } = usePermission?.() || { hasPermission: () => true };

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    const onClick: MenuProps["onClick"] = (e) => setCurrent(e.key);

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

    /** ========================= DROPDOWN MENU ========================= */
    const canViewPurchaseHistory = hasPermission(
        "UI_MODULE",
        "VIEW",
        "/ui/client/purchase-history"
    );
    const canViewMaintenance = hasPermission(
        "UI_MODULE",
        "VIEW",
        "/ui/client/maintenance/my-requests"
    );
    const canAccessAdmin = hasPermission(
        "UI_MODULE",
        "VIEW",
        "/ui/admin/dashboard"
    );
    const canAccessTechnician = hasPermission(
        "UI_MODULE",
        "VIEW",
        "/ui/technician/home"
    );

    const itemsDropdown: MenuProps["items"] = isAuthenticated
        ? [
            ...(canAccessTechnician
                ? [
                    {
                        label: (
                            <Link to={PATHS.TECHNICIAN.ROOT}>
                                Trang kỹ thuật viên
                            </Link>
                        ),
                        key: "technician",
                        icon: <ToolOutlined />,
                    },
                ]
                : []),
            ...(canViewPurchaseHistory
                ? [
                    {
                        label: (
                            <Link to={PATHS.CLIENT.PURCHASE_HISTORY}>
                                Lịch sử mua hàng
                            </Link>
                        ),
                        key: "purchase-history",
                        icon: <HistoryOutlined />,
                    },
                ]
                : []),
            ...(canViewMaintenance
                ? [
                    {
                        label: (
                            <Link to={PATHS.CLIENT.MY_MAINTENANCE_REQUESTS}>
                                Phiếu bảo trì của tôi
                            </Link>
                        ),
                        key: "maintenance",
                        icon: <ToolOutlined />,
                    },
                ]
                : []),
            {
                label: (
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpenManageAccount(true)}
                    >
                        Quản lý tài khoản
                    </span>
                ),
                key: "manage-account",
                icon: <ContactsOutlined />,
            },
            ...(canAccessAdmin
                ? [
                    {
                        label: (
                            <Link to={PATHS.ADMIN.ROOT}>
                                Trang Quản Trị
                            </Link>
                        ),
                        key: "admin",
                        icon: <FireOutlined />,
                    },
                ]
                : []),
            {
                label: (
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </span>
                ),
                key: "logout",
                icon: <LogoutOutlined />,
            },
        ]
        : [
            {
                label: <Link to={PATHS.LOGIN}>Đăng Nhập</Link>,
                key: "login",
            },
        ];

    const items: MenuProps["items"] = [];
    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ? (
                        <div style={{ display: "flex", gap: 30 }}>
                            <div className={styles["brand"]}>
                                <FaReact
                                    onClick={() => navigate(PATHS.CLIENT.HOME)}
                                    title="AMMS"
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
                            <div className={styles["top-menu"]}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: "#fff",
                                            colorBgContainer: "#222831",
                                            colorText: "#a7a7a7",
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

                                <div className={styles["extra"]}>
                                    {!isAuthenticated ? (
                                        <Link to={PATHS.LOGIN}>Đăng Nhập</Link>
                                    ) : (
                                        <Dropdown
                                            menu={{ items: itemsDropdown }}
                                            trigger={["click"]}
                                        >
                                            <Space style={{ cursor: "pointer" }}>
                                                <Avatar
                                                    src={avatarUrl}
                                                    alt={user?.name}
                                                >
                                                    {!avatarUrl &&
                                                        user?.name
                                                            ?.substring(0, 2)
                                                            ?.toUpperCase()}
                                                </Avatar>
                                                <span>
                                                    {user?.name || "Người dùng"}
                                                </span>
                                            </Space>
                                        </Dropdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles["header-mobile"]}>
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
                    mode="inline"
                    items={itemsMobiles}
                />
            </Drawer>

            <ManageAccount
                open={openManageAccount}
                onClose={setOpenManageAccount}
            />
        </>
    );
};

export default Header;
