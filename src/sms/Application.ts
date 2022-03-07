import * as express from 'express';
import ws from 'express-ws';
import mfs from '../services/mfs';
import udpgiap from '../services/udpgiap';
import udpr from '../services/udpr';
import wsrs from '../services/wsrs';
import pns from '../services/pns';
import ums from '../services/ums';

const SHORTCUT : string = "sms";
const NAME : string = "Service Management System";
const VERSION : string = "1.0.0";
const AUTHOR : string = "Kai Mayer";
const EMAIL : string = "kai.mayer@t-online.de";

export class Application {
    private app : express.Application = express.default();
    private router : express.Router = express.Router();
    private port : number;
    private services : Route[];
    private createdOn : Date = new Date();

    constructor(port : number) {
        this.port = port;
        //this.app.use(express.default.json());
        ws(this.app);
        this.routes();

        this.services = [
            { path : "/sms", router : this.router },
            { path : "/wsrs", router : wsrs.getRouter() },
            { path : "/udpr", router : udpr.getRouter() },
            { path : "/udpgiap", router: udpgiap.getRouter() },
            { path : "/mfs", router: mfs.getRouter() },
            { path : "/pns", router: pns.getRouter() },
            { path : "/ums", router: ums.getRouter() }
        ];

        udpgiap.run(19302, 19377);
    } 

    public run() : void {
        this.services.forEach((service) => {
            this.app.use(service.path, service.router);
        });
    
        this.app.listen(this.port);
    }

    private routes() {
        this.router.get('/info', (req : express.Request, res : express.Response) : void => {
            let result = {
                shortcut : SHORTCUT,
                name : NAME,
                version : VERSION,
                author : AUTHOR,
                email : EMAIL,
                running : (((new Date()).getTime() - this.createdOn.getTime()) / 1000).toFixed(0) + 's'
            }
            res.status(200).send(JSON.stringify(result));
        });
    }
}