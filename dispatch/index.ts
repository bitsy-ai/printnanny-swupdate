import { NatsAsyncApiClient, SoftwareUpdateRequest } from 'asyncapi-nats-client';
import { getPrintNannyEnv } from '../printnanny-env';
/**
 * Send a request to turn on the specific streetlight.
 */
export async function sendRequest() {
    const printNannyEnv = getPrintNannyEnv()
    const client = new NatsAsyncApiClient();
    try {
        switch (printNannyEnv.env) {
            case "live":
                await client.connectToLive();
            case "lan":
                await client.connectToLan();
            case "local":
            default:
                await client.connectToLocal();
        }
        await client.connectToLocal();
        const requestMessage = new SoftwareUpdateRequest({
            displayName: "0.3.0 (Cinnabar Kirkstone)",
            version: "0.3.0",
            checksumTxtUrl: "",
            checksumTxtGpgUrl: "",
            swuUrl: "",
            manifestUrl: "",
            imageWicUrl: "",
            imageWicBmapUrl: ""

        })
        const pi_id = 1;
        const response = await client.requestPiPiIdEventSoftwareUpdate(requestMessage, pi_id);
        console.log(`Received response ${response.marshal()} for pi with id ${pi_id}`);
    } catch (e) {
        console.log(e)
    }
    await client.disconnect();
}

sendRequest();
