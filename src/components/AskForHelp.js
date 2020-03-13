import React from 'react';
import {Link} from 'react-router-dom';

export default function Entry() {

    const entry = {
        id: 1,
        location: 'München',
        text: 'Brauche jemand, der für mich einkauft',
        timestamp: Date.now(),
    };

    return (<div style={{maxWidth: '1000px', margin: 'auto'}}>
            <h1>Jetzt Hilfe anfragen!</h1>

            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Email
            </label>
            <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username" type="email" placeholder="Deine Email-Adresse">
            </input>


            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Telefonnummer
            </label>
            <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone" type="tel" placeholder="Deine Telefonnummer">
            </input>

            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Wo bist du?
            </label>
            <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="location" type="text" placeholder="Dein Standort">
            </input>


            <div className="mt-4 w-full">
                <textarea className="border rounded border-gray-400 m-1 p-4 text-xl w-full"
                          placeholder="Ich kann helfen!"/>
            </div>
            <div className="mt-4 m-1 w-full">
                Wenn Sie das abschicken dann
            </div>
            <div className="mt-4 m-1 w-full">
                <Link className="btn-primary">Senden</Link>
            </div>
        </div>
    );
}

