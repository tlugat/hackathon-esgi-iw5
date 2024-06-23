"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase.config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema, registerFormSchema } from "./register-form.schema";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { useToast } from "@/hooks/use-toast";

const RegisterForm = () => {
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<RegisterFormSchema>({
		mode: "onBlur",
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
			password: "",
		},
	});
	const { handleSubmit } = form;

	const onSubmit = async (data: RegisterFormSchema) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);
			const user = userCredential.user;
			const displayName = `${data.firstname} ${data.lastname}`;
			await updateProfile(user, { displayName });

			router.push("/login");
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "Unable to sign in with Google. Please try again.",
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
					<h1 className="text-3xl font-bold">Sign Up</h1>
					<p className="text-balance text-muted-foreground">
						Enter your information to create an account
					</p>
				</div>
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="firstname"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel>First name</FormLabel>
									<FormControl>
										<Input placeholder="shadcn" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastname"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel>Last name</FormLabel>
									<FormControl>
										<Input placeholder="shadcn" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
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
						Create an account
					</Button>
					<Button variant="outline" className="w-full">
						Sign up with Google
					</Button>
				</div>
				<div className="mt-4 text-center text-sm">
					Already have an account?{" "}
					<Link href="/login" className="underline">
						Sign in
					</Link>
				</div>
			</form>
		</Form>
	);
};

export default RegisterForm;
