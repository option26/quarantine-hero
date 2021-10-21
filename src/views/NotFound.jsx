import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import UnderlinedHeader from '../components/UnderlinedHeader';
import {
  IconBabyIcon,
  IconBarbecueIcon,
  IconIronIcon,
  IconProposeIcon,
  IconSaunaIcon, IconSawIcon,
  IconTasteIcon,
} from '../util/Icons';

export default function NotFound() {
  const [randomNum, setRandomNum] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    setRandomNum(Math.ceil(Math.random() * 7));
  }, []);

  const getRandomSvg = () => {
    let srcPath;

    switch (randomNum) {
      case 1:
        srcPath = IconIronIcon;
        break;
      case 2:
        srcPath = IconBabyIcon;
        break;
      case 3:
        srcPath = IconBarbecueIcon;
        break;
      case 4:
        srcPath = IconProposeIcon;
        break;
      case 5:
        srcPath = IconSaunaIcon;
        break;
      case 6:
        srcPath = IconTasteIcon;
        break;
      case 7:
        srcPath = IconSawIcon;
        break;
      default:
        srcPath = IconTasteIcon;
    }

    return <img className="w-10/12 h-auto" src={srcPath} alt="svg" />;
  };

  return (
    <>
      <div className="p-4 pt-12">
        <UnderlinedHeader title="Error 404" />

        <div className="mx-auto md:w-4/5">
          <div className="mt-8">
            <p className="text-3xl mt-6 font-extralight mb-8">
              {t('views.notFound.ooopsTitle')}
            </p>
          </div>
          <div className="flex mb-4">
            <div className="w-auto">
              <div className="">{getRandomSvg()}</div>
              <div className="text-fine-print">Icon created by Adrien Coquet from the Noun Project</div>
            </div>
            <div className="max-w-sm">
              <p className="text-base mb-8">{t('views.notFound.ItBusy')}</p>
            </div>
          </div>
        </div>

        <Link to="/" className="btn-green block w-full md:mt-10 sm:mt-6">
          {t('views.notFound.toHome')}
        </Link>
      </div>
    </>
  );
}
