import api from "../../utils/api.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FormEvent } from "react";
import { useLocation } from "wouter";
import { toast } from "react-toastify";
import type { User } from "../../types.ts";

function LoginPage() {
	const queryClient = useQueryClient();
	const [, navigate] = useLocation();

	const mutation = useMutation({
		mutationFn: api.auth.login,
		onSuccess: async (data) => {
			if (data.access_token && data.refresh_token) {
				localStorage.setItem("access_token", data.access_token);
				localStorage.setItem("refresh_token", data.refresh_token);
			}
			await queryClient.refetchQueries({ queryKey: ["profile"] });
			const user = queryClient.getQueryData(["profile"]) as User;
			if (user.name) {
				toast.success(`Welcome back, ${user.name}!`);
			} else {
				toast.success(`Welcome back!`);
			}
			navigate("/");
		},
		onError: () => {
			toast.error("Failed to login. Try again.");
		},
	});

	const login = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		mutation.mutate({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		});
	};

	return (
		<>
			<div className="flex justify-center items-center mt-4">
				<form onSubmit={login}>
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
						<legend className="fieldset-legend">Login</legend>

						<label className="label">Email</label>
						<input type="email" className="input" placeholder="Email" name={"email"} required />

						<label className="label">Password</label>
						<input type="password" className="input" placeholder="Password" name={"password"} required />

						<button type="submit" className="btn btn-neutral mt-4">
							{mutation.isPending ? "Logging in..." : "Login"}
						</button>
					</fieldset>
				</form>
			</div>
		</>
	);
}

export default LoginPage;
