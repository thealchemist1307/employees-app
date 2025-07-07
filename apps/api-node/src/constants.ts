/**
 * Central place for shared enums / string-literal arrays.
 * Import these wherever you need compile-time safety.
 */

export const ROLES = ["ADMIN", "EMPLOYEE"] as const;
export type RoleString = (typeof ROLES)[number];

export const SORT_FIELDS = ["name", "company", "department", "status"] as const;
export type SortFieldString = (typeof SORT_FIELDS)[number];

export const SORT_DIRECTIONS = ["asc", "desc"] as const;
export type SortDirString = (typeof SORT_DIRECTIONS)[number];

export const EMPLOYEE_STATUSES = ["Active", "On Leave", "Resigned"] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number]; 