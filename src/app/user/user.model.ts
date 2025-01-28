import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'customer', enum: ['admin', 'customer'] },
  phone: { type: String, default: 'N/A' },
  address: { type: String, default: 'N/A' },
  city: { type: String, default: 'N/A' },
});

const User = model<TUser>('User', userSchema);

export default User;
