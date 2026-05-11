import { ROUTE_ATTENDANCES } from "./attendances.route";
import { ROUTE_MY_BUSINESS } from "./my-business.route";
import { ROUTE_USERS } from "./users.route";
import { ROUTE_SHIFTS } from "./shifts.route";
import { ROUTE_QR } from "./qr.route";
import { ROUTE_LICENSE } from "./license.route";

export const ROUTE_MAIN = {
  MAIN: "/main",
  DASHBOARD: "/main",
} as const;

/**
 * Comprehensive route configuration for main dashboard
 * Contains all nested routes for the authenticated dashboard area
 */
export const MAIN_ROUTES = {
  attendances: ROUTE_ATTENDANCES,
  business: ROUTE_MY_BUSINESS,
  users: ROUTE_USERS,
  shifts: ROUTE_SHIFTS,
  qr: ROUTE_QR,
  license: ROUTE_LICENSE,
} as const;

/**
 * Sidebar navigation items for main dashboard
 */
export const MAIN_NAVIGATION = [
  {
    label: "Dashboard",
    path: ROUTE_MAIN.DASHBOARD,
    icon: "dashboard",
  },
  {
    label: "Chấm công",
    path: ROUTE_ATTENDANCES.ATTENDANCE_LIST,
    icon: "clock",
  },
  {
    label: "Ca làm việc",
    path: ROUTE_SHIFTS.SHIFTS_LIST,
    icon: "schedule",
  },
  {
    label: "Nhân viên",
    path: ROUTE_USERS.USERS_LIST,
    icon: "team",
  },
  {
    label: "Doanh nghiệp",
    path: ROUTE_MY_BUSINESS.MY_BUSINESS_DETAIL,
    icon: "shop",
  },
  {
    label: "QR Check-in",
    path: ROUTE_QR.QR_CHECKIN,
    icon: "qrcode",
  },
  {
    label: "Giấy phép",
    path: ROUTE_LICENSE.LICENSE_LIST,
    icon: "license",
  },
] as const;