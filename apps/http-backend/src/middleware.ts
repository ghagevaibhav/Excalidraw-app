import jwt from 'jsonwebtoken'

export default async function middleware(req: any, res: any, next: any) {
    const token = req.headers['authorization'] ?? "";
    const decoded = jwt.verify(token, '123123');

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide both username and password' });
    }

    // Implement your authentication logic here
    // For example, you can use a database to check if the provided credentials are valid
    const user = username
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.param.username = user.username;

    next();
}