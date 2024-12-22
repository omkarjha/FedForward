"use client";

import { signInSchema } from '@/schemas/signInSchema';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    // Zod + React Hook Form
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const Submit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        try {
            await axios.post('/api/signin', data);
            toast({
                title: 'Success',
                description: 'Successfully signed in',
                variant: "default",
            });
            router.replace('/dashboard'); // Redirect to dashboard after successful sign in
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Invalid credentials',
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
            <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.01] p-8 space-y-8 bg-white rounded-lg shadow-xl">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Sign in to continue giving feedback</p>
                </div>

                <form onSubmit={form.handleSubmit(Submit)} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                            Email or Username
                        </label>
                        <input
                            id="identifier"
                            type="text"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            {...form.register('identifier')}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            {...form.register('password')}
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                <span>Signing In...</span>
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/signup" className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Page;