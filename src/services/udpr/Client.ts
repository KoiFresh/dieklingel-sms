import events, { EventEmitter } from "events";

export class Client extends EventEmitter {
    private _time : number = 30000;
    private _ip : string;
    private _port : number;
    private _timeout : NodeJS.Timeout;

    constructor(ip : string, port : number, timeout : number = 30000) {
        super();
        this._ip = ip;
        this._port = port;
        this._time = timeout;
        this._timeout = setTimeout(this.emit.bind(this, "timeout") , this._time);

    } 

    public get ip() {
        return this._ip;
    }

    public set ip(ip : string) {
        this._ip = ip;
    }

    public get port() {
        return this._port;
    }

    public set port(port : number) {
        this._port = port;
    }

    public get time() {
        return this._time;
    }

    public set time(time : number) {
        this._time = time;
    }

    private get timeout() {
        return this._timeout;
    }

    private set timeout(timeout : ReturnType<typeof setTimeout>) {
        this._timeout = timeout;
    }
    
    public resetTimeout() : void {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.emit.bind(this, "timeout") , this._time);
    }
}