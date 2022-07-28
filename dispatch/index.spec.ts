jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
const errorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => { return; });
import { SoftwareUpdateReply, TestClient } from 'asyncapi-nats-client';
import SoftwareUpdateStatus from 'asyncapi-nats-client/src/models/SoftwareUpdateStatus';
import { sendRequest } from './index';

describe('Should be able to receive request from example', () => {
  let testClient: TestClient.NatsAsyncApiTestClient;
  beforeAll(async () => {
    testClient = new TestClient.NatsAsyncApiTestClient();
    await testClient.connectToLocal();
  })
  afterAll(async () => {
    await testClient.disconnect();
    jest.restoreAllMocks();
  });
  test('and receive correct data', async () => {
    await testClient.replyToPiPiIdEventSoftwareUpdate(
      async (err) => {
        if (err) {
          console.error(err);
        }
        const replyMessage = new SoftwareUpdateReply({
          status: SoftwareUpdateStatus.STARTED,
          detail: "test"
        });
        return replyMessage;
      },
      (error) => {
        console.error(error);
      },
      1
    );
    await sendRequest();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});