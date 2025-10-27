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
import HomePage from "pages/home";
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
import DevicePartPage from "./pages/admin/device-part";
import DevicePage from "pages/admin/device";
export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      window.location.pathname === PATHS.LOGIN ||
      window.location.pathname === PATHS.REGISTER
    ) return;
    dispatch(fetchAccount());
  }, []);

  const router = createBrowserRouter([
    {
      path: PATHS.HOME,
      element: (
        <LayoutApp>
          <LayoutClient />
        </LayoutApp>
      ),
      errorElement: <NotFound />,
      children: [{ index: true, element: <HomePage /> }],
    },
    {
      path: PATHS.ADMIN.ROOT,
      element: (
        <LayoutApp>
          <LayoutAdmin />
        </LayoutApp>
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
          path: PATHS.ADMIN.DEVICE_PART,
          element: (
            <ProtectedRoute>
              <DevicePartPage />
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


      ],
    },
    { path: PATHS.LOGIN, element: <LoginPage /> },
  ]);

  return <RouterProvider router={router} />;
}
