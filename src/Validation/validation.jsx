import {z} from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  shortDescription: z
    .string()
    .min(10, 'Short description must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Please select a status',
  }),
});
