"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, ArrowRight, Layers, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas";
import { z } from "zod";
import { cn } from "@/lib/utils";

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Signup failed");
            }

            if (result.session) {
                router.push("/dashboard");
            } else {
                router.push("/login?message=Account+created.+Please+log+in.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
        >
            <div className="glass-card p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" />

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <Link href="/" className="mb-6">
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center glow-primary">
                            <Layers className="text-white w-7 h-7" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-white/50 text-sm">Join the next generation of designers</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3 text-error text-sm animate-pulse">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Full Name</label>
                        <div className="relative group/field">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within/field:text-primary-400 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                {...register("name")}
                                placeholder="John Doe"
                                className={cn(
                                    "w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
                                    errors.name && "border-error/50 ring-error/20"
                                )}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-[10px] text-error font-bold mt-1 px-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Email Address</label>
                        <div className="relative group/field">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within/field:text-primary-400 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="name@example.com"
                                className={cn(
                                    "w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
                                    errors.email && "border-error/50 ring-error/20"
                                )}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[10px] text-error font-bold mt-1 px-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Password</label>
                        <div className="relative group/field">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within/field:text-primary-400 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                className={cn(
                                    "w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all",
                                    errors.password && "border-error/50 ring-error/20"
                                )}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-[10px] text-error font-bold mt-1 px-1">{errors.password.message}</p>
                        )}
                    </div>

                    <p className="text-[10px] text-white/30 px-1 leading-relaxed">
                        By signing up, you agree to our <Link href="/terms" className="text-white hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>.
                    </p>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 mt-2 rounded-2xl gradient-primary text-white font-bold text-lg glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-white/50 relative z-10">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary-400 font-bold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
