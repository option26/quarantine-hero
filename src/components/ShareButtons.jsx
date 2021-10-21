import { FbIcon, GhIcon, IgIcon, TwIcon } from '../util/Icons';

export default function ShareButtons() {
  return (
    <div className="flex item">
      <div className="mr-1 cursor-pointer">
        <a href="https://instagram.com/quarantaenehelden" target="_blank" rel="noopener noreferrer">
          <img alt="instagram" src={IgIcon} className="w-8 opacity-50 hover:opacity-100 transition-all duration-200" />
        </a>
      </div>
      <div className="mx-1 cursor-pointer">
        <a href="https://facebook.com/quarantaenehelden" target="_blank" rel="noopener noreferrer">
          <img alt="facebook" src={FbIcon} className="w-8 opacity-50 hover:opacity-100 transition-all duration-200" />
        </a>
      </div>
      <div className="mx-1 cursor-pointer">
        <a href="https://twitter.com/QuarantaeneHeld" target="_blank" rel="noopener noreferrer">
          <img alt="twitter" src={TwIcon} className="w-8 opacity-50 hover:opacity-100 transition-all duration-200" />
        </a>
      </div>
      <div className="ml-1 mr-2 cursor-pointer">
        <a href="https://github.com/quarantine-hero/quarantine-hero" target="_blank" rel="noopener noreferrer">
          <img alt="github" src={GhIcon} className="w-8 opacity-50 hover:opacity-100 transition-all duration-200" />
        </a>
      </div>
    </div>
  );
}
