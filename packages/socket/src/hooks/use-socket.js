import {useFlecks} from '@flecks/react';

export default function useSocket() {
  const flecks = useFlecks();
  const sock = flecks.get('$flecks/socket.socket');
  return sock;
}
