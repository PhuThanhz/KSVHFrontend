import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import OCChecklist from "./modules/operation/business/oc-checklist/pages/OCChecklist";
import PromotionMain from "./modules/operation/business/promotion/pages/PromotionMain";
import PromotionExtra from "./modules/operation/business/promotion/pages/PromotionExtra";
import QSCRoutes from "./modules/qsc/routes.qsc"; // ✅ thêm dòng này

const OperationModule = () => {
  return (
    <Routes>
      {/* Trang mặc định */}
      <Route index element={<Navigate to="business/oc-checklist" replace />} />

      {/* OC Checklist */}
      <Route path="business/oc-checklist" element={<OCChecklist />} />

      {/* Khuyến mãi */}
      <Route path="business/promotion/main" element={<PromotionMain />} />
      <Route path="business/promotion/extra" element={<PromotionExtra />} />

      {/* Hệ thống QSC */}
      <Route path="qsc/*" element={<QSCRoutes />} /> {/* ✅ thêm dòng này */}
    </Routes>
  );
};

export default OperationModule;
