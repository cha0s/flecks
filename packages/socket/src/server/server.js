import {D} from '@flecks/core';
import proxyaddr from 'proxy-addr';
import SocketIoServer from 'socket.io';

import normalize from '../normalize';
import createIntercom from './create-intercom';
import ServerSocket from './socket';

const debug = D('@flecks/socket/server');
const debugSilly = debug.extend('silly');

export default class SocketServer {

  constructor(httpServer, flecks) {
    this.onConnect = this.onConnect.bind(this);
    this.flecks = flecks;
    this.httpServer = httpServer;
    const hooks = flecks.invokeMerge('@flecks/socket.intercom');
    debugSilly('intercom hooks(%O)', hooks);
    this.localIntercom = async ({payload, type}, fn) => {
      debugSilly('customHook: %s(%o)', type, payload);
      if (hooks[type]) {
        fn(await hooks[type](payload, this));
      }
    };
  }

  close(fn) {
    this.io.removeListener('connect', this.onConnect);
    this.io.close(fn);
  }

  async connect() {
    this.io = SocketIoServer(this.httpServer, {
      ...await this.flecks.invokeMergeAsync('@flecks/socket.server'),
      serveClient: false,
    });
    this.flecks.set('$flecks/socket.io', this.io);
    this.io.use(this.makeSocketMiddleware());
    this.io.on('@flecks/socket.intercom', this.localIntercom);
    this.flecks.invoke('@flecks/socket.server.io', this);
    this.io.on('connect', this.onConnect);
  }

  leave(rooms, room = '/') {
    ('/' === room ? this.io : this.io.in(room)).socketsLeave(rooms);
  }

  makeSocketMiddleware() {
    const {app} = this.httpServer;
    const middleware = this.flecks.makeMiddleware('@flecks/socket/server.request.socket');
    return async (socket, next) => {
      Object.defineProperty(socket.handshake, 'ip', {
        configurable: true,
        enumerable: true,
        get: () => proxyaddr({
          connection: socket.conn,
          headers: socket.request.headers,
        }, app.get('trust proxy fn')),
      });
      middleware(socket, next);
    };
  }

  of(nsp) {
    return this.io.of(nsp);
  }

  onConnect(socket) {
    const serverSocket = new ServerSocket(this.flecks, socket);
    serverSocket.listen();
    const {req} = serverSocket;
    req.flecks = this.flecks;
    req.intercom = createIntercom(this, 'socket');
    req.server = this;
    this.flecks.invokeSequentialAsync('@flecks/socket/server.connect', serverSocket);
  }

  static send(flecks, nsp, packetOrDehydrated) {
    const packet = normalize(flecks, packetOrDehydrated);
    const {constructor: Packet} = packet;
    debugSilly('sending packet %s(%j)', Packet.type, packet.data);
    try {
      nsp.emit(Packet.id, Packet.encode(packet.data));
    }
    catch (error) {
      throw new Error(`${error.message}, data: ${JSON.stringify(packet.data, null, 2)}`);
    }
  }

  send(packet) {
    return this.constructor.send(this.flecks, this.io.sockets, packet);
  }

  async sockets(room = '/') {
    return ('/' === room ? this.io : this.io.in(room)).fetchSockets();
  }

  to(room) {
    return {
      send: (packet) => (
        this.constructor.send(
          this.flecks,
          ('/' === room ? this.io.of('/') : this.io.of('/').to(room)),
          packet,
        )
      ),
    };
  }

}
