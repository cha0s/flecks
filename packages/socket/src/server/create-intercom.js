import {D} from '@flecks/core';

const debug = D('@flecks/socket/intercom');

export default function createIntercom(sockets, transport) {
  return async function intercom(type, payload) {
    debug('@flecks/socket.s: %s(%o)', transport, type, payload);
    const responses = await new Promise((resolve, reject) => {
      sockets.io.serverSideEmit(
        '@flecks/socket.intercom',
        {payload, type},
        (error, responses) => (error ? reject(error) : resolve(responses)),
      );
    });
    responses.push(
      await new Promise((resolve) => sockets.localIntercom({payload, type}, resolve)),
    );
    return responses;
  };
}
