import {ByType, Flecks} from '@flecks/core';

import LimitedPacket from './limited-packet';
import createLimiter from './limiter';

export {default as createLimiter} from './limiter';

export const hooks = {
  '@flecks/core.config': () => ({
    /**
     * All keys used to determine fingerprint.
     */
    keys: ['ip'],
    web: {
      keys: ['ip'],
      points: 60,
      duration: 30,
      ttl: 30,
    },
    socket: {
      keys: ['ip'],
      points: 60,
      duration: 30,
      ttl: 30,
    },
  }),
  '@flecks/db/server.models': Flecks.provide(require.context('./models', false, /\.js$/)),
  '@flecks/web/server.request.route': (flecks) => {
    const {web} = flecks.get('@flecks/governor/server');
    return async (req, res, next) => {
      const {Ban} = flecks.db.Models;
      try {
        await Ban.check(req);
      }
      catch (error) {
        res.status(403).send(`<pre>${error.message}</pre>`);
        return;
      }
      req.ban = async (keys, ttl = 0) => {
        const ban = Ban.fromRequest(req, keys, ttl);
        await Ban.create({...ban});
        res.status(403).send(`<pre>${Ban.format([ban])}</pre>`);
      };
      try {
        await flecks.governor.web.consume(req.ip);
        next();
      }
      catch (error) {
        const {ttl, keys} = web;
        const ban = Ban.fromRequest(req, keys, ttl);
        await Ban.create({...ban});
        res.status(429).send(`<pre>${Ban.format([ban])}</pre>`);
      }
    };
  },
  '@flecks/server.up': Flecks.priority(
    async (flecks) => {
      if (flecks.fleck('@flecks/web/server')) {
        const {web} = flecks.get('@flecks/governor/server');
        flecks.governor.web = await createLimiter(
          flecks,
          {
            keyPrefix: '@flecks/governor.web.request.route',
            ...web,
          },
        );
      }
      if (flecks.fleck('@flecks/socket/server')) {
        flecks.governor.packet = Object.fromEntries(
          await Promise.all(
            Object.entries(flecks.socket.Packets[ByType])
              .filter(([, Packet]) => Packet.limit)
              .map(async ([name, Packet]) => (
                [
                  name,
                  await createLimiter(
                    flecks,
                    {keyPrefix: `@flecks/governor.packet.${name}`, ...Packet.limit},
                  ),
                ]
              )),
          ),
        );
        const {socket} = flecks.get('@flecks/governor/server');
        flecks.governor.socket = await createLimiter(
          flecks,
          {
            keyPrefix: '@flecks/governor.socket.request.socket',
            ...socket,
          },
        );
      }
    },
    {after: '@flecks/redis/server'},
  ),
  '@flecks/socket/server.request.socket': (flecks) => (
    async (socket, next) => {
      const {handshake: req} = socket;
      const {Ban} = flecks.db.Models;
      try {
        await Ban.check(req);
      }
      catch (error) {
        next(error);
        return;
      }
      req.ban = async (keys, ttl) => {
        await Ban.create(Ban.fromRequest(req, keys, ttl));
        socket.disconnect();
      };
      try {
        await flecks.governor.socket.consume(req.ip);
        next();
      }
      catch (error) {
        const {ttl, keys} = socket;
        await Ban.create(Ban.fromRequest(req, keys, ttl));
        next(error);
      }
    }
  ),
  '@flecks/socket.packets.decorate': (Packets, flecks) => (
    Object.fromEntries(
      Object.entries(Packets).map(([keyPrefix, Packet]) => [
        keyPrefix,
        !Packet.limit ? Packet : LimitedPacket(flecks, [keyPrefix, Packet]),
      ]),
    )
  ),
};

export const mixin = (Flecks) => class FlecksWithGovernor extends Flecks {

  governor = {}

};
