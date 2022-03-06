import * as express from 'express';
import { reduceEachLeadingCommentRange } from 'typescript';
import axios, { AxiosRequestConfig } from 'axios';
import { google } from 'googleapis';

const SHORTCUT : string = "pns";
const NAME : string = "Push Notification Service";
const VERSION : string = "1.0.0";
const AUTHOR : string = "Kai Mayer";
const EMAIL : string = "kai.mayer@t-online.de";

const createdOn : Date = new Date();
const router : express.Router = express.Router();

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

router.post('/send', (req : express.Request, res : express.Response) => {
    console.log("send pns");
    let notify : PushNotification = req.body;

    requestAccessToken().then((token) => {
        console.log(token);
        notify.receivers.forEach((deviceToken) => {
            let fcm = {
                "message": {
                    "token": deviceToken,
                    "android": {
                        "notification": {
                            "title": notify.title,
                            "body": notify.body,
                            "sound": "ringtone",
                            "icon": "icon_16x16"
                        }
                    },
                    "apns": {
                        "payload": {
                            "aps": {
                                "alert": {
                                    "title": notify.title,
                                    "subtitle": notify.subtitle,
                                    "body": notify.body,
                                },
                                "sound": "ringtone.wav",
                                "mutable-content": 1
                            }
                        },
                        "fcm_options": {
                            "image": notify.image
                        }
                    }
                }
            }
           
            let config : AxiosRequestConfig = {
                method : 'post',
                url : 'https://fcm.googleapis.com/v1/projects/dieklingel/messages:send',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data: JSON.stringify(fcm)
            }

            axios(config)
                .catch((error) => { console.log(error)});
        });
    });
    
    res.sendStatus(200);
});

function requestAccessToken() {
    return new Promise<string>((resolve, reject) => {
        let key = require('/home/dieklingel/dieklingel-fcm-httpv1-service.json');
        let jwtClient = new google.auth.JWT(
            key.client_email,
            undefined,
            key.private_key,
            ["https://www.googleapis.com/auth/firebase.messaging"],
            undefined
        );
        jwtClient.authorize((error : any, tokens : any) => {
            if(error) {
                reject(error);
                return;    
            }
            resolve(tokens.access_token);
        });
    });
}

export default {
    "getRouter": () => { return router },
}