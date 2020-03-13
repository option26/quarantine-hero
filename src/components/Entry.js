import { Link } from 'react-router-dom';
import React from 'react';
import formatDistance from 'date-fns/formatDistance';

export default function Entry (props) {

  const date = formatDistance(new Date(props.timestamp), Date.now());

  return (<Link to={`/offer-help/${props.id}`}
        className="p-4 border border-gray-400 rounded w-full m-1 text-xl block" key={props.id}>
    Jemand in <span className="font-bold">{props.location}</span> bittet um: <span
    className="italic">{props.request}</span><br/>
    <span
      className="text-gray-500 inline-block text-right w-full text-base">{date} ago</span>
  </Link>);
}
