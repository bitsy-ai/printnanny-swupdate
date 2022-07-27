import SoftwareUpdateReply from '../../models/SoftwareUpdateReply';
import SoftwareUpdateRequest from '../../models/SoftwareUpdateRequest';
import * as Nats from 'nats';
import {
  ErrorCode,
  NatsTypescriptTemplateError
} from '../../NatsTypescriptTemplateError';
/**
 * Module which wraps functionality for the `pi/{pi_id}/event/software_update` channel
 * @module piPiIdEventSoftwareUpdate
 */
/**
 * Internal functionality to setup reply to the `pi/{pi_id}/event/software_update` channel
 * 
 * @param onRequest called when request is received
 * @param onReplyError called when it was not possible to send the reply
 * @param client to setup reply with
 * @param codec used to convert messages
 * @param pi_id parameter to use in topic
 * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
 */
export function reply(
  onRequest: (
    err ? : NatsTypescriptTemplateError,
    msg ? : SoftwareUpdateRequest, pi_id ? : Number
  ) => Promise < SoftwareUpdateReply > ,
  onReplyError: (err: NatsTypescriptTemplateError) => void,
  nc: Nats.NatsConnection,
  codec: Nats.Codec < any > , pi_id: Number,
  options ? : Nats.SubscriptionOptions
): Promise < Nats.Subscription > {
  return new Promise(async (resolve, reject) => {
    try {
      let subscribeOptions: Nats.SubscriptionOptions = {
        ...options
      };
      let subscription = nc.subscribe(`pi.${pi_id}.event.software_update`, subscribeOptions);
      (async () => {
        for await (const msg of subscription) {
          const unmodifiedChannel = `pi.{pi_id}.event.software_update`;
          let channel = msg.subject;
          const piIdSplit = unmodifiedChannel.split("{pi_id}");
          const splits = [
            piIdSplit[0],
            piIdSplit[1]
          ];
          channel = channel.substring(splits[0].length);
          const piIdEnd = channel.indexOf(splits[1]);
          const piIdParam = Number(channel.substring(0, piIdEnd));
          let receivedData: any = codec.decode(msg.data);
          let replyMessage = await onRequest(undefined, SoftwareUpdateRequest.unmarshal(receivedData), piIdParam);
          if (msg.reply) {
            let dataToSend: any = replyMessage.marshal();
            dataToSend = codec.encode(dataToSend);
            msg.respond(dataToSend);
          } else {
            let error = new NatsTypescriptTemplateError('Expected request to need a reply, did not..', '000');
            onReplyError(error)
            return;
          }
        }
      })();
      resolve(subscription);
    } catch (e: any) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}