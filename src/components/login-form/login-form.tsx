"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { loginFormSchema, LoginFormSchema } from "./login-form.schema";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { auth } from "../../../firebase.config";

const LoginForm = () => {
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<LoginFormSchema>({
		mode: "onBlur",
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const { handleSubmit } = form;

	const onSubmit = async (data: LoginFormSchema) => {
		const { email, password } = data;
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const idToken = await userCredential.user.getIdToken();

			// Sets authenticated browser cookies
			await fetch("/api/login", {
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			});

			// Refresh page after updating browser cookies
			router.refresh();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "Please check your email and password and try again.",
			});
		}
	};

	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			const idToken = await result.user.getIdToken();

			// Sets authenticated browser cookies
			await fetch("/api/login", {
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			});

			// Refresh page after updating browser cookies
			router.refresh();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "Unable to sign in with Google. Please try again.",
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mx-auto grid w-[450px] gap-6"
			>
				<div className="grid gap-2 text-center">
					<h1 className="text-3xl font-bold">Login</h1>
					<p className="text-balance text-muted-foreground">
						Enter your email below to login to your account
					</p>
				</div>
				<div className="grid gap-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="grid gap-2">
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="m@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="grid gap-2">
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="******" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full">
						Login
					</Button>
					<Button
						onClick={handleGoogleLogin}
						variant="outline"
						className="w-full"
					>
						Login with Google
					</Button>
				</div>
				<div className="mt-4 text-center text-sm">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="underline">
						Sign up
					</Link>
				</div>
			</form>
		</Form>
	);
};

export default LoginForm;
