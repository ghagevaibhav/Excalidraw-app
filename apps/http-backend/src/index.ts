import express from "express";
import jwt from 'jsonwebtoken';
import middlewares from "./middleware";
import { CreateUserSchema } from "@repo/common/types"
const app = express();

app.post('/api/v1/signin', (req: any, res: any) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
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