import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  createdAt: z.string().datetime(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  email: z.email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});
