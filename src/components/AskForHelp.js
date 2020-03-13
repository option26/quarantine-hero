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
            <h1 className="text-4xl py-4 pt-10">Um Unterstützung bitten</h1>

            <div className="py-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Email
                </label>
                <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username" type="email" placeholder="Deine Email-Adresse">
                </input>
            </div>


            {/*<div className="py-3">*/}
            {/*    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">*/}
            {/*        Telefonnummer*/}
            {/*    </label>*/}
            {/*    <input*/}
            {/*        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"*/}
            {/*        id="phone" type="tel" placeholder="Deine Telefonnummer">*/}
            {/*    </input>*/}
            {/*</div>*/}

            <div className="py-3">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Wo bist du?
                </label>
                <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="location" type="text" placeholder="Dein Standort">
                </input>
            </div>


            <div className="py-3">
                <div className="w-full">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                        Wobei kann man dir helfen?
                    </label>
                    <textarea className="border leading-tight rounded border-gray-400 py-2 px-3 pb-20 w-full"
                              placeholder="Deine Anfrage hier"/>
                </div>
                <div className="mt-8 mb-10 w-full text-gray-700">
                    Sobald du deine Anfrage absendest ist diese öffentlich für andere einsehbar. Deine Email-Adresse ist
                    für andere nicht einsehbar. <br/>
                    Wenn dir jemand helfen möchte, kann er dich über diese Website kontaktieren und wir leiten die
                    Kontaktanfrage automatisch an deine Email weiter. Ab dann könnt ihr euch unter euch absprechen.
                </div>
                <div className="mt-4 w-full">
                    <Link className="btn-primary">Jetzt um Hilfe bitten</Link>
                </div>
            </div>
        </div>
    );
}

