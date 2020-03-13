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
    const {
        user,
        signOut,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        signInWithFacebook,
        signInWithGoogle
    } = props;

    if (user) {
        return <Redirect to="/dashboard"/>;
    }

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
        <div className="flex items-center justify-between">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => createUserWithEmailAndPassword(email, password)}>
                Jetzt Registrieren
            </button>
        </div>
    </form>;
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(Signup);
