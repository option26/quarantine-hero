import {Link} from "react-router-dom";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import Drawer from "@material-ui/core/Drawer";
import ShareButtons from "../ShareButtons";

export default function Sidebar(props) {

  const {open = true, onClose, signOut, isLoggedIn} = props;

  if (!open) {
    return null;
  }

  const _onClose = () => {
    onClose();
  };

  const MenuItem = (props) => {
    return <li className="pt-6 hover:opacity-75">
      <Link onClick={_onClose} to={props.to}>{props.children}</Link>
    </li>
  };

  const Menu = (props) => (
    <ul style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'baseline',
      marginTop: '100px',
      marginLeft: '40px',
      marginRight: '80px',
      fontSize: '20px',
      fontWeight: '600'
    }} className="font-main">
      <MenuItem to="/">Home</MenuItem>
      <MenuItem to="/ask-for-help">Ich brauche Hilfe</MenuItem>
      <MenuItem to="/overview">Ich möchte helfen</MenuItem>
      {props.isLoggedIn && <MenuItem to="/dashboard">Deine Übersicht</MenuItem>}
      <MenuItem to="/faq">FAQs</MenuItem>
      <MenuItem to="/impressum">Impressum</MenuItem>
      <MenuItem to="/dsgvo">Datenschutz</MenuItem>
      {props.isLoggedIn && <li className="pt-6"><Link to="/" onClick={() => {
        props.signOut();
        _onClose();
      }}>Abmelden</Link></li>}
    </ul>
  );

  return (

    <Drawer open={open} onClose={_onClose} anchor="right">
      <CloseIcon style={{position: 'absolute', top: '20', right: '20', fontSize: '30px'}}
                 onClick={() => onClose()}/>
      <ShareButtons style={{"display": "flex", "justifyContent": "flex-start", "marginBottom": "-40px"}}/>
      <Menu isLoggedIn={isLoggedIn} signOut={signOut}/>
    </Drawer>

  )
}
