import { WebSocketServer, WebSocket } from 'ws';
import { JWT_SECRET } from '@repo/backend-common';
import jwt, { JwtPayload } from 'jsonwebtoken'

const wss = new WebSocketServer({ port: 8080 });

function authentication(token: string): string | null {
    try {

        if (!token) {
            return null;
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !(decoded as JwtPayload).userId) {
            return null;
        }
        return decoded.userId;
    } catch (e: any) {
        console.error(`Invalid JWT token: ${e.message}`);
        return null;
    }
}

wss.on('connection', function connection(ws: WebSocket, request) {

    const url = request.url;
    if (!url)
        return

    const queryparams = new URLSearchParams(url.split('?')[1]);
    const token = queryparams.get('token') || "";
    const userId = authentication(token)

    if (userId == null) {
        ws.close();
        return;
    }

    // db call to push user

    ws.on('message', function message(data: Buffer) {
        const parsedData = JSON.parse(data.toString());

        // if type == joinroom then add user to the particular room array and asign a ws 

        // if type == leaveroom then remove user from that particular room array 
        
        // if type == chat then create a chat for user in that room in db and usinf the ws connection send or broadcast the message to all the orhte users in that room
    });

}); 