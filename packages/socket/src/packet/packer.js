import msgpack from 'msgpack-lite';

export default (key) => (Superclass) => {
  class Packer extends Superclass {}
  Object.defineProperty(
    Packer,
    'data',
    key
      ? {
        get() {
          const {data} = Superclass;
          data[key] = 'buffer';
          return data;
        },
      }
      : {
        get() {
          return 'buffer';
        },
      },
  );
  Packer.pack = key
    ? (data) => {
      // eslint-disable-next-line no-param-reassign
      data[key] = msgpack.encode(data[key]);
      return Superclass.pack(data);
    }
    : (data) => msgpack.encode(data);
  Packer.unpack = key
    ? (data) => {
      // eslint-disable-next-line no-param-reassign
      data[key] = msgpack.decode(data[key]);
      return Superclass.pack(data);
    }
    : (data) => msgpack.decode(data);
  return Packer;
};
