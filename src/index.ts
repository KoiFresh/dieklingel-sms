import * as dotenv from 'dotenv';
import {Application} from './sms/Application';

/**
 * the main entry point of the application
 */
function main() {
    dotenv.config();   
    process.title = process.env.TITLE || "dieklingel-sms";
    let port : number = Number(process.env.PORT);
    let app = new Application(port);
    app.run();
}

if (require.main === module) {
    main();
}