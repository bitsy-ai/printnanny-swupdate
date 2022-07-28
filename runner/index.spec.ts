jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
const errorSpy = jest.spyOn(global.console, 'error');
import { SoftwareUpdateRequest, TestClient } from './asyncapi-nats-client';


import * as download from './download';
const mockApplyUpdate = jest.spyOn(download, 'applyUpdate').mockImplementation(fileName => { return fileName; });
const mockDownloadUpdate = jest.spyOn(download, 'downloadUpdate').mockImplementation(updateUrl => { return Promise.resolve(updateUrl); });
import { sendReply } from './index';
jest.spyOn(global.console, 'log').mockImplementation(() => { return; });
describe('Should be able to setup reply', () => {

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
    await sendReply();
    const requestMessage = new SoftwareUpdateRequest({
      displayName: "0.3.0 (Cinnabar Kirkstone)",
      version: "0.3.0",
      checksumTxtUrl: "",
      checksumTxtGpgUrl: "",
      swuUrl: "https://github.com/bitsy-ai/printnanny-os/releases/download/0.2.0/printnanny-octoprint-image-raspberrypi4-64-20220708221607.swu",
      manifestUrl: "",
      imageWicUrl: "",
      imageWicBmapUrl: ""
    });
    const pi_id = 1;
    try {
      const reply1 = await testClient.requestPiPiIdEventSoftwareUpdate(requestMessage, pi_id);
      expect(reply1).not.toBeUndefined();
    } catch (error) {
      console.error(error);
    }
    expect(errorSpy).not.toHaveBeenCalled();
    expect(mockApplyUpdate).toHaveBeenCalled();
    expect(mockDownloadUpdate).toHaveBeenCalled()
  });
});