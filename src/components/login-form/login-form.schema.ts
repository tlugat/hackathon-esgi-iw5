import { z } from "zod";

export const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(50),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
