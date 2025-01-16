import express from "express";
import jwt from 'jsonwebtoken';
import { middleware } from "./middleware";
import { CreateUserSchema, SignInSchema, CreateRoomSchema } from "@repo/common/types"
import { prisma } from "@repo/db/client"
import bcrypt from "bcrypt"
import { JWT_SECRET } from "@repo/backend-common"

const app = express();

app.post('/api/v1/signin', async (req: any, res: any) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error)
        return res.status(422).json({
            message: "Invalid Inputs Passed"
        })
    }
    try {
        const { username, password } = parsedData.data;
        const user = await prisma.user.findUnique({ where: { email: username } });
        if (!user) {
            throw new Error('User not found')
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
                throw new Error('Invalid Pasword')
            }
        })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET)

        return res.json({
            messgae: "Signed In Successfully",
            token: token
        })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.post('/api/v1/signup', (req: any, res: any) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Invalid Inputs Passed"
        })
        return;
    }

    try {
        const { username, password, name } = parsedData.data;
        bcrypt.hash(password, 10, async (err, hash) => {
            const user = await prisma.user.create({
                data: {
                    email: username,
                    password: hash,
                    name: name
                }
            })

            const token = jwt.sign(user.id, JWT_SECRET)
            
            return res.status(200).json({
                message: "User created successfully",
                token: token
            })
        })
    }
    catch(e) {
        console.error(e)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.post('/api/v1/createRoom', middleware, (req, res) => {

    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData) {
        res.status(422).json({
            message: "Invalid Inputs Passed"
        })
        return;
    }



    res.json({
        roomId: 123
    })
})

app.listen(3001);