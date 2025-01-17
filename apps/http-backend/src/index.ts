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
    catch (e) {
        console.error(e)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
})

app.post('/api/v1/createRoom', middleware, async (req, res) => {

    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(422).json({
            message: "Invalid Inputs Passed"
        })
        return;
    }

    const userId = req.userId;
    if(!userId) return; // so that we dont assign an empty userId to an admin 

    const {name} = parsedData.data
    try {
        const room = await prisma.room.create({
            data: {
                slug: name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch(e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
})

app.get("/api/v1/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    try{

        const chats = prisma.chat.findMany({
            where: {
                roomId: roomId
            },
            take: 50,
            orderBy: {
                id: "desc"
            }
        })
    }
    catch(e) {
        res.status(401).json({
            message: "Invalid Room Id"
        })
    }
})

app.get("/api/v1/room/:slug", async (req, res) => {
    const slug = req.params.slug
    try{

        const room = await prisma.room.findUnique({
            where: {
                slug: slug
            },
        })
        res.json({
            room: room
        }) 
    }
    catch(e) {
        res.status(404).json({
            message: "Room not found"
        })
    }
})


app.listen(3001);