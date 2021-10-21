import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default () => {
  const { search } = useLocation();

  return useMemo(() => {
    const paramArray = [...new URLSearchParams(search).entries(), ...new URLSearchParams(window.location.search).entries()];
    return paramArray.reduce((obj, entry) => {
      const [key, value] = entry;
      obj[key] = value; // eslint-disable-line no-param-reassign
      return obj;
    }, {});
  }, [search]);
};
