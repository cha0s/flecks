import {
  useEffect,
  useRef,
} from 'react';

// Thanx https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
export default (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
