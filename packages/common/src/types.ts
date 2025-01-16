import z from 'zod'

export const CreateUserSchema = z.object({
    username: z.string().min(5).max(15),
    password: z.string().min(3),
    name: z.string()
})

export const SignInSchema = z.object({
    username: z.string().min(5).max(15),
    password: z.string().min(3),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})
