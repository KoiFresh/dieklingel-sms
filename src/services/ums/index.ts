import * as express from 'express';

const SHORTCUT : string = "ums";
const NAME : string = "User Management System";
const VERSION : string = "1.0.0";
const AUTHOR : string = "Kai Mayer";
const EMAIL : string = "kai.mayer@t-online.de";

const createdOn : Date = new Date();
const router : express.Router = express.Router();

console.info("Service '" + NAME +"' loaded.");

router.use(express.static(__dirname + '/@vue'));

export default {
    "getRouter": () => { return router }
}