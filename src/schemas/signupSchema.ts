import { maxHeaderSize } from 'http'
import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 character")
    .max(20, "Username must not be more than 20 charqcters")
    .regex(/^[a-zA-z0-9_] + $/, "Username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid Mail Address' }),
    password: z.string().min(5, { message: "password must be ar least 6 character" })
})
