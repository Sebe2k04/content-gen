export declare const contract: {
    auth: {
        signup: {
            method: "POST";
            body: import("node_modules/zod/index.cjs").ZodObject<{
                email: import("node_modules/zod/index.cjs").ZodString;
                password: import("node_modules/zod/index.cjs").ZodString;
            }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
                email: string;
                password: string;
            }, {
                email: string;
                password: string;
            }>;
            path: "/auth/signup";
            responses: {
                201: import("node_modules/zod/index.cjs").ZodObject<{
                    accessToken: import("node_modules/zod/index.cjs").ZodString;
                    user: import("node_modules/zod/index.cjs").ZodObject<{
                        id: import("node_modules/zod/index.cjs").ZodString;
                        email: import("node_modules/zod/index.cjs").ZodString;
                    }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
                        id: string;
                        email: string;
                    }, {
                        id: string;
                        email: string;
                    }>;
                }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
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
            body: import("node_modules/zod/index.cjs").ZodObject<{
                email: import("node_modules/zod/index.cjs").ZodString;
                password: import("node_modules/zod/index.cjs").ZodString;
            }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
                email: string;
                password: string;
            }, {
                email: string;
                password: string;
            }>;
            path: "/auth/login";
            responses: {
                200: import("node_modules/zod/index.cjs").ZodObject<{
                    accessToken: import("node_modules/zod/index.cjs").ZodString;
                    user: import("node_modules/zod/index.cjs").ZodObject<{
                        id: import("node_modules/zod/index.cjs").ZodString;
                        email: import("node_modules/zod/index.cjs").ZodString;
                    }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
                        id: string;
                        email: string;
                    }, {
                        id: string;
                        email: string;
                    }>;
                }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
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
            body: import("node_modules/zod/index.cjs").ZodObject<{
                email: import("node_modules/zod/index.cjs").ZodString;
            }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
                email: string;
            }, {
                email: string;
            }>;
            path: "/auth/email-otp/generate";
            responses: {
                200: import("node_modules/zod/index.cjs").ZodObject<{
                    message: import("node_modules/zod/index.cjs").ZodString;
                }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
                    message: string;
                }, {
                    message: string;
                }>;
            };
        };
        verifyEmailOtp: {
            method: "POST";
            body: import("node_modules/zod/index.cjs").ZodObject<{
                email: import("node_modules/zod/index.cjs").ZodString;
                otp: import("node_modules/zod/index.cjs").ZodString;
            }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
                email: string;
                otp: string;
            }, {
                email: string;
                otp: string;
            }>;
            path: "/auth/email-otp/verify";
            responses: {
                200: import("node_modules/zod/index.cjs").ZodObject<{
                    accessToken: import("node_modules/zod/index.cjs").ZodString;
                    user: import("node_modules/zod/index.cjs").ZodObject<{
                        id: import("node_modules/zod/index.cjs").ZodString;
                        email: import("node_modules/zod/index.cjs").ZodString;
                    }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
                        id: string;
                        email: string;
                    }, {
                        id: string;
                        email: string;
                    }>;
                }, "strip", import("node_modules/zod/index.cjs").ZodTypeAny, {
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
};
