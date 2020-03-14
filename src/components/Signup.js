import React from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseApp from 'firebase';
import {Redirect} from "react-router-dom";
import Footer from './Footer';

const firebaseAppAuth = firebaseApp.auth();
const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const Signup = (props) => {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const {
        user,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
    } = props;

    if (user) {
        return <Redirect to="/ask-for-help"/>;
    }

    const signInOrRegister = async e => {
      console.log("ell")
      e.preventDefault();
      let result = await createUserWithEmailAndPassword(email, password);
      if(result.code === 'auth/email-already-in-use') result = await signInWithEmailAndPassword(email, password);
      if(result.code) setError(result.message);
    };

    return <form className="p-4 mt-8" onSubmit={signInOrRegister}>
        <div className="mb-4">
          <div className="font-teaser mb-6">
            Registriere dich mit deiner E-Mail und einem Passwort um eine Hilfe-Anfrage zu posten.
          </div>
            <label className="block text-gray-700 text-sm font-bold mb-1 font-open-sans" htmlFor="username">
                Email
            </label>
            <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none input-focus"
                id="username" type="email" placeholder="Deine E-Mailadresse" value={email} required="required"
                onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-1 text font-open-sans" htmlFor="password">
                Passwort
            </label>
            <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none input-focus"
                id="password" type="password" placeholder="Dein Passwort" value={password} required="required"
                onChange={e => setPassword(e.target.value)}/>
        </div>
      {error ? <div className="text-red-500">
        {error}
      </div> : ''}
        <div className="flex justify-end my-6">
            <button
                className="btn-green w-full"
                type="submit">
                Jetzt Registrieren
            </button>
        </div>

          <Footer />
    </form>;
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(Signup);
