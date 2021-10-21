import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Drawer from '@material-ui/core/Drawer';
import { useTranslation } from 'react-i18next';
import ShareButtons from './ShareButtons';

export default function Sidebar(props) {
  const { t } = useTranslation();

  const {
    open = true, onClose, signOut, isLoggedIn,
  } = props;

  if (!open) {
    return null;
  }

  const MenuItem = ({ onClick, to, children, dataCy }) => (
    <li className="py-1 hover:opacity-75">
      <Link
        className="py-1 block"
        onClick={() => {
          if (onClick) onClick();
          onClose();
        }}
        to={to}
        data-cy={dataCy}
      >
        {children}
      </Link>
    </li>
  );

  const Menu = ({ isLoggedIn: isLoggedInProp, signOut: signOutProp }) => (
    <ul
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'baseline',
        marginLeft: '40px',
        marginRight: '80px',
        fontSize: '20px',
        fontWeight: '600',
      }}
      className="font-main mt-6"
    >
      <MenuItem to="/">{t('components.sidebar.home')}</MenuItem>
      <MenuItem to="/ask-for-help">{t('components.sidebar.askForHelp')}</MenuItem>
      <MenuItem to="/overview">{t('components.sidebar.help')}</MenuItem>
      {isLoggedInProp && <MenuItem to="/dashboard" dataCy="mobile-nav-my-overview">{t('components.sidebar.myOverview')}</MenuItem>}
      <MenuItem to="/security-tips">{t('components.sidebar.safety')}</MenuItem>
      <MenuItem to="/faq">{t('components.sidebar.FAQs')}</MenuItem>
      <MenuItem to="/press">{t('components.sidebar.press')}</MenuItem>
      <MenuItem to="/partners">{t('components.sidebar.partners')}</MenuItem>
      <MenuItem to="/impressum">{t('components.sidebar.legal')}</MenuItem>
      <MenuItem to="/privacy-policy">{t('components.sidebar.privacy')}</MenuItem>

      {isLoggedInProp
        ? <MenuItem to="/" onClick={signOutProp} dataCy="mobile-nav-sign-out">{t('components.sidebar.signOut')}</MenuItem>
        : <MenuItem to="/signin/dashboard">{t('components.sidebar.login')}</MenuItem>}

      <div className="mt-4">
        <ShareButtons />
      </div>
    </ul>
  );

  return (

    <Drawer open={open} onClose={onClose} anchor="right">
      <div className="w-full flex justify-end">
        <CloseIcon
          className="mr-4 mt-4"
          style={{ fontSize: '40px' }}
          onClick={() => onClose()}
        />
      </div>
      <Menu isLoggedIn={isLoggedIn} signOut={signOut} />
    </Drawer>

  );
}
