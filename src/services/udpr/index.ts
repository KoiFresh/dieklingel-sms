import * as express from 'express';
import { Channel } from './Channel';

const SHORTCUT : string = "udpr";
const NAME : string = "User Datagram Protocol Relay";
const VERSION : string = "1.0.0";
const AUTHOR : string = "Kai Mayer";
const EMAIL : string = "kai.mayer@t-online.de";

const UDP_RELAY_MIN_PORT = 32001;
const UDP_RELAY_MAX_PORT = 32010;
const MAX_CHANNELS = UDP_RELAY_MAX_PORT - UDP_RELAY_MIN_PORT + 1;

const createdOn : Date = new Date();
const router : express.Router = express.Router();
let channels : Channel[] = new Array();

console.info("Service '" + NAME +"' loaded.");

router.use(express.default.json());

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

// get port and id
router.get('/', (req : express.Request, res : express.Response) => {
    let key : string | undefined = req.query.key?.toString();
    if(key == undefined) {
        res.sendStatus(400);
        return;
    }
    let channel : Channel | undefined = getChannel(key);
    if(undefined == channel) {
        res.sendStatus(416);
        return;
    }
    let result = {
        port: channel.port
    };
    channel.on("inactive", () => {
        if(channel?.key !== undefined) {
            removeChannel(channel.key);
        }
    })
    res.status(200).send(JSON.stringify(result));
});

/**
 * get a channel by his key, if not exists channel will be created
 * @param key of the channel to get
 * @returns the channel
 */
function getChannel(key : string) : Channel | undefined {
    let index : number = channels.findIndex(channel => channel.key == key);
    if(index >= 0) {
        return channels[index];
    }
    for(let port = UDP_RELAY_MIN_PORT;port <= UDP_RELAY_MAX_PORT; port++) {
        let index = channels.findIndex(channel => channel.port == port);
        if(index < 0) {
            let channel : Channel = new Channel(key, port);
            channels.push(channel);
            return channel;
        }
    }
    return undefined;
}

/**
 * remove a channel by his key
 * @param key of the channel to remove
 */
function removeChannel(key : string) : void {
    let index = channels.findIndex(channel => channel.key == key);
    if(index < 0) {
        return;
    }  
    channels.splice(index, 1);
}


export default {
    "getRouter": () => { return router }
}