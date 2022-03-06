import * as express from 'express';
import exws, { WebsocketRequestHandler } from 'express-ws';
import { WebSocket } from 'ws';
import { Room } from './Room';
import { Client } from './Client';

const SHORTCUT : string = "wsrs";
const NAME : string = "Websocket Room Service";
const VERSION : string = "1.0.0";
const AUTHOR : string = "Kai Mayer";
const EMAIL : string = "kai.mayer@t-online.de";

const createdOn : Date = new Date();

let router : exws.Router | null = null;
let rooms : Room[] = [];

console.info("Service '" + NAME +"' loaded.");

/** 
 * get the router for the wsrs service if not configured already configure now
*/
function getRouter() : exws.Router {
    if (router != null) {
        return router;
    }
    router = <exws.Router>express.Router();
    router.use(express.default.text());

    router.get('/info', (req : express.Request, res : express.Response) => {
        let result = {
            shortcut : SHORTCUT,
            name : NAME,
            version : VERSION,
            author : AUTHOR,
            email : EMAIL,
            running : (((new Date()).getTime() - createdOn.getTime()) / 1000).toFixed(0) + 's'
        }
        res.status(200).send(JSON.stringify(result));
    });

    router.ws("/room", (ws: WebSocket, req : express.Request) => {
        let keys : string | string[] | undefined = <string[]>req.query.key
        if(keys == undefined) { // key not defined
            //console.log("!!no key");
            ws.close();
            return;
        }
        if(typeof keys == "string") {
            keys = [keys];
        }
        keys.forEach((key) => {
            let room : Room | undefined = rooms.find(element =>  { return element.key == key; });
            if(room == undefined) {
                room = new Room(key);
                rooms.push(room);
            }
            let client : Client = new Client(ws, key);
            room.add(client);
        });
    });

    return router;
}

export default {
    "getRouter": getRouter 
};