"use client";

import { useActionState } from "react";
import Link from "next/link";
import apiClient  from "@/app/lib/apiClient";

export type RegisterState = {
  error?: string;
  success?: boolean;
};

const RegisterPage = () => {
  const [state, registerAction, isPending] = useActionState(
    async (
      prevState: RegisterState,
      formData: FormData
    ): Promise<RegisterState> => {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const teamCode = formData.get("teamCode") as string;

      // Basic validation
      if (!name || !email || !password) {
        return {
          error: "Name, email and password are required.",
        };
      }

      if (password.length < 6) {
        return {
          error: "Password must be at least 6 characters long.",
        };
      }

      try {
        await apiClient.register({
          name,
          email,
          password,
          teamCode: teamCode || null,
        });

        window.location.href = "/dashboard";

        return {
          success: true,
        };
      } catch (error) {
        console.error("Registration error:", error);

        return {
          error:
            error instanceof Error
              ? error.message
              : "Registration failed. Please try again.",
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
            Create New Account
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create your TeamAccess account
          </p>
        </div>

        {/* Registration Form */}
        <form action={registerAction} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              required
              placeholder="Enter your full name"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

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
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="Create a password"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <p className="text-xs text-slate-500 mt-1">
              Password must be at least 6 characters.
            </p>
          </div>

          {/* Team Code */}
          <div>
            <label
              htmlFor="teamCode"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Team Code{" "}
              <span className="text-slate-500">(Optional)</span>
            </label>

            <input
              id="teamCode"
              type="text"
              name="teamCode"
              placeholder="Enter team code if you have one"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <p className="text-xs text-slate-500 mt-1">
              Leave empty if you don't have a team code.
            </p>
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
                Registration successful!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
          >
            {isPending
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in to existing account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;