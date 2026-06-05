import { z } from 'zod';

export const registerAttendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginAttendeeSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterAttendeeInput = z.infer<typeof registerAttendeeSchema>;
export type LoginAttendeeInput = z.infer<typeof loginAttendeeSchema>;
