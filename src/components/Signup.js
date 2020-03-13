import React from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseApp from 'firebase';
import {Redirect} from "react-router-dom";

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

    const signInOrRegister = async () => {
      let result = await createUserWithEmailAndPassword(email, password);
      if(result.code === 'auth/email-already-in-use') result = await signInWithEmailAndPassword(email, password);
      if(result.code) setError(result.message);
    };

    return <form>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Email
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username" type="text" placeholder="Username" value={email}
                onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Passwort
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password" type="password" placeholder="******************" value={password}
                onChange={e => setPassword(e.target.value)}/>
        </div>

        <div className="flex items-center justify-between mb-6 ">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={signInOrRegister}>
                Jetzt Registrieren
            </button>
        </div>
      {error ? <div className="text-red-500">
        {error}
        </div> : ''}
    </form>;
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(Signup);
