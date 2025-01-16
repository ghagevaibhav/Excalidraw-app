import express from "express";
import jwt from 'jsonwebtoken';
import middlewares from "./middleware";
import { CreateUserSchema, SignInSchema, CreateRoomSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client"
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

        const user = await prismaClient.user.findUnique({
            where: {
                email: parsedData.data.username,
                password: parsedData.data.password
            }
        })
    }
    catch(e) {

    }
    // Check if user exists in database
    // If exists, generate JWT token and send back as response
    // If not, send back error message
    return res.json({ userId: '123', token: 'your_jwt_token_here' });
})

app.post('/api/v1/signup', (req: any, res: any) => {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = 123

    const token = jwt.sign({ userId }, '123123')

    // Check if user already exists in database
    // If exists, send back error message
    // If not, create a new user in the database and send back success message
    return res.json({ message: 'User created successfully' });
})

app.post('/api/v1/createRoom', middlewares, (req, res) => {

    res.json({
        roomId: 123
    })
})

app.listen(3001);