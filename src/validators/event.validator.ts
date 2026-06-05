import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .trim(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Date must be a valid ISO date string',
    }),
  time: z.string().trim(),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .trim(),
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .positive('Capacity must be a positive number')
    .optional(),
  registrationCutoff: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Registration cutoff must be a valid date string',
    })
    .optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
