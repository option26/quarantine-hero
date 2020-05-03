import { useLocation } from 'react-router-dom';

export default () => {
  const paramObj = {};
  const paramArray = [...new URLSearchParams(useLocation().search).entries(), ...new URLSearchParams(window.location.search)];
  paramArray.forEach((entry) => {
    const [key, value] = entry;
    paramObj[key] = value;
  });
  return paramObj;
};
