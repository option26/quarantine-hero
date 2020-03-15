import React, { useState } from 'react';
import fb from '../firebase';
import CloseIcon from '@material-ui/icons/Close';
import LocationInput from './LocationInput';
import Footer from './Footer';

export default function NotifyMe() {

  const [email, setEmail] = useState('');
  const [signInLinkSent, setSignInLinkSent] = useState(false);
  const [location, setLocation] = useState('');

  const handleClick = async () => {
    window.localStorage.setItem('emailForSignIn', email);

    try {
      await fb.auth.sendSignInLinkToEmail(email, {
        url: 'https://quarantaenehelden.org/#/complete-offer-help?location=' + location + '&email=' + email,
        handleCodeInApp: true,
      });
      fb.analytics.logEvent('success_subscribe_region');

      setSignInLinkSent(true);

    } catch (error) {
      // TODO: handle error
    }
  };

  const handleChange = address => {
    setLocation(address);
  };

  const handleSelect = address => {
    setLocation(address);
  };

  if (signInLinkSent) {
    return (
      <div  className="p-4">
        <div className="font-teaser my-6">
          Lass Dich benachrichten, wenn Jemand in Deiner Umgebung Hilfe braucht.
        </div>
        <div className="border bg-secondary px-4 py-2 rounded text-white flex flex-row items-center border">
          Wir haben dir eine Email gesendet! Bitte überprüfe dein Postfach und klicke auf den Link in unserer Email! Wir
          werden dich dann benachrichtigen, wenn Leute in {location} Hilfe benötigen.
          <CloseIcon/>
        </div>
      </div>

    )
  } else {
    return (
      <div className="p-4">
        <div className="font-teaser my-6">
          Lass Dich benachrichten, wenn Jemand in Deiner Umgebung Hilfe braucht.
        </div>
        <LocationInput onChange={handleChange} value={location} onSelect={handleSelect}/>
        <input className="input-focus my-6" type="email" placeholder="Deine Emailadresse"
               onChange={(e) => setEmail(e.target.value)} value={email} required="required"></input>
        <button className="mt-6 btn-green w-full"
                onClick={handleClick}>
          Benachrichtige mich wenn jemand in {location && location !== '' ? location : 'meiner Nähe'} Hilfe braucht!
        </button>
        <Footer />
      </div>
    );
  }
};
