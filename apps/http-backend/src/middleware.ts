import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from "@repo/backend-common";
import jwt, { decode } from "jsonwebtoken";
import { prisma } from '@repo/db/client';

export const middleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers["authorization"] ?? "";

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && typeof decoded !== 'string') {
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.userId
                }
            })
            if(!user){
                res.status(403).json({
                    message: "User Does Not Exist Middleware Error"
                })
            }
            // Add user ID to request object
            req.userId = decoded.userId;
            next();
        }
        else{
            res.json({message: "Invalid Token"})
            next();
        }
    }   
    catch(error){
        res.status(401).json({message: "Invalid or Expired Token"})
        next();
    }
}