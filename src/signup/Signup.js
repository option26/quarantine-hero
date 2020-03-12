import React from 'react';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);
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
        // TODO: Redirect to dashboard;
        return <button onClick={signOut}>Abmelden</button>;
    } else {
        return (
            <React.Fragment>
                <h1>Jetzt zum Helden werden</h1>
                <input type="text"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder={"Email-Adresse"}/>
                <input type="password"
                       value={password}
                       onChange={e => setPassword(e.target.value)}
                       placeholder={"Passwort"}/>
                <button onClick={() => createUserWithEmailAndPassword(email, password)}>Registrieren</button>
            </React.Fragment>
        )

    }


    return <div className="App">

        {user ? <div> Hello {user.email}</div> :
            <div><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={"Email"}/><br/>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder={"Passwort"}/><br/>
                <button onClick={() => createUserWithEmailAndPassword(email, password)}>Registrieren</button>
            </div>}
    </div>;
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(Signup);