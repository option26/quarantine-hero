import {Link} from 'react-router-dom';
import React from 'react';

export default function Main() {

    const entrys = [
        {
            id: 1,
            location: 'München',
            text: 'Brauche jemand, der für mich einkauft',
            timestamp: Date.now(),
        }, {
            id: 2,
            location: 'München',
            text: 'Brauche jemand, der für mich einkauft',
            timestamp: Date.now(),
        }, {
            id: 3,
            location: 'München',
            text: 'Brauche jemand, der für mich einkauft',
            timestamp: Date.now(),
        }];


    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FDF4EA',
            flexDirection: 'column',
            padding: '30px'
        }}>
            <div style={{maxWidth: '1000px', margin: 'auto'}}>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <img style={{height: '300px'}} src={require('../logo.png')}></img>
                </div>
                <p className="text-xl p-4">Wir sind Menschen. In Zeiten der Not helfen wir uns. Sei ein Teil davon.</p>
                <div style={{display: 'flex', marginTop: '20px', marginBottom: '50px'}}>
                    <Link to="/signup" style={{flexGrow: 1, backgroundColor: '#8A2547', color: 'white', textAlign: 'center'}}
                          className="font-bold py-8 px-4 rounded hover:bg-blue-100">Ich möchte helfen
                    </Link>
                    <div style={{width: '30px'}}></div>
                    <Link to="/signup" style={{flexGrow: 1, backgroundColor: '#8A2547', color: 'white', textAlign: 'center'}}
                          className="font-bold py-8 px-4 rounded hover:bg-blue-100">Ich brauche Hilfe
                    </Link>
                </div>

                {entrys.map(entry => {
                    return <Link to={`/entry/${entry.id}`}
                                 className="p-4 border border-gray-400 rounded w-full m-1 text-xl block" key={entry.id}>
                        Jemand in <span className="font-bold">{entry.location}</span> bittet um: <span
                        className="italic">{entry.text}</span><br/>
                        <span
                            className="text-gray-500 inline-block text-right w-full text-base">{(new Date(entry.timestamp)).toISOString()}</span>
                    </Link>;
                })}
            </div>
        </div>
    );
}

