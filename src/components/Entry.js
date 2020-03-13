import {Link} from 'react-router-dom';
import React, { useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import {de} from 'date-fns/locale';
import fb from '../firebase';

export default function Entry(props) {

    const {showFullText = false, location = "", id = "", request = "", timestamp = Date.now()} = props;
    const date = formatDistance(new Date(timestamp), Date.now(), {locale: de});

    let textToDisplay;
    const [deleted, setDeleted] = useState('')

    if (showFullText) {
        textToDisplay = request;
    } else {
        if (request.length > 300) {
            textToDisplay = request.substring(0, 300) + "...";
        } else {
            textToDisplay = request;
        }
    }

    const handleDelete = e => {
      e.preventDefault();
      fb.store.collection(`/ask-for-help`).doc(props.id).delete();
      setDeleted(true);
    };

    return (deleted ? false : <Link to={`/offer-help/${props.id}`}
                  className="shadow bg-white p-4 border border-gray-400 rounded w-full my-3 text-xl block" key={id}>
        Jemand in <span className="font-bold">{location}</span> braucht Hilfe!
        <p className="italic mt-3">{textToDisplay}</p><br/>

        <span className="text-gray-500 inline-block text-right w-full text-base">vor {date}</span>
      {fb.auth.currentUser && fb.auth.currentUser.uid  === props.uid ? <div>
        <button className="btn-primary" onClick={handleDelete}>Deine Anfrage löschen.</button>
      </div> : ''}
    </Link>);
}
