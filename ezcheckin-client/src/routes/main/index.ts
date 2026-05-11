/**
 * Centralized route exports for the main dashboard area
 * This file serves as the single source of truth for all navigation routes
 */

import { ROUTE_MAIN, MAIN_ROUTES, MAIN_NAVIGATION } from "./main.route";
import { ROUTE_ATTENDANCES } from "./attendances.route";
import { ROUTE_LICENSE } from "./license.route";
import { ROUTE_MY_BUSINESS } from "./my-business.route";
import { ROUTE_QR } from "./qr.route";
import { ROUTE_SHIFTS } from "./shifts.route";
import { ROUTE_USERS } from "./users.route";

/**
 * Re-export all routes from main.route
 */
export { ROUTE_MAIN, MAIN_ROUTES, MAIN_NAVIGATION };

/**
 * Re-export all individual module routes
 */
export { ROUTE_ATTENDANCES, ROUTE_LICENSE, ROUTE_MY_BUSINESS, ROUTE_QR, ROUTE_SHIFTS, ROUTE_USERS };

/**
 * Master route object containing all routes
 */
export const ALL_MAIN_ROUTES = {
  main: ROUTE_MAIN,
  attendances: ROUTE_ATTENDANCES,
  license: ROUTE_LICENSE,
  myBusiness: ROUTE_MY_BUSINESS,
  qr: ROUTE_QR,
  shifts: ROUTE_SHIFTS,
  users: ROUTE_USERS,
} as const;
