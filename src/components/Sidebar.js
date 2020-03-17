import {Link} from "react-router-dom";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import Drawer from "@material-ui/core/Drawer";
import ShareButtons from "./ShareButtons";

export default function Sidebar(props) {

  const {open = true, onClose, signOut, isLoggedIn} = props;

  if (!open) {
    return null;
  }

  const _onClose = () => {
    onClose();
  };

  const MenuItem = (props) => {
    return <li className="py-1 hover:opacity-75">
      <Link className="py-2 block" onClick={_onClose} to={props.to}>{props.children}</Link>
    </li>
  };

  const Menu = (props) => (
    <ul style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'baseline',
      marginLeft: '40px',
      marginRight: '80px',
      fontSize: '20px',
      fontWeight: '600'
    }} className="font-main mt-6">
      <MenuItem to="/">Home</MenuItem>
      <MenuItem to="/ask-for-help">Ich brauche Hilfe</MenuItem>
      <MenuItem to="/overview">Ich möchte helfen</MenuItem>
      {props.isLoggedIn && <MenuItem to="/dashboard">Deine Übersicht</MenuItem>}
      <MenuItem to="/faq">FAQs</MenuItem>
      <MenuItem to="/presse">Presse</MenuItem>
      <MenuItem to="/impressum">Impressum</MenuItem>
      <MenuItem to="/dsgvo">Datenschutz</MenuItem>
      {props.isLoggedIn && <li className="pt-6"><Link to="/" onClick={() => {
        props.signOut();
        _onClose();
      }}>Abmelden</Link></li>}
      <div className="mt-4">
        <ShareButtons  />
      </div>
    </ul>
  );

  return (

    <Drawer open={open} onClose={_onClose} anchor="right">
      <div className="w-full flex justify-end">
        <CloseIcon className="mr-4 mt-4" style={{ fontSize: '40px'}}
                   onClick={() => onClose()}/>
      </div>
      <Menu isLoggedIn={isLoggedIn} signOut={signOut}/>
    </Drawer>

  )
}
