import { z } from 'zod'

export const CreateCustomerSchema = z.object({
  firstName: z.string().min(1, 'First name required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name required').max(50, 'Last name too long'),
  phone: z.string().min(10, 'Valid phone required').max(20, 'Phone too long'),
  email: z.string().email('Invalid email').optional().or(z.literal('')).or(z.null()),
  address: z.string().min(1, 'Address required').max(200, 'Address too long'),
  city: z.string().min(1, 'City required').max(100, 'City too long'),
  purchaseDate: z.string().min(1, 'Purchase date required'),
  deliveryDate: z.string().min(1, 'Delivery date required'),
  product: z.string().min(1, 'Product required').max(100, 'Product name too long'),
  specialNote: z.string().max(500, 'Note too long').optional().or(z.literal('')).or(z.null()),
})

export const UpdateCustomerSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().min(10).max(20).optional(),
  email: z.string().email().optional().or(z.literal('')).or(z.null()),
  address: z.string().min(1).max(200).optional(),
  city: z.string().min(1).max(100).optional(),
  product: z.string().min(1).max(100).optional(),
  specialNote: z.string().max(500).optional().or(z.literal('')).or(z.null()),
})

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name required').max(100, 'Name too long'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'STAFF']),
})

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['ADMIN', 'STAFF']).optional(),
  isActive: z.boolean().optional(),
})

export const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Name required').max(100, 'Name too long'),
  body: z.string().min(1, 'Body required').max(1000, 'Body too long'),
})

export const UpdateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  body: z.string().min(1).max(1000).optional(),
  isActive: z.boolean().optional(),
})

export const SendMessageSchema = z.object({
  customerId: z.string().min(1, 'Customer ID required'),
  body: z.string().min(1, 'Message required').max(1600, 'Message too long (SMS limit)'),
})

export const FollowUpActionSchema = z.object({
  action: z.enum(['complete', 'skip', 'mark-reviewed']),
  customerId: z.string().min(1, 'Customer ID required'),
  followUpId: z.string().optional(),
  feedback: z.string().max(500).optional(),
  platform: z.enum(['GOOGLE', 'YELP', 'FACEBOOK', 'OTHER']).optional(),
})