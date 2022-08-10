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
    const limiter = flecks.get('$flecks/governor.web.limiter');
    return async (req, res, next) => {
      const {Ban} = flecks.get('$flecks/db.models');
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
        await limiter.consume(req.ip);
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
  '@flecks/server.up': async (flecks) => {
    if (flecks.fleck('@flecks/web/server')) {
      const {web} = flecks.get('@flecks/governor/server');
      const limiter = await createLimiter(
        flecks,
        {
          keyPrefix: '@flecks/governor.web.request.route',
          ...web,
        },
      );
      flecks.set('$flecks/governor.web.limiter', limiter);
    }
    if (flecks.fleck('@flecks/socket/server')) {
      const {[ByType]: Packets} = flecks.get('$flecks/socket.packets');
      const limiters = Object.fromEntries(
        await Promise.all(
          Object.entries(Packets)
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
      flecks.set('$flecks/governor.packet.limiters', limiters);
      const {socket} = flecks.get('@flecks/governor/server');
      const limiter = await createLimiter(
        flecks,
        {
          keyPrefix: '@flecks/governor.socket.request.socket',
          ...socket,
        },
      );
      flecks.set('$flecks/governor.socket.limiter', limiter);
    }
  },
  '@flecks/socket/server.request.socket': (flecks) => {
    const limiter = flecks.get('$flecks/governor.socket.limiter');
    return async (socket, next) => {
      const {handshake: req} = socket;
      const {Ban} = flecks.get('$flecks/db.models');
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
        await limiter.consume(req.ip);
        next();
      }
      catch (error) {
        const {ttl, keys} = socket;
        await Ban.create(Ban.fromRequest(req, keys, ttl));
        next(error);
      }
    };
  },
  '@flecks/socket.packets.decorate': (Packets, flecks) => (
    Object.fromEntries(
      Object.entries(Packets).map(([keyPrefix, Packet]) => [
        keyPrefix,
        !Packet.limit ? Packet : LimitedPacket(flecks, [keyPrefix, Packet]),
      ]),
    )
  ),
};
