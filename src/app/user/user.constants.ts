import { TRole } from '../middleware/auth';

export const UserRoles: TRole = {
  admin: 'admin',
  customer: 'customer',
} as const;
