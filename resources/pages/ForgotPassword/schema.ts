import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Required',
    })
    .email({ message: 'Invalid email address' }),
});
