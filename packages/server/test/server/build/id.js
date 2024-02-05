import {randomBytes} from 'crypto';

export default function id() {
  return new Promise((resolve, reject) => {
    randomBytes(16, (error, bytes) => (error ? reject(error) : resolve(bytes.toString('hex'))));
  });
}
