import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import UnderlinedHeader from '../components/UnderlinedHeader';

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
        srcPath = require('../assets/icon_iron.svg');
        break;
      case 2:
        srcPath = require('../assets/icon_baby.svg');
        break;
      case 3:
        srcPath = require('../assets/icon_barbecue.svg');
        break;
      case 4:
        srcPath = require('../assets/icon_propose.svg');
        break;
      case 5:
        srcPath = require('../assets/icon_sauna.svg');
        break;
      case 6:
        srcPath = require('../assets/icon_taste.svg');
        break;
      case 7:
        srcPath = require('../assets/icon_saw.svg');
        break;
      default:
        srcPath = require('../assets/icon_taste.svg');
    }

    return <img className="w-10/12 h-auto" src={srcPath} alt="svg" />;
  };

  return (
    <>
      <div className="p-4 pt-12">
        <UnderlinedHeader title="Error 404" />

        <div className="sm:mx-auto sm:w-4/5 xs:w-full">
          <div className="mt-8">
            <p className="text-3xl mt-6 font-thin mb-8">
              {t('views.notFound.ooopsTitle')}
            </p>
          </div>
          <div className="flex mb-4">
            <div className="w-auto ">{getRandomSvg()}</div>
            <div className="max-w-sm ">
              <p className="text-base mb-8">{t('views.notFound.ItBusy')}</p>
            </div>
          </div>
        </div>

        <Link to="/" className="btn-green block w-full md:mt-10 sm:mt-6">
          {t('views.notFound.toHome')}
        </Link>
      </div>
      <Footer />
    </>
  );
}
