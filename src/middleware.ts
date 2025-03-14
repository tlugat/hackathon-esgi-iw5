import { NextRequest, NextResponse } from "next/server";
import {
	authMiddleware,
	redirectToHome,
	redirectToLogin,
} from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "../firebase.config";

const PUBLIC_PATHS = ["/register", "/login", "/reset-password"];

export async function middleware(request: NextRequest) {
	return authMiddleware(request, {
		loginPath: "/api/login",
		logoutPath: "/api/logout",
		apiKey: clientConfig.apiKey,
		cookieName: serverConfig.cookieName,
		cookieSignatureKeys: serverConfig.cookieSignatureKeys,
		cookieSerializeOptions: serverConfig.cookieSerializeOptions,
		serviceAccount: serverConfig.serviceAccount,
		debug: true,
		checkRevoked: true,
		handleValidToken: async ({ token, decodedToken }, headers) => {
			// Authenticated user should not be able to access /login, /register and /reset-password routes
			if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
				return redirectToHome(request);
			}

			return NextResponse.next({
				request: {
					headers,
				},
			});
		},
		handleInvalidToken: async (reason) => {
			console.info("Missing or malformed credentials", { reason });

			return redirectToLogin(request, {
				path: "/login",
				publicPaths: PUBLIC_PATHS,
			});
		},
		handleError: async (error) => {
			console.error("Unhandled authentication error", { error });

			return redirectToLogin(request, {
				path: "/login",
				publicPaths: PUBLIC_PATHS,
			});
		},
	});
}

export const config = {
	matcher: [
		"/api/login",
		"/api/logout",
		"/",
		"/((?!_next|favicon.ico|api|.*\\.).*)",
	],
};
