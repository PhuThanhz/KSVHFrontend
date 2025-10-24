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

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);

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

      ],
    },
    { path: PATHS.LOGIN, element: <LoginPage /> },
  ]);

  return <RouterProvider router={router} />;
}
