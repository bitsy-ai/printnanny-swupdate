import {
  describe,
  it,
  before
} from 'mocha';
import {
  expect
} from 'chai';
import * as Client from '../../src'
import * as TestClient from '../../src/testclient'
import {
  NatsTypescriptTemplateError
} from '../../src/NatsTypescriptTemplateError';
describe('pi/{pi_id}/event/software_update can talk to itself', () => {
  var client: Client.NatsAsyncApiClient;
  var testClient: TestClient.NatsAsyncApiTestClient;
  before(async () => {
    client = new Client.NatsAsyncApiClient();
    testClient = new TestClient.NatsAsyncApiTestClient();
    const natsHost = process.env.NATS_HOST || "0.0.0.0"
    const natsPort = process.env.NATS_PORT || "4222"
    const natsUrl = `${natsHost}:${natsPort}`
    await client.connectToHost(natsUrl);
    await testClient.connectToHost(natsUrl);
  });
  it('can send message', async () => {
    var receivedError: NatsTypescriptTemplateError | undefined = undefined;
    var receivedMsg: TestClient.SoftwareUpdateRequest | undefined = undefined;
    var receivedPiId: Number | undefined = undefined
    var replyMessage: Client.SoftwareUpdateReply = Client.SoftwareUpdateReply.unmarshal({
      "status": "Started",
      "detail": "string",
      "exit_code": 0
    });
    var receiveMessage: TestClient.SoftwareUpdateRequest = TestClient.SoftwareUpdateRequest.unmarshal({
      "display_name": "string",
      "version": "string",
      "checksum_txt_url": "string",
      "checksum_txt_gpg_url": "string",
      "swu_url": "string",
      "manifest_url": "string",
      "image_wic_url": "string",
      "image_wic_bmap_url": "string"
    });
    var PiIdToSend: Number = ""
    const replySubscription = await client.replyToPiPiIdEventSoftwareUpdate((err, msg, pi_id) => {
        return new Promise((resolve, reject) => {
          receivedError = err;
          receivedMsg = msg;
          receivedPiId = pi_id
          resolve(replyMessage);
        })
      },
      (err) => {
        console.log(err)
      }, PiIdToSend,
      true
    );
    var reply = await testClient.requestPiPiIdEventSoftwareUpdate(receiveMessage, PiIdToSend);
    expect(reply).to.be.deep.equal(replyMessage)
    expect(receivedError).to.be.undefined;
    expect(receivedMsg).to.not.be.undefined;
    expect(receivedMsg!.marshal()).to.equal(receiveMessage.marshal());
    expect(receivedPiId).to.be.equal(PiIdToSend);
  });
  after(async () => {
    await client.disconnect();
    await testClient.disconnect();
  });
});