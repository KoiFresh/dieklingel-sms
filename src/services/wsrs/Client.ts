import { WebSocket } from "ws";

export class Client {
    private _roomKey : string;
    private _ws : WebSocket;

    constructor(ws : WebSocket, key : string) {
        this._ws = ws;
        this._roomKey = key;
    }

    /**
     * get the roomkey of the client
     */
    public get roomKey() {
        return this._roomKey;
    }

    /**
     * set the roomKey of this client
     */
    public set roomKey(key : string) {
        this._roomKey = key;
    }

    /**
     * get the socket of the client
     */
    public get socket() {
        return this._ws;
    }

    /**
     * send a message to the client
     * @param message 
     */
    public send(message : string) : void {
        this._ws.send(message);
    } 
}