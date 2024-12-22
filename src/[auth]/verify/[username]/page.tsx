"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react'; // Loader component for activity indicator

// Define verification schema
const verifySchema = z.object({
  code: z.string().min(1, "Verification code is required")
});

type VerifyFormData = z.infer<typeof verifySchema>;

const Verify = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/signin');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Error verifying account',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
          Verify Your Account
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Please enter the verification code sent to your email
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Verification Code
            </Label>
            <input
              id="code"
              type="text"
              placeholder="Enter your verification code"
              className="w-full p-2 text-lg tracking-wider text-center border border-gray-300 rounded-md"
              disabled={isSubmitting}
              {...form.register('code')}
            />
            {form.formState.errors.code && (
              <p className="text-sm text-red-500">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full p-2 transition-colors bg-blue-600 text-white hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex justify-center items-center space-x-2">
                <Loader2 className="animate-spin text-white" />
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify Account'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn't receive a code?{' '}
            <button
              onClick={() => router.push('/resend-code')}
              className="text-blue-600 hover:underline"
              type="button"
            >
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
