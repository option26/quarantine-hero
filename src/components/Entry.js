import { Link } from 'react-router-dom';
import React from 'react';

export default function Entry (props) {
  return (<Link to={`/offer-help/${props.id}`}
        className="p-4 border border-gray-400 rounded w-full m-1 text-xl block" key={props.id}>
    Jemand in <span className="font-bold">{props.location}</span> bittet um: <span
    className="italic">{props.request}</span><br/>
    <span
      className="text-gray-500 inline-block text-right w-full text-base">{(new Date(props.timestamp)).toISOString()}</span>
  </Link>);
}
