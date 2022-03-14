import {useEffect} from '@flecks/react';

import useSocket from './use-socket';

export default function useSocketPacket(fn, deps = []) {
  const socket = useSocket();
  useEffect(() => {
    socket.on('packet', fn);
    socket.on('disconnect', () => socket.off('packet', fn));
    socket.on('reconnect', () => socket.on('packet', fn));
    return () => socket.off('packet', fn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps.concat([fn, socket]));
}
