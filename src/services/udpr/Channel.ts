import dgram, { RemoteInfo, Socket } from "dgram";
import EventEmitter from "events";
import { Client } from "./Client";

const CHANNEL_TIMEOUT = 60000;

export class Channel extends EventEmitter {
    private _key : string;
    private _clients : Client[] = new Array();
    private _socket : Socket = dgram.createSocket("udp4");
    private _port : number;
    private _timeout : NodeJS.Timeout;

    constructor(key : string, port : number) {
        super();
        this._key = key;    
        this._port = port;
        this._socket.on("message", (message : string, info : RemoteInfo) => {   
            let index = this.clients.findIndex((client) => {
                return client.ip == info.address && client.port == info.port;
            });
            if(index < 0) {
                this.clients.push(new Client(info.address, info.port));
            }
            this.clients.forEach((client) => {
                if(client.ip != info.address || client.port != info.port) {
                    this.socket.send(message, client.port, client.ip);
                }
            });
        });
        this._socket.bind(port);
        this._timeout = setTimeout(this.emit.bind(this, "inactive"), CHANNEL_TIMEOUT);
        this.on("inactive", () => {
            this.socket.close();
        });
    }

    public get key() {
        return this._key;
    }

    public get clients() {
        return this._clients;
    }

    private get socket() {
        return this._socket;
    }

    public get port() {
        return this._port;
    }

    private get timeout() {
        return this._timeout;
    }

    private set timeout(timeout : NodeJS.Timeout) {
        this._timeout = timeout;
    }

    public add(client : Client) {
        let index = this.clients.findIndex(element => element == client);
        if(index >= 0) {
            return;
        }
        this.clients.push(client);
        clearTimeout(this.timeout);
        client.on("timeout", () => {
            this.clients.splice(index, 1);
            if(this.clients.length <= 0) {
                this.timeout = setTimeout(this.emit.bind(this, "inactive"), CHANNEL_TIMEOUT);  
            }
        });
    }
}