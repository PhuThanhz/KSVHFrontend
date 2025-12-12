import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import TaskManagerPage from "./task-manager/pages/TaskManager";
import QSCStandardPage from "./standard/pages/QSCStandardPage";
import QSCActionPlanPage from "./action-plan/pages/QSCActionPlanPage";
import QSCFormBuilderPage from "./form-builder/pages/QSCFormBuilderPage";

const QSCRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirect mặc định → Task Manager */}
      <Route index element={<Navigate to="task-manager" replace />} />
      {/* 1️⃣ Quản lý nhiệm vụ kiểm tra */}
      <Route path="task-manager" element={<TaskManagerPage />} />

      {/* 2️⃣ Bảng tổng hợp điểm */}
      <Route path="standard" element={<QSCStandardPage />} />

      {/* 3️⃣ Kế hoạch khắc phục */}
      <Route path="action-plan" element={<QSCActionPlanPage />} />

      {/* 4️⃣ Form Builder */}
      <Route path="form-builder" element={<QSCFormBuilderPage />} />

      {/* 5️⃣ Các checklist QSC1/2/3 nếu cần mở theo nhiệm vụ */}
      <Route path="checklist/qsc1" element={<div>QSC1 load theo Task</div>} />
      <Route path="checklist/qsc2" element={<div>QSC2 load theo Task</div>} />
      <Route path="checklist/qsc3" element={<div>QSC3 load theo Task</div>} />      

    </Routes>
  );
};
export default QSCRoutes;
