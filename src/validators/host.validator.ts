import { z } from 'zod';

export const registerHostSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginHostSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterHostInput = z.infer<typeof registerHostSchema>;
export type LoginHostInput = z.infer<typeof loginHostSchema>;
