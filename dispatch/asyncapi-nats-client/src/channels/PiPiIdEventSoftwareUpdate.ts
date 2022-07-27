import SoftwareUpdateReply from '../models/SoftwareUpdateReply';
import SoftwareUpdateRequest from '../models/SoftwareUpdateRequest';
import * as Nats from 'nats';
import {
  ErrorCode,
  NatsTypescriptTemplateError
} from '../NatsTypescriptTemplateError';
/**
 * Module which wraps functionality for the `pi/{pi_id}/event/software_update` channel
 * @module piPiIdEventSoftwareUpdate
 */
/**
 * Internal functionality to send request to the `pi/{pi_id}/event/software_update` channel 
 * 
 * @param requestMessage to send
 * @param nc to send request with
 * @param codec used to convert messages
 * @param pi_id parameter to use in topic
 * @param options to use for the request
 */
export function request(
  requestMessage: SoftwareUpdateRequest,
  nc: Nats.NatsConnection,
  codec: Nats.Codec < any > , pi_id: Number,
  options ? : Nats.RequestOptions
): Promise < SoftwareUpdateReply > {
  return new Promise(async (resolve, reject) => {
    try {
      let dataToSend: any = codec.encode(requestMessage.marshal());
      const msg = await nc.request(`pi.${pi_id}.event.software_update`, dataToSend, options)
      let receivedData = codec.decode(msg.data);
      resolve(SoftwareUpdateReply.unmarshal(receivedData));
    } catch (e: any) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
      return;
    }
  })
}