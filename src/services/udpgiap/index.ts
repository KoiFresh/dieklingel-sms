import * as express from 'express';
import dgram from 'dgram';
import { RequestChangeBehavior } from './RequestChangeBehavior';

const SHORTCUT : string = "udpgiap";
const NAME : string = "User Datagram Protocol get IP and Port";
const VERSION : string = "1.0.0";
const AUTHOR : string = "Kai Mayer";
const EMAIL : string = "kai.mayer@t-online.de";

const createdOn : Date = new Date();
const router : express.Router = express.Router();
const socket : any = dgram.createSocket('udp4');
const socket1 : dgram.Socket = dgram.createSocket('udp4');

console.info("Service '" + NAME +"' loaded.");

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

function run(port0 : number, port1 : number) {
    socket.on('error', (error : any) : void => {
        socket.close();
    });

    socket.on('message', (message : string, sender : any) : void => {
        let result = addressToByteArray(sender.address, sender.port);
        let received = Buffer.from(message);
        let request = received[0] & 255;
        //console.log("recv: " + request);
        switch(request) {
            case RequestChangeBehavior.Ip:
                // Do nothing, cause we cant change ip
                break;
            case RequestChangeBehavior.Port:
                socket1.send(Buffer.from(result), sender.port, sender.address);
                break;
            case RequestChangeBehavior.IpAndPort:
                // Do nothing, cause we cant change ip
                break;
            case RequestChangeBehavior.None:
            default:
                socket.send(Buffer.from(result), sender.port, sender.address);
                break;
        }
        
    });

    socket.bind(port0);
    socket1.bind(port1);
}

/**
 * convert an ip and a port to 6 byte representation
 * @param ip 
 * @param port 
 * @returns 
 */
 function addressToByteArray(ip : string, port : number) : number[] {
    let nums : string[] = (ip + "." + port.toString()).split('.');
    let bytes : number[] = new Array();
    // ip and port to 6 bytes 
    bytes[0] = parseInt(nums[0]);
    bytes[1] = parseInt(nums[1]);
    bytes[2] = parseInt(nums[2]);
    bytes[3] = parseInt(nums[3]);
    bytes[5] = parseInt(nums[4]) & 0xff;
    let rest = ((parseInt(nums[4]) - bytes[5]) / 256);
    bytes[4] = rest & 0xff;
    return bytes;
}

export default {
    "getRouter": () => { return router },
    "run" : run
}