import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TafelhilfeLogo from '../assets/tafelhilfe.svg';
import ZusammengegenCoronaLogo from '../assets/bmg_logo.svg';

const partners = [
  {
    title: 'Gesundheit',
    logo: '',
    children: [
      {
        name: 'Zusammengegencorona',
        link: 'https://www.zusammengegencorona.de/',
        description: 'Für aktuelle Informationen und um weitere Initiativen zu finden.',
        logo: ZusammengegenCoronaLogo,
      },
      {
        name: 'Corona Helfer',
        link: 'https://corona-helfer.com/',
        description: 'Für aktuelle Informationen und um weitere Initiativen zu finden.',
        logo: ZusammengegenCoronaLogo,
      },
    ],
  },
  {
    title: 'Gesellschaft & Soziales',
    children: [
      {
        name: 'Tafelhilfe',
        link: 'https://tafelhilfe.de',
        description: 'Die Tafelhilfe vermittelt Helfer*innen an Tafeln in ganz Deutschland.',
        logo: TafelhilfeLogo,
      },
    ],
  },
  {
    title: 'Wirtschaft',
    children: [],
  },
  {
    title: 'Unterstützer',
    children: [],
  },
];

export default function Partners() {
  const { t } = useTranslation();

  return (
    <div className="mb-10 p-4">
      <h1 className="text-2xl font-main mt-8">{t('views.partners.title')}</h1>

      <p>{t('views.partners.explanation')}</p>

      {partners.map((category) => (
        <Category logo={category.logo} title={category.title}>
          {category.children.map((partner) => (
            <Partner name={partner.name} description={partner.description} link={partner.link} logo={partner.logo} />
          ))}
        </Category>
      ))}
    </div>
  );
}

function Category({ children, title, logo }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mt-4 mb-1 px-4 py-2 flex justify-start items-center bg-kaki w-full focus:outline-none"
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        <div>
          <img className="w-30 h-10 md:h-16 mr-4" src={logo} alt="" />
        </div>

        <div className="font-semibold text-lg">{title}</div>
        <div className="flex-1" />
        {
          React.createElement((isOpen ? ExpandLessIcon : ExpandMoreIcon), {
            className: 'cursor-pointer hover:opacity-50',
            style: { fontSize: '40px' },
          })
        }
      </button>
      <Collapse in={isOpen}>
        {children}
      </Collapse>
    </>
  );
}

function Partner({ name, description, link, logo }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="flex bg-gray-custom p-2 items-center">
      {/* eslint-disable-next-line import/no-dynamic-require */}
      <img className="w-16" src={logo} alt="" />
      <div className="ml-4 flex flex-col">
        <h3 className="text-md font-semibold">{name}</h3>
        <p>{description}</p>
      </div>
    </a>
  );
}
