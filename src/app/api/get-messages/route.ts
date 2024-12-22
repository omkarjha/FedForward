"use client";

import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { authoptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authoptions);

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Unauthorized",
            }),
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" },
                },
            },
        ]);

        if (!user || user.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User found",
                user: user[0], // Extract the aggregated user object
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to get user", error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to get user",
            }),
            { status: 500 }
        );
    }
}
