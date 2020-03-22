import { Link } from 'react-router-dom';
import React from 'react';
import Box from '@material-ui/core/Box';

export default function DesktopMenu(props) {
  const MenuItem = (menuItemProps) => (
    <li className="mr-6 hover:opacity-75">
      <Link to={menuItemProps.to} onClick={menuItemProps.onClick}>{menuItemProps.children}</Link>
    </li>
  );

  const Menu = (menuProps) => (
    <Box className="flex w-1/2" flexDirection="column">
      <ul className="font-exo2 flex justify-around text-xl font-semibold mt-10">
        {menuProps.isLoggedIn
          ? <MenuItem to="/dashboard">DEINE ÜBERSICHT</MenuItem>
          : (
            <>
              <MenuItem to="/ask-for-help">HILFE ANFRAGEN</MenuItem>
              <MenuItem to="/overview">HELFEN</MenuItem>
            </>
          )}
        <MenuItem to="/faq">FAQs</MenuItem>
        {menuProps.isLoggedIn
          ? <MenuItem to="#" onClick={menuProps.signOut}>ABMELDEN</MenuItem>
          : ''}
      </ul>
    </Box>
  );

  return (
    <>
      <div className="hidden md:flex justify-between relative">
        <Link className="-ml-8 block -mt-12" to="/">
          <img alt="logo" src={require('../assets/logo.svg')} />
        </Link>
        <Menu {...props} />
      </div>
    </>
  );
}
