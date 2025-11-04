import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import NotFound from "components/share/not.found";
import LoginPage from "pages/auth/login";
import LayoutAdmin from "@/components/admin/layout/layout.admin";
import ProtectedRoute from "components/share/protected-route.ts";
import HomeClientPage from "@/pages/client/home-client";
import DashboardPage from "./pages/admin/dashboard";
import PermissionPage from "./pages/admin/permission";
import RolePage from "./pages/admin/role";
import UserPage from "./pages/admin/user";
import CompanyPage from "./pages/admin/company";
import AssetTypePage from "./pages/admin/asset-type";
import DepartmentPage from "./pages/admin/department";
import { fetchAccount } from "./redux/slice/accountSlide";
import LayoutApp from "./components/share/layout.app";
import LayoutClient from "./components/client/layout/layout.client";
import { PATHS } from "@/constants/paths";
import PositionPage from './pages/admin/position';
import EmployeePage from './pages/admin/employee';
import CustomerPage from './pages/admin/customer';
import DeviceTypePage from './pages/admin/device-type';
import SkillPage from "pages/admin/skill";
import SolutionPage from "./pages/admin/solution";
import WarehousePage from "@/pages/admin/warehouse";
import UnitPage from "@/pages/admin/unit";
import RejectReasonPage from "@/pages/admin/reject-reason";
import TechnicianSupplierPage from './pages/admin/technician-supplier';
import IssuePage from "./pages/admin/issue";
import MaterialSupplierPage from "@/pages/admin/material-supplier";
import TechnicianPage from "./pages/admin/technician";
import InventoryItemPage from "./pages/admin/inventory-item";
import DevicePage from "pages/admin/device";
import ShiftTemplatePage from "@/pages/admin/shift-template";
import TechnicianAvailabilityPage from "@/pages/admin/technician-availability";
import HomeTechnicianPage from "pages/technician/home-technician";
import CreateMaintenanceRequestClientPage from "@/pages/client/maintenance-request/create-request-client";
import CustomerPurchaseHistoryPage from "./pages/admin/customer-purchase-history";
import PurchaseHistoryPage from "@/pages/client/purchase-history";
import MyMaintenanceRequestsPage from "@/pages/client/maintenance-request/my-maintenance-requests";
import Loading from "./components/share/loading";
import NotPermitted from "@/components/share/protected-route.ts";
import ProtectedPage from "@/pages/client/protectedpage";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import MaintenancePage from "@/pages/admin/maintenance/maintenance";
import IssueSkillMappingPage from "@/pages/admin/issue-skill-mapping";

export default function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
  const userRole = useAppSelector(state => state.account.user?.role?.name);
  const isLoading = useAppSelector(state => state.account.isLoading);

  useEffect(() => {
    if (
      window.location.pathname === PATHS.LOGIN
    ) return;
    dispatch(fetchAccount());
  }, []);

  const router = createBrowserRouter([
    // =================== CUSTOMER =======================//
    {
      path: PATHS.CLIENT.HOME,
      element: (
        <LayoutApp>
          <LayoutClient />
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomeClientPage /> },
        // =================== CREATE MAINTENANCE =======================//
        {
          path: PATHS.CLIENT.CREATE_MAINTENANCE_REQUEST,
          element: <CreateMaintenanceRequestClientPage />,
        },
        // =================== PURCHASE HISTORY =======================//
        {
          path: PATHS.CLIENT.PURCHASE_HISTORY,
          element: (
            <ProtectedPage
              isAuthenticated={isAuthenticated}
              redirectPath={PATHS.LOGIN}
              path="purchase-history"
            >
              <PurchaseHistoryPage />
            </ProtectedPage>
          ),
        },

        // =================== MY MAINTENANCE REQUESTS =======================//
        {
          path: PATHS.CLIENT.MY_MAINTENANCE_REQUESTS,
          element: (
            <ProtectedPage
              isAuthenticated={isAuthenticated}
              redirectPath={PATHS.LOGIN}
              path="maintenance-requests"
            >
              <MyMaintenanceRequestsPage />
            </ProtectedPage>
          ),
        },
      ],
    },

    // ==================== TECHNICIAN =====================//
    {
      path: PATHS.TECHNICIAN.ROOT,
      element: (
        <LayoutApp>
          <LayoutClient />
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [{ index: true, element: <HomeTechnicianPage /> }],
    },
    // ==========================  ADMIN =======================//
    {
      path: PATHS.ADMIN.ROOT,
      element: isAuthenticated && (userRole === 'SUPER_ADMIN' || userRole === 'EMPLOYEE') ? (
        <LayoutAdmin />
      ) : isLoading ? (
        <Loading />
      ) : (
        <NotPermitted />
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.MAINTENANCE,
          element:
            <ProtectedRoute>
              <MaintenancePage />
            </ProtectedRoute>
        },
        {
          path: PATHS.ADMIN.ISSUE_SKILL_MAPPING,
          element: (
            <ProtectedRoute>
              <IssueSkillMappingPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.USER,
          element: (
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.PERMISSION,
          element: (
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.ROLE,
          element: (
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.COMPANY,
          element: (
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.ASSET_TYPE,
          element: (
            <ProtectedRoute>
              <AssetTypePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.DEPARTMENT,
          element: (
            <ProtectedRoute>
              <DepartmentPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.POSITION,
          element: (
            <ProtectedRoute>
              <PositionPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.EMPLOYEE,
          element: (
            <ProtectedRoute>
              <EmployeePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.CUSTOMER,
          element: (
            <ProtectedRoute>
              <CustomerPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.CUSTOMER_PURCHASE_HISTORY,
          element: (
            <ProtectedRoute>
              <CustomerPurchaseHistoryPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.DEVICE_TYPE,
          element: (
            <ProtectedRoute>
              <DeviceTypePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.SKILL,
          element: (
            <ProtectedRoute>
              <SkillPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.SOLUTION,
          element: (
            <ProtectedRoute>
              <SolutionPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.WAREHOUSE,
          element: (
            <ProtectedRoute>
              <WarehousePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.UNIT,
          element: (
            <ProtectedRoute>
              <UnitPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.REJECT_REASON,
          element: (
            <ProtectedRoute>
              <RejectReasonPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.TECHNICIAN_SUPPLIER,
          element: (
            <ProtectedRoute>
              <TechnicianSupplierPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.ISSUE,
          element: (
            <ProtectedRoute>
              <IssuePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.MATERIAL_SUPPLIER,
          element: (
            <ProtectedRoute>
              <MaterialSupplierPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.TECHNICIAN,
          element: (
            <ProtectedRoute>
              <TechnicianPage />
            </ProtectedRoute>
          ),
        },

        {
          path: PATHS.ADMIN.INVENTORY_ITEM,
          element: (
            <ProtectedRoute>
              <InventoryItemPage />
            </ProtectedRoute>
          ),
        },


        {
          path: PATHS.ADMIN.DEVICE,
          element: (
            <ProtectedRoute>
              <DevicePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.SHIFT_TEMPLATE,
          element: (
            <ProtectedRoute>
              <ShiftTemplatePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ADMIN.TECHNICIAN_AVAILABILITY,
          element: (
            <ProtectedRoute>
              <TechnicianAvailabilityPage />
            </ProtectedRoute>
          ),
        },


      ],
    },
    { path: PATHS.LOGIN, element: <LoginPage /> },
    { path: PATHS.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
    { path: PATHS.RESET_PASSWORD, element: <ResetPasswordPage /> },
  ]);

  return <RouterProvider router={router} />;
}
