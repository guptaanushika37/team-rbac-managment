"use client";

import { useActionState } from "react";
import Link from "next/link";
import apiClient  from "@/app/lib/apiClient";

export type LoginState = {
  error?: string;
  success?: boolean;
};

const LoginPage = () => {
  const [state, loginAction, isPending] = useActionState(
    async (
      prevState: LoginState,
      formData: FormData
    ): Promise<LoginState> => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Basic validation
      if (!email || !password) {
        return {
          error: "Email and password are required.",
        };
      }

      try {
        await apiClient.login(email, password);

        window.location.href = "/dashboard";

        return {
          success: true,
        };
      } catch (error) {
        console.error("Login error:", error);

        return {
          error:
            error instanceof Error
              ? error.message
              : "Login failed. Please check your email and password.",
        };
      }
    },
    {}
  );

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to your TeamAccess account
          </p>
        </div>

        {/* Login Form */}
        <form action={loginAction} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
              <p className="text-sm text-red-300">
                {state.error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {state?.success && (
            <div className="p-3 bg-green-900/50 border border-green-700 rounded-md">
              <p className="text-sm text-green-300">
                Login successful!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;