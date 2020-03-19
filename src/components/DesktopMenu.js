import {Link} from 'react-router-dom';
import React from 'react';
import Box from "@material-ui/core/Box";
import {useTranslation} from "react-i18next";

export default function DesktopMenu(props) {

  const MenuItem = (props) => {
    return <li className="mr-6 hover:opacity-75">
      <Link to={props.to} onClick={props.onClick}>{props.children}</Link>
    </li>;
  };

  const Menu = (props) => {
    const { t, i18n } = useTranslation();
    return (
      <Box className={"flex w-1/2"} flexDirection={"column"}>
        <ul className="font-exo2 flex justify-around text-xl font-semibold mt-10">
          {props.isLoggedIn ?
            <MenuItem to="/dashboard">{t('menu.yourOverview')}</MenuItem> :
            (<React.Fragment>
              <MenuItem to="/ask-for-help">{t('menu.requestHelp')}</MenuItem>
              <MenuItem to="/overview">{t('menu.help')}</MenuItem>
            </React.Fragment>)}
          <MenuItem to="/faq">{t('menu.FAQs')}</MenuItem>
          {props.isLoggedIn ?
            <MenuItem to="#" onClick={props.signOut}>{t('menu.logout')}</MenuItem> :
            ''}
        </ul>
      </Box>
    );
  };

  return (<React.Fragment>
    <div className="hidden md:flex justify-between relative">
      <Link className="-ml-8 block -mt-12" to="/">
        <img alt="logo" src={require('../assets/logo.svg')}/>
      </Link>
      <Menu {...props}/>
    </div>
  </React.Fragment>);
}
