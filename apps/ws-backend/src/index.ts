import { WebSocketServer, WebSocket } from 'ws';
import { JWT_SECRET } from '@repo/backend-common';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { prisma } from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string,
}

const users: User[] = [];
function checkUser(token: string): string | null {
    try {
        if (!token) {
            return null;
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || typeof decoded === 'string' || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    } catch (e: any) {
        console.error(`Invalid JWT token: ${e.message}`);
        return null;
    }
}

wss.on('connection',function connection(ws: WebSocket, request) {

    const url = request.url;
    if (!url)
        return

    const queryparams = new URLSearchParams(url.split('?')[1]);
    const token = queryparams.get('token') || "";
    const userId = checkUser(token)

    if (userId == null) {
        ws.close();
        return null;
    }

    // db call to push user
    users.push({
        userId, 
        rooms: [],
        ws
    })

    ws.on('message', async function message(data: Buffer) {
        const parsedData = JSON.parse(data.toString());

        // if type == joinroom then add user to the particular room array and asign a ws 
        if(parsedData.type === 'join_room'){
            const user = users.find(u => u.ws == ws);
            user?.rooms.push(parsedData.roomId)
        }

        // if type == leaveroom then remove user from that particular room array 
        if(parsedData.type === 'leave_room'){
            const user = users.find(u => u.ws == ws);
            if(!user) return
            user.rooms = user.rooms.filter(x => x === parsedData.room)
        }

        // if type == chat then create a chat for user in that room in db and usinf the ws connection send or broadcast the message to all the orhte users in that room
        if(parsedData === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await prisma.chat.create({
                data: {
                    userId,
                    roomId,
                    message
                }
            });

            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: 'chat',
                        roomId,
                        message: message
                    }));
                }
            })
        } 
    });
}); 