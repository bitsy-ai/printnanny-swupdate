import { NatsAsyncApiClient, SoftwareUpdateRequest, NatsTypescriptTemplateError, SoftwareUpdateReply } from 'asyncapi-nats-client';
import { exit } from 'process';
import SoftwareUpdateStatus from './asyncapi-nats-client/src/models/SoftwareUpdateStatus';
import { downloadUpdate, applyUpdate } from './download';
/**
 * Send a request to turn on the specific Raspberry Pi
 */

export async function sendReply() {
    const client = new NatsAsyncApiClient();
    await client.connectToLocal();

    const onRequest = async (err?: NatsTypescriptTemplateError, msg?: SoftwareUpdateRequest, pi_id?: Number): Promise<SoftwareUpdateReply> => {
        if (err) {
            console.log(err);
        }
        const PRINTNANNY_TMP_DIR = process.env.PRINTNANNY_PI_ID || ".tmp";

        console.log(`Received ${msg?.marshal()} for pit ${pi_id}`);
        console.log(`Downloading ${msg?.swuUrl} to ${PRINTNANNY_TMP_DIR}`);

        if (msg === undefined) {
            console.error("failed to parse msg, got undefined")
            exit(1)
        }
        const fileName = await downloadUpdate(msg?.swuUrl);
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

    let PRINTNANNY_PI_ID: number | undefined = process.env.PRINTNANNY_PI_ID === undefined ? undefined : parseInt(process.env.PRINTNANNY_PI_ID);

    if (PRINTNANNY_PI_ID === undefined) {
        console.error('PRINTNANNY_PI_ID is not set. Re-run with export PRINTNANNY_PI_ID="<PrintNanny Pi Unique Id>"')
        exit(1)
    }

    await client.replyToPiPiIdEventSoftwareUpdate(onRequest, (error) => { console.error(error); }, PRINTNANNY_PI_ID, undefined, { max: 1 });
}

sendReply();
