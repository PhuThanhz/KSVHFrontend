import { technicianBreadcrumb } from "./technician.breadcrumb";
import { adminBreadcrumb } from "./admin.breadcrumb";
import { clientBreadcrumb } from "./client.breadcrumb";

export const breadcrumbNameMap: Record<string, string> = {
    ...technicianBreadcrumb,
    ...adminBreadcrumb,
    ...clientBreadcrumb,
};
