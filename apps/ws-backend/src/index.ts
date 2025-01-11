import { WebSocketServer, WebSocket } from 'ws';
import { JWT_SECRET } from '@repo/backend-common';
import jwt, { JwtPayload } from 'jsonwebtoken'

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws: WebSocket, request) {
    const url = request.url;
    if (!url)
        return

    const queryparams = new URLSearchParams(url.split('?')[1]);
    const token = queryparams.get('token') || null;
    const decoded = jwt.verify(token, JWT_SECREt)
    if (!decoded || !(decoded as JwtPayload).userId){
        ws.close();
        return;
    } 
        

    ws.on('message', function message(data: Buffer) {
        ws.send('pong');
        console.log('received: %s', data);
    });

}); 