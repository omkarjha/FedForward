"use client";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { authoptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authoptions);
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Unauthorized"
            }),
            { status: 401 }
        );
    }
    // const user: User = session.user as User;
    const user: User = session.user as User;

    try {
        const { acceptMessages } = await request.json();

        // Your logic to update user goes here
        const updatedUser = await UserModel.findByIdAndUpdate(
            user.id, // Assuming user.id is the correct identifier
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found"
                }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Message status updated successfully",
                updatedUser
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update user", error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to update user"
            }),
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authoptions);
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Unauthorized"
            }),
            { status: 401 }
        );
    }

    const user: User = session.user as User;
    const userId = user.id;

const foundUser = await UserModel.findById(userId);

try {
    if (!foundUser) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "User not found"
            }),
            { status: 404 }
        );
    }

    return new Response(
        JSON.stringify({
            success: true,
            message: "User found",
            user: foundUser
        }),
        { status: 200 }
    );

    } catch (error) {

        console.log ("Failed to update user status to accept messages")
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to update user status to accept messages"
            }),
            { status: 500 }
        );
    }
}