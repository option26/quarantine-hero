import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default () => {
  const [paramObject, setParamObject] = useState({});
  const location = useLocation();

  useEffect(() => {
    const paramArray = [...new URLSearchParams(location.search).entries(), ...new URLSearchParams(window.location.search)];
    const newParamObject = paramArray.reduce((obj, entry) => {
      const [key, value] = entry;
      obj[key] = value; // eslint-disable-line no-param-reassign
      return obj;
    }, {});
    setParamObject(newParamObject);
  }, [location]);

  return paramObject;
};
