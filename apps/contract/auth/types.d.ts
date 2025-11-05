import { z } from "zod";
export declare const userPayload: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
}, {
    id: string;
    email: string;
}>;
export declare const successAuthResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string;
    }, {
        id: string;
        email: string;
    }>;
}, "strip", z.ZodTypeAny, {
    user: {
        id: string;
        email: string;
    };
    accessToken: string;
}, {
    user: {
        id: string;
        email: string;
    };
    accessToken: string;
}>;
export declare const signupSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const verifyEmailOtpSchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    otp: string;
}, {
    email: string;
    otp: string;
}>;
export declare const generateOtpSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
