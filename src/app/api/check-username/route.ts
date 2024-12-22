"use client";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from 'zod';
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuery = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }
        //Validate with zod
        
        const result = UsernameQuery.safeParse(queryParam);
        console.log(result);
        if (!result.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid username"
                }),
                { status: 400 }
            );
        }

        const { username } = result.data
        const existingverifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existingverifiedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username already exists"
                }),
                { status: 400 }
            );
        }

        return Response.json({
            sucess: true,
            message: "Username is available"

        })

    } catch (error) {
        console.error("Error in checking the username: ", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error in checking the username"
            }),
            { status: 500 }
        );
    }
}