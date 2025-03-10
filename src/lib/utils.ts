import { User } from "@/contexts/auth/auth-context";
import { type ClassValue, clsx } from "clsx";
import { Tokens } from "next-firebase-auth-edge";
import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toUser = ({ decodedToken }: Tokens): User => {
	const {
		uid,
		email,
		picture: photoURL,
		email_verified: emailVerified,
		phone_number: phoneNumber,
		name: displayName,
		source_sign_in_provider: signInProvider,
	} = decodedToken;

	const customClaims = filterStandardClaims(decodedToken);

	return {
		uid,
		email: email ?? null,
		displayName: displayName ?? null,
		photoURL: photoURL ?? null,
		phoneNumber: phoneNumber ?? null,
		emailVerified: emailVerified ?? false,
		providerId: signInProvider,
		customClaims,
	};
};
