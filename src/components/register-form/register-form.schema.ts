import { z } from "zod";

export const registerFormSchema = z.object({
	firstname: z.string().min(2).max(50),
	lastname: z.string().min(2).max(50),
	email: z.string().email(),
	password: z.string().min(6).max(50),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
