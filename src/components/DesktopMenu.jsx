import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogoMarkIcon } from '../util/Icons';

export default function DesktopMenu() {
  const { t } = useTranslation();

  const MenuItem = ({ to, onClick, children }) => (
    <li className="mr-6 hover:opacity-75">
      <Link to={to} onClick={onClick}>{children}</Link>
    </li>
  );

  const Menu = () => (
    <div className="flex justify-end">
      <ul className="font-exo2 flex justify-around text-lg font-semibold mt-6 mr-2">
        <MenuItem to="/ask-for-help">{t('components.desktopMenu.requestHelp')}</MenuItem>
        <MenuItem to="/overview">{t('components.desktopMenu.help')}</MenuItem>
        <MenuItem to="/security-tips">{t('components.desktopMenu.safety')}</MenuItem>
      </ul>
    </div>
  );

  return (
    <div className="hidden md:flex justify-between relative">
      <Link className="-ml-16 block -mt-12" to="/">
        <img alt="logo" src={LogoMarkIcon} />
      </Link>
      <Menu />
    </div>
  );
}
