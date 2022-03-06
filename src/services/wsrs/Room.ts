import { Client } from './Client';

export class Room {
    private _size : number = 2;
    private _count : number = 0;
    private _members : Client[] = new Array();
    private _key : string;

    constructor(key : string) {
        this._key = key;
    }

    /**
     * get the size of the room. It can only as much clients in a room as high as the size is.
     */
    public get size() {
        return this._size;
    }

    /**
     * set the size of the room. Default is two
     */
    public set size(size : number) {
        this._size = size;
    }

    /**
     * get the current number of clients in this room
     */
    public get count() {
        return this._count;
    }

    /**
     * set the current number of clients in this room
     */
    private set count(count : number) {
        this.count = count;
    }

    /**
     * get call current members of the room
     */
    public get members() {
        return this._members;
    }

    /**
     * get the key of the room
     */
    public get key() {
        return this._key;
    }

    /**
     * add a new client to the room
     * @param client to add
     */
    public add(client : Client) : void {
        this.members.push(client);
        client.socket.on("close", () => {
            this.remove(client);
        });
        client.socket.on("message", (message : string) => {
            this.write(message, new Array(client));
        });
    }

    /**
     * remove a client from the room
     * @param client to remove
     */
    public remove(client : Client) : void {
        let index : number = this.members.findIndex((element) => client == element);
        if(index >= 0) {
            this.members.splice(index, 1);
        }
    }

    /**
     * 
     * @param message write a message to all Clients except the excluded
     * @param excluded 
     */
    public write(message : string, excluded : Client[])
    {
        this.members.forEach((member) => {
            if (!excluded.includes(member)) {
                member.send(message);
            }
        });
    }
}