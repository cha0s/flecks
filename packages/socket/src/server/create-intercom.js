import {D} from '@flecks/core';

const debug = D('@flecks/socket/intercom');

export default function createIntercom(server, transport) {
  return async function intercom(type, payload) {
    debug('@flecks/socket.s: %s(%o)', transport, type, payload);
    const responses = await new Promise((resolve, reject) => {
      server.io.serverSideEmit(
        '@flecks/socket.intercom',
        {payload, type},
        (error, responses) => (error ? reject(error) : resolve(responses)),
      );
    });
    responses.push(
      await new Promise((resolve) => {
        server.localIntercom({payload, type}, resolve);
      }),
    );
    return responses;
  };
}
