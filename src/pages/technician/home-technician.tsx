// src/pages/technician/home-technician.tsx
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";

const HomeTechnicianLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeKey, setActiveKey] = useState("/");
    useEffect(() => {
        if (location.pathname.includes("schedule")) {
            setActiveKey("schedule");
        } else if (location.pathname.includes("survey")) {
            setActiveKey("survey");
        } else {
            setActiveKey("assignment");
        }
    }, [location.pathname]);

    const handleTabChange = (key: string) => {
        setActiveKey(key);
        if (key === "schedule") {
            navigate(PATHS.TECHNICIAN.SCHEDULE);
        } else if (key === "survey") {
            navigate(PATHS.TECHNICIAN.SURVEY);
        } else {
            navigate(PATHS.TECHNICIAN.ASSIGNMENT);
        }
    };

    const items = [
        { key: "schedule", label: "Lịch làm việc của tôi" },
        { key: "assignment", label: "Công việc được giao" },
        { key: "survey", label: "Khảo sát bảo trì" },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Tabs
                activeKey={activeKey}
                onChange={handleTabChange}
                items={items}
                type="card"
            />
            <div style={{ marginTop: 16 }}>
                <Outlet />
            </div>
        </div>
    );
};

export default HomeTechnicianLayout;
