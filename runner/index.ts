import { NatsAsyncApiClient, SoftwareUpdateRequest, NatsTypescriptTemplateError, SoftwareUpdateReply } from 'asyncapi-nats-client';
import SoftwareUpdateStatus from './asyncapi-nats-client/src/models/SoftwareUpdateStatus'
/**
 * Send a request to turn on the specific streetlight.
 */

const piToListenFor = 1;

export async function sendRequest() {
    const client = new NatsAsyncApiClient();
    await client.connectToLocal();

    const onRequest = async (err?: NatsTypescriptTemplateError, msg?: SoftwareUpdateRequest, pi_id?: Number): Promise<SoftwareUpdateReply> => {
        if (err) {
            console.log(err);
        }
        console.log(`Received ${msg?.marshal()} for pit ${pi_id}`);
        const replyMessage = new SoftwareUpdateReply({
            detail: "Starting software update",
            status: SoftwareUpdateStatus.STARTED
        })
        setTimeout(async () => {
            await client.disconnect();
        }, 100);
        return replyMessage;
    }

    await client.replyToPiPiIdEventSoftwareUpdate(onRequest, (error) => { console.error(error); }, piToListenFor, undefined, { max: 1 });
}

sendRequest();
