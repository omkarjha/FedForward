import { z } from "zod"

export const MessageSchema = z.object({
    content: z
    .string()
    .min(10, {message : 'Content must be at least of 10 characters'})
    .max(400, {message : 'Content must not be more than of 400 characters'})

})