import {HashRouter as Router, Link} from "react-router-dom";
import React from "react";

export default function Sidebar({open = false, onClose}) {

    if (!open) {
        return null;
    }
    const Backdrop = () => (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#fefefef2',
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 1
        }} onClick={onClose}>

        </div>
    );

    return (
        <div>
            <Backdrop/>


            <div style={{
                width: '70vw',
                maxWidth: '400px',
                height: '100%',
                position: 'fixed',
                backgroundColor: 'white',
                top: 0,
                right: 0,
                zIndex: 2
            }}
                 className="shadow-2xl"
            >
                <ul style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'baseline',
                    marginTop: '70px',
                    marginLeft: '30px',
                    fontSize: '20px'
                }} className="font-main">
                    <li>
                        <Link onClick={() => onClose()} to="/">Home</Link>
                    </li>
                    <li>
                        <Link onClick={() => onClose()} to="/overview">Deine Übersicht</Link>
                    </li>
                    <li>
                        <Link onClick={() => onClose()} to="/faq">FAQ</Link>
                    </li>
                    <li>
                        <Link onClick={() => onClose()} to="/impressum">Impressum</Link>
                    </li>
                    <li>
                        <Link onClick={() => onClose()} to="/datenschutz">Datenschutz</Link>
                    </li>
                </ul>
            </div>
        </div>)
}
