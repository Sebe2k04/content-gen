import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { generateOtpSchema, loginSchema, signupSchema, successAuthResponseSchema, verifyEmailOtpSchema, } from "./types";
const c = initContract();
export const authContract = c.router({
    signup: {
        method: "POST",
        path: "/signup",
        body: signupSchema,
        responses: {
            201: successAuthResponseSchema
        }
    },
    login: {
        method: "POST",
        path: "/login",
        body: loginSchema,
        responses: {
            200: successAuthResponseSchema
        }
    },
    generateEmailOtp: {
        method: "POST",
        path: "/email-otp/generate",
        body: generateOtpSchema,
        responses: {
            200: z.object({ message: z.string() })
        }
    },
    verifyEmailOtp: {
        method: "POST",
        path: "/email-otp/verify",
        body: verifyEmailOtpSchema,
        responses: {
            200: successAuthResponseSchema,
        },
    },
}, {
    pathPrefix: "/auth",
});
