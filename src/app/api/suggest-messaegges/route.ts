"use client";

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = 'edge';

export async function POST(request: Request) {
    const { messages } = await request.json();
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'Whats a hobby youve recently started ' || ' If you could have dinner with any historical figure, who would it be? '||'Whats a simple thing that makes you happy ? ' Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational atmosphere";
        
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: prompt }, ...messages]
        });

        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(response.choices[0].message.content);
                controller.close();
            }
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain' }
        });

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.error();
        } else {
            console.error("An unexpected error occurred", error);
            throw error;
        }
    }
}