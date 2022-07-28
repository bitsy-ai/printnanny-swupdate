import { NatsAsyncApiClient, SoftwareUpdateRequest, NatsTypescriptTemplateError, SoftwareUpdateReply } from 'asyncapi-nats-client';
import SoftwareUpdateStatus from './asyncapi-nats-client/src/models/SoftwareUpdateStatus';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { spawn } from 'child_process';

/**
 * Send a request to turn on the specific streetlight.
 */

const piToListenFor = 1;

const PRINTNANNY_PI_ID = process.env.PRINTNANNY_PI_ID;

if (PRINTNANNY_PI_ID === undefined) {
    console.error('PRINTNANNY_PI_ID is not set. Re-run with export PRINTNANNY_PI_ID="<PrintNanny Pi Unique Id>"')
}
const PRINTNANNY_TMP_DIR = process.env.PRINTNANNY_PI_ID || ".tmp";


async function downloadToFile(outFile: string, swuUrl: string): Promise<string> {
    const file = fs.createWriteStream(outFile);
    return new Promise((resolve, reject) => {
        https.get(swuUrl, function (response) {
            response.pipe(file);
            // after download completed close filestream
            file.on("finish", () => {
                file.close();
                console.log(`Finished downloading ${swuUrl} to ${outFile}`);
                resolve(outFile)
            });
        });
    })

}
/**
 * Returns promise of downloaded filename
 * @param url 
 * @param version 
 */
async function downloadUpdate(swuUrl: string): Promise<string> {
    const urlParts = swuUrl.split('/');
    const fileName = urlParts[urlParts.length - 1]
    const outFile = path.resolve(PRINTNANNY_TMP_DIR, fileName)
    // create outfile directories
    await fs.promises.mkdir(outFile, { recursive: true }).catch(console.error);
    return downloadToFile(outFile, swuUrl);
}

/**
 * Apply software update via swupdate-client CLI
 */
function applyUpdate(fileName: string): void {
    const cmd = spawn('swupdate', ['-v', '-i', fileName]);
    cmd.stdout.on('data', (data) => {
        console.log('swupdate: ', data)
    });
    cmd.stderr.on('data', (data) => {
        console.error('swupdate: ', data)
    });
    cmd.on('close', (code) => {
        console.log(`software update exited with ${code}`);
    });
}


export async function sendRequest() {
    const client = new NatsAsyncApiClient();
    await client.connectToLocal();

    const onRequest = async (err?: NatsTypescriptTemplateError, msg?: SoftwareUpdateRequest, pi_id?: Number): Promise<SoftwareUpdateReply> => {
        if (err) {
            console.log(err);
        }
        console.log(`Received ${msg?.marshal()} for pit ${pi_id}`);
        console.log(`Downloading ${msg?.swuUrl} to ${PRINTNANNY_TMP_DIR}`);
        const fileName = await downloadUpdate(msg.swuUrl);
        applyUpdate(fileName);
        const replyMessage = new SoftwareUpdateReply({
            detail: "Starting software update",
            status: SoftwareUpdateStatus.STARTED
        })
        setTimeout(async () => {
            await client.disconnect();
        }, 500);
        return replyMessage;
    }

    await client.replyToPiPiIdEventSoftwareUpdate(onRequest, (error) => { console.error(error); }, piToListenFor, undefined, { max: 1 });
}

sendRequest();
