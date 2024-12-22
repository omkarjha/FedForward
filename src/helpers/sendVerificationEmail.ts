"use client";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    userName: string,
    otp: string
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'FeedForward Verification Code',
            react: await VerificationEmail({ userName, otp }),
        });
        
        return { success: true, message: "Verification email sent sucessfully" };

    } catch (emailerror) {
        console.error("Error sending email", emailerror);
        return { success: false, message: "Error sending email" };
    }
}