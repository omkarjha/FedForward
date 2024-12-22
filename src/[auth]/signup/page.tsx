"use client";

import { signUpSchema } from '@/schemas/signupSchema';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useDebounceValue } from 'usehooks-ts';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';


const Page = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUsername = useDebounceValue(username, 400);
    const { toast } = useToast();
    const router = useRouter();

    // Zod + React Hook Form
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        const checkUsername = async () => {
            if (debouncedUsername.length < 2) {
                setUsernameMessage('');
                return;
            }
            setIsCheckingUsername(true);
            setUsernameMessage('');

            try {
                const response = await axios.get(`/api/check-username?username=${debouncedUsername}`);
                setUsernameMessage(response.data.message);
            } catch (error) {
                const axiosError = error as AxiosError<{ message: string }>;
                setUsernameMessage(axiosError.response?.data.message ?? "Error Checking Username");
            } finally {
                setIsCheckingUsername(false);
            }
        };

        checkUsername();
    }, [debouncedUsername]);

    const Submit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            await axios.post('/api/signup', data);
            toast({
                title: 'Account Created',
                description: 'Please verify your email address',
                variant: "default",
            });
            router.replace(`/verify/${data.username}`);
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Error Creating Account',
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
                        Join FeedForward
                    </h1>
                    <p className="text-gray-600">Sign up to give your valuable feedback anonymously</p>
                </div>

                <form onSubmit={form.handleSubmit(Submit)} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <div className="relative">
                            <input
                                id="username"
                                type="text"
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                {...form.register('username')}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {isCheckingUsername && (
                                <div className="absolute right-3 top-2">
                                    <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
                                </div>
                            )}
                        </div>
                        {usernameMessage && (
                            <p className={`text-sm ${isCheckingUsername ? 'text-blue-500' : 'text-red-500'} animate-fadeIn`}>
                                {usernameMessage}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            {...form.register('email')}
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

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        disabled={isCheckingUsername || isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                <span>Creating Account...</span>
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                    Already a member?{' '}
                    <a href="/signin" className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                        Sign In
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Page;