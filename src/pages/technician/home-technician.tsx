import React from "react";
import TechnicianAssignmentPage from "@/pages/technician/assignment/home-assignment";

/**
 * HomeTechnicianPage
 * Trang chủ của kỹ thuật viên, nơi hiển thị danh sách công việc được giao.
 */
const HomeTechnicianPage = () => {
    return (
        <div style={{ padding: 20 }}>

            {/* Gọi trang danh sách công việc */}
            <TechnicianAssignmentPage />
        </div>
    );
};

export default HomeTechnicianPage;
