import { Link} from "react-router-dom";
import React from "react";
import fb from '../firebase';

export default function DesktopMenu() {

  const MenuItem = (props) => {
    return <li className="mr-6">
      <Link to={props.to}>{props.children}</Link>
    </li>
  };

  const Menu = (props) => (
    <ul className="font-exo2 flex justify-around w-1/2 text-xl font-semibold mt-16">
      <MenuItem to="/">HOME</MenuItem>
      {fb.auth.currentUser && fb.auth.currentUser.email ?
        <MenuItem to="/dashboard">DEINE ÜBERSICHT</MenuItem> :
        <MenuItem to="/ask-for-help">HILFE ANFRAGEN</MenuItem>}
      <MenuItem to="/faq">FAQs</MenuItem>
      {fb.auth.currentUser && fb.auth.currentUser.email ?
        <MenuItem to="/dashboard">LOGOUT</MenuItem> :
        ''}
    </ul>
  );

  return (
    <div className="hidden md:flex justify-between relative pt-8 ">
      <img className="logo-margin" alt="logo" src={require('../assets/logo.svg')} />
      <Menu/>
    </div>

  )
}
