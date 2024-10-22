import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn, toUser } from "@/lib/utils";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { AuthProvider } from "@/contexts/auth/auth-provider";
import { clientConfig, serverConfig } from "../../firebase.config";
import Toaster from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const tokens = await getTokens(cookies(), {
		apiKey: clientConfig.apiKey,
		cookieName: serverConfig.cookieName,
		cookieSignatureKeys: serverConfig.cookieSignatureKeys,
		serviceAccount: serverConfig.serviceAccount,
	});
	const user = tokens ? toUser(tokens) : null;

	return (
		<html lang="en">
			<body className={cn("min-h-screen", inter.className)}>
				<main className="h-full">
					<AuthProvider user={user}>{children}</AuthProvider>
				</main>
				<Toaster />
			</body>
		</html>
	);
}
