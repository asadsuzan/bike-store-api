export interface TUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: string;
  city?: string;
}
