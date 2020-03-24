import { Link } from 'react-router-dom';
import React from 'react';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';

export default function DesktopMenu(props) {
  const { t } = useTranslation();

  const MenuItem = (menuItemProps) => (
    <li className="mr-3 hover:opacity-75">
      <Link to={menuItemProps.to} onClick={menuItemProps.onClick}>{menuItemProps.children}</Link>
    </li>
  );

  const Menu = (menuProps) => (
    <Box className="flex w-1/2" flexDirection="column">
      <ul className="font-exo2 flex justify-around text-lg font-semibold mt-5 mr-5 -ml-10">
        {menuProps.isLoggedIn
          ? (
            <>
              <MenuItem to="/dashboard">{t('components.desktopMenu.requestHelp')}</MenuItem>
              <MenuItem to="/overview">{t('components.desktopMenu.help')}</MenuItem>
              <MenuItem to="/dashboard">{t('components.desktopMenu.safety')}</MenuItem>
            </>
          )
          : (
            <>
              <MenuItem to="/ask-for-help">{t('components.desktopMenu.requestHelp')}</MenuItem>
              <MenuItem to="/overview">{t('components.desktopMenu.help')}</MenuItem>
            </>
          )}
        <MenuItem to="/faq">FAQs</MenuItem>
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
