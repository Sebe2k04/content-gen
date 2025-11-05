import { z } from "zod";
export declare const authContract: {
    signup: {
        method: "POST";
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            password: string;
        }, {
            email: string;
            password: string;
        }>;
        path: "/auth/signup";
        responses: {
            201: z.ZodObject<{
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
        };
    };
    login: {
        method: "POST";
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            password: string;
        }, {
            email: string;
            password: string;
        }>;
        path: "/auth/login";
        responses: {
            200: z.ZodObject<{
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
        };
    };
    generateEmailOtp: {
        method: "POST";
        body: z.ZodObject<{
            email: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
        }, {
            email: string;
        }>;
        path: "/auth/email-otp/generate";
        responses: {
            200: z.ZodObject<{
                message: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                message: string;
            }, {
                message: string;
            }>;
        };
    };
    verifyEmailOtp: {
        method: "POST";
        body: z.ZodObject<{
            email: z.ZodString;
            otp: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            otp: string;
        }, {
            email: string;
            otp: string;
        }>;
        path: "/auth/email-otp/verify";
        responses: {
            200: z.ZodObject<{
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
        };
    };
};
