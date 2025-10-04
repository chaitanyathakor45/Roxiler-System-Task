import { z } from 'zod';

export const emailSchema = z.string().email();
export const passwordSchema = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, 'Must include uppercase letter')
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Must include special character');

export const nameSchema = z.string().min(20).max(60);
export const addressSchema = z.string().min(1).max(400);
export const ratingValueSchema = z.number().int().min(1).max(5);

export function parse<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
    const error = { error: { message: 'Validation failed', issues } };
    return { ok: false as const, error };
  }
  return { ok: true as const, data: result.data };
}

