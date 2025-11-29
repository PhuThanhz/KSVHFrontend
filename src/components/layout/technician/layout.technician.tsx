// src/layouts/LayoutTechnician.tsx
import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderTechnician from "./header.technician";
import FooterTechnician from "./footer.technician";

const { Content } = Layout;

const LayoutTechnician: React.FC = () => {
    return (
        <Layout className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* HEADER - Fixed */}
            <HeaderTechnician />

            {/* MAIN CONTENT - Trừ header + footer */}
            <Content
                className="pt-20 pb-24" // pt-20 = header (~80px), pb-24 = footer (~96px)
                style={{
                    minHeight: "calc(100vh - 80px - 96px)", // 80px header + 96px footer
                    scrollPaddingBottom: "96px", // Tránh nội dung bị che khi scroll
                }}
            >
                <Outlet />
            </Content>

            {/* FOOTER - Fixed */}
            <FooterTechnician />
        </Layout>
    );
};

export default LayoutTechnician;