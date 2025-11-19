import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { z } from "zod";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";

import { getQueryClient } from "@/utils/api"; // your ts-rest axios client
import { getApiUrl } from "@/utils/env"; // your custom env fetcher
import { useRouter } from "next/router";
import { useCustomToast } from "@/hooks/useToast";
import { ToastStatus } from "@/types/toast";
import { useApiQuery } from "@/hooks/useApi";
import { userTokenCookieName } from "@/utils/common";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { makeApiCall, isApiLoading } = useApiQuery();

  const onSubmit = async (data: FormValues) => {
    await makeApiCall({
      fetcherFn: async () => {
        const client = getQueryClient();
        const response = await client.auth.login.mutation({
          body: {
            email: data.email,
            password: data.password,
          },
        });

        if (response.status === 200) return response;
        // need to fix it
        throw new Error("Login failed");
      },

      onSuccessFn: (res) => {
        const token = res.body?.accessToken;
        if (token) {
          Cookies.set(userTokenCookieName, token, { path: "/", expires: 7 });
        }
        showToast({
          status: ToastStatus.success,
          message: "Logged in successfully!",
        });
        router.replace("/dashboard");
      },

      onFailureFn: () => {
        showToast({
          status: ToastStatus.error,
          message: "Login failed due to server error",
        });
      },
    });
  };

  const BACKEND = getApiUrl().replace(/\/$/, "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to your account
        </p>

        {/* OAUTH BUTTONS */}
        <div className="space-y-3 mb-4">
          <a
            href={`${BACKEND}/auth/google`}
            className="w-full flex items-center gap-3 px-4 py-3 border rounded-xl shadow-sm bg-white hover:bg-gray-50 transition"
          >
            <FcGoogle className="text-xl" />
            <span className="text-sm font-medium">Continue with Google</span>
          </a>

          <a
            href={`${BACKEND}/auth/github`}
            className="w-full flex items-center gap-3 px-4 py-3 border rounded-xl shadow-sm bg-white hover:bg-gray-50 transition"
          >
            <FaGithub className="text-xl" />
            <span className="text-sm font-medium">Continue with GitHub</span>
          </a>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* NORMAL EMAIL LOGIN */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 text-black">
            <div>
              <label className="text-sm text-gray-700 font-medium">Email</label>
              <input
                {...register("email")}
                placeholder="you@example.com"
                className="w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 p-2"
              />
              {errors.email?.message && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 p-2"
              />
              {errors.password?.message && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isApiLoading}
              className="w-full py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            >
              {isApiLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our{" "}
          <span className="underline">Terms & Conditions</span>.
        </p>
      </div>
    </div>
  );
}
