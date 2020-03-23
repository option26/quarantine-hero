import React from 'react';
import dems from '../assets/dems.json';

function checkForDEM(data, props) {
  const mail = data.target.value;
  if (mail.includes('@')) {
    const domain = mail.substring(mail.lastIndexOf('@') + 1);
    // check if the mail address is included in the DEM-list
    if (dems.indexOf(domain) >= 0) {
      // this is a DEM
      data.target.setCustomValidity('Bitte keine Wegwerf-Emailadresse verwenden.');
    } else {
      // this is not a DEM
      data.target.setCustomValidity('');
      props.onSetEmail(mail);
    }
  } else {
    data.target.setCustomValidity('');
  }
}

export default function MailInput(props) {
  return (
    <input
      className={props.className}
      type="email"
      placeholder={props.placeholder}
      onChange={(e) => checkForDEM(e, props)}
      defaultValue={props.email}
      required
    />
  );
}
