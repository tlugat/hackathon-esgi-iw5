import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const serverConfig = {
	cookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!,
	cookieSignatureKeys: [
		process.env.NEXT_PUBLIC_AUTH_COOKIE_SIGNATURE_KEY_CURRENT!,
		process.env.NEXT_PUBLIC_AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!,
	],
	cookieSerializeOptions: {
		path: "/",
		httpOnly: true,
		secure: process.env.USE_SECURE_COOKIES === "true",
		sameSite: "lax" as const,
		maxAge: 12 * 60 * 60 * 24,
	},
	serviceAccount: {
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
		clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL!,
		privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY?.replace(
			/\\n/g,
			"\n"
		)!,
	},
};

export const clientConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(clientConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { firestore, auth, app };
