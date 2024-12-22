"use client";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

import { Message } from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, content } = await request.json();

        const decodedusername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedusername });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            },
                { status: 400 }
            );
        }

        const newMessage = { content, createdAt: new Date() }
        user.message.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        },
            { status: 200 }
        );
    } catch (error) {
        console.error("error in sending message", error);
        return Response.json({
            success: false,
            message: "Error in sending message"
        },
            { status: 500 }
        );
    }

}