import { Link } from 'react-router-dom';
import React from 'react';

export default function DesktopMenu (props) {

  const MenuItem = (props) => {
    return <li className="mr-6 hover:opacity-75">
      <Link to={props.to} onClick={props.onClick}>{props.children}</Link>
    </li>;
  };

  const Menu = (props) => (
    <ul className="font-exo2 flex justify-around w-1/2 text-xl font-semibold mt-16">
      {props.isLoggedIn ?
        <MenuItem to="/dashboard">DEINE ÜBERSICHT</MenuItem> :
        (<React.Fragment>
          <MenuItem to="/ask-for-help">HILFE ANFRAGEN</MenuItem>
          <MenuItem to="/overview">HELFEN</MenuItem>
        </React.Fragment>)}
      <MenuItem to="/faq">FAQs</MenuItem>
      {props.isLoggedIn ?
        <MenuItem to="#" onClick={props.signOut}>LOGOUT</MenuItem> :
        ''}
    </ul>
  );

  return (
    <div className="hidden md:flex justify-between relative pt-8 ">
      <Link className="logo-margin block" to="/">
        <img alt="logo" src={require('../assets/logo.svg')}/>
      </Link>
      <Menu {...props}/>
    </div>

  );
}
