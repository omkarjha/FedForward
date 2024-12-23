"use client";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        // Check if username exists and is verified
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username already exists",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if email exists
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "User already exists with this email",
                    }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            } else {
                // Update existing user's verification details
                existingUserByEmail.password = await bcrypt.hash(password, 10);
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;

                await existingUserByEmail.save();
            }
        } else {
            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: [],
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Error in sending verification email",
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully. Please check your email to verify.",
            }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error in registering user", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error in registering user",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
