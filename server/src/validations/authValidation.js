const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.string().optional(),
  organization: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.string().max(100).optional(),
  organization: z.string().max(100).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
};
