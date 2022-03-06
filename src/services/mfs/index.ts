import * as express from 'express';
import fs from 'fs';
import fileUpload, { FileArray, UploadedFile } from 'express-fileupload';

const SHORTCUT : string = "mfs";
const NAME : string = "Managed File Storage";
const VERSION : string = "1.0.0";
const AUTHOR : string = "Kai Mayer";
const EMAIL : string = "kai.mayer@t-online.de";

const createdOn : Date = new Date();
const router : express.Router = express.Router();
const FILE_PATH = "/tmp/mfs/upload/";

console.info("Service '" + NAME +"' loaded.");

router.use(express.default.urlencoded({extended : true}));
router.use(fileUpload());

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

router.post('/upload', (req : express.Request, res : express.Response) => {
    let files : FileArray | undefined = req.files;
    if(undefined == files) {
        res.status(400).send(JSON.stringify({error:'no file was uploaded' }));
        return;
    }

    let result = [];

    for(const [key, value] of Object.entries(files)) {
        let file : UploadedFile = (Array.isArray(value)) ? value[0] : value;
        let regex = /(?:\.([^.]+))?$/;
        let ext : string = regex.exec(file.name)?.at(1) || "";
        if("" == ext) {
            continue;
        }
        let name = makeId(32) + "." + ext;
        try {
            fs.mkdirSync(FILE_PATH, {recursive: true});
            fs.writeFileSync(FILE_PATH + name, file.data);
            result.push( {name : file.name, key: name} );
            setTimeout(() => {
                fs.unlinkSync(FILE_PATH + name);
            }, 600000); // 10 mins
        }catch(error) {
            res.status(503).send(JSON.stringify({error: error }));
        }
    }
    res.send(JSON.stringify(result));
});

router.get('/file', (req : express.Request, res : express.Response) => {
    let name : string | undefined = req.query.name?.toString();
    if(undefined == name) {
        res.status(400).send(JSON.stringify({ error : 'filename was missing'}));
        return;
    }
    if(!fs.existsSync(FILE_PATH + name)) {
        res.status(404).send(JSON.stringify({ error : 'file not found'}));
        return;
    }
    res.sendFile(FILE_PATH + name);
});

/**
 * get a random id 
 * @param length the lengt of the id
 * @returns a random id
 */
function makeId(length : number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default {
    "getRouter": () => { return router },
}