"use client";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
// import { stat } from "fs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();

        const decodedusername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedusername })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (!isCodeValid && !isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "User verified successfully"
            },
                { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification Code has expired, please a request a new one"
            },
                { status: 400 }
            )
        } else {
            return Response.json({
                success: false,
                message: "Invalid Verification Code"
            },
                { status: 400 }
            )
        }

    } catch (error) {
        console.error("error in verifying user", error);
        return Response.json({
            success: false,
            message: "Error in verifying user"
        },
            { status: 500 }
        )
    }

}