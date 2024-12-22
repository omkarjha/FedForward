"use client";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User  already exists with this email"
                    },
                    {
                        status: 400
                    }
                )
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)
                existingUserByEmail.verifyCodeExpiry = expiryDate
            }

        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newuser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []

            })

            await newuser.save()

            return Response.json(
                {
                    success: true,
                    message: "User registered successfully"
                },
                {
                    status: 201
                }
            )
        }
        //send verification email

        const emailresponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailresponse.success) {
            return Response.json(
                {
                    success: false,
                    message: "Error in sending verification email"
                },
                {
                    status: 500
                }
            )
        }

    } catch (error) {
        console.error("Error in registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error in registering user"
            },
            {
                status: 500
            }
        )
    }
}