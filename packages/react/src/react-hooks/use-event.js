import {useEffect} from 'react';

export default function useEvent(object, eventName, fn) {
  useEffect(() => {
    if (!object) {
      return undefined;
    }
    const onEvent = (...args) => {
      fn(...args);
    };
    onEvent();
    object.on(eventName, onEvent);
    return () => {
      object.off(eventName, onEvent);
    };
  }, [eventName, fn, object]);
}
