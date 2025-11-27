import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import {
    HomeOutlined,
    CalendarOutlined,
    UserOutlined,
    QrcodeOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import ScannerModal from "@/components/scanner/ScannerModal";

const FooterTechnician: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openScanner, setOpenScanner] = useState(false);

    const menuItems = [
        { key: PATHS.TECHNICIAN.ROOT, icon: <HomeOutlined />, label: "Trang chủ" },
        { key: PATHS.TECHNICIAN.SCHEDULE, icon: <CalendarOutlined />, label: "Lịch làm việc" },
        { key: "scanner", icon: <QrcodeOutlined />, label: "Quét mã thiết bị", isScanner: true },
        { key: PATHS.TECHNICIAN.PROFILE, icon: <UserOutlined />, label: "Trang cá nhân" },
    ];

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 flex justify-around items-center z-50 shadow-lg h-24">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.key;

                    return (
                        <Tooltip key={item.key} title={item.label} placement="top">
                            <div
                                onClick={() =>
                                    item.isScanner
                                        ? setOpenScanner(true)
                                        : navigate(item.key)
                                }
                                className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isActive ? "text-pink-500" : "text-gray-400"
                                    }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive
                                            ? "bg-pink-100 text-pink-500 shadow-md"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    {React.cloneElement(item.icon, {
                                        style: { fontSize: 22 },
                                    })}
                                </div>
                                {isActive && (
                                    <div className="w-1 h-1 bg-pink-500 rounded-full mt-1"></div>
                                )}
                            </div>
                        </Tooltip>
                    );
                })}
            </div>

            <ScannerModal open={openScanner} onClose={() => setOpenScanner(false)} />
        </>
    );
};

export default FooterTechnician;
