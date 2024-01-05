import {useFlecks} from '@flecks/react';

export default function useSocket() {
  const flecks = useFlecks();
  return flecks.socket.client;
}
