import z from 'zod'

export const CreateUserSchema = z.object({
    username: z.string().min(5).max(15),
    password: z.string().min(8).max(16),
    name: z.string().min(5)
})

export const signInSchema = z.object({
    username: z.string().min(5).max(15),
    password: z.string().min(8).max(16),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(15)
})
