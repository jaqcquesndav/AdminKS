import { ERP_GROUP, FINANCE_GROUP } from './subscription';

export const PERMISSIONS = {
  read: 'Lecture',
  write: 'Écriture',
  admin: 'Administration'
} as const;

export type Permission = keyof typeof PERMISSIONS;

export interface ApplicationPermission {
  applicationId: string;
  permissions: Permission[];
}

export const AVAILABLE_APPLICATIONS = [
  ...ERP_GROUP.applications,
  ...FINANCE_GROUP.applications
];