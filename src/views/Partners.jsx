import { createElement, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';

import useCms from '../util/useCms';
import useFirebaseDownload from '../util/useFirebaseDownload';
import Loader from '../components/loader/Loader';
import StyledMarkdown from '../util/StyledMarkdown';

export default function Partners() {
  const { t } = useTranslation();
  const [partnerCategories] = useCms('partner-categories');
  const [partners] = useCms('partners');

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (partnerCategories.length === 0 || partners.length === 0) {
      return;
    }

    const combined = partnerCategories.map((c) => ({
      ...c,
      children: partners.filter((p) => p.categoryId === c.identifier),
    }));

    setCategories(combined);
  }, [partnerCategories, partners]);

  return (
    <div className="mb-10 p-4">
      <h1 className="text-2xl font-main mt-8">{t('views.partners.title')}</h1>

      <p className="mb-4">{t('views.partners.explanation')}</p>

      <Loader waitOn={categories.length > 0}>
        {categories.map((category) => (
          <Category
            key={category.identifier}
            logoSource={category.logo}
            title={category.title}
          >
            {category.children.map((partner) => (
              <Partner
                key={`${category.name}${partner.name}`}
                name={partner.name}
                description={partner.description}
                link={partner.link}
                logoSource={partner.logo}
              />
            ))}
          </Category>
        ))}
      </Loader>
    </div>
  );
}

function Category({ children, title, logoSource }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoLink, logoError] = useFirebaseDownload(logoSource);

  return (
    <div className="mb-2">
      <button
        type="button"
        className="mb-1 px-4 py-2 flex justify-start items-center bg-kaki w-full focus:outline-none"
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        {!logoError && (
          <img className="w-6 md:w-8 py-2 mr-4" src={logoLink} alt="" />
        )}

        <div className="font-semibold text-lg">{title}</div>
        <div className="flex-1" />
        {
          createElement((isOpen ? ExpandLessIcon : ExpandMoreIcon), {
            className: 'cursor-pointer hover:opacity-50',
            style: { fontSize: '40px' },
          })
        }
      </button>
      <Collapse in={isOpen}>
        {children}
      </Collapse>
    </div>
  );
}

function Partner({ name, description, link, logoSource }) {
  const [logoLink, logoError] = useFirebaseDownload(logoSource);

  return createElement(link ? 'button' : 'div', {
    className: 'mb-1 flex bg-gray-custom p-2 items-center text-left',
    ...(link ? {
      onClick: () => window.open(link, '_blank', 'noopener noreferrer'),
    } : {}),
  }, (
    <>
      <div className="flex flex-grow">
        {!logoError && (
          <img className="h-16 w-16" src={logoLink} alt="" />
        )}
        <div className="ml-4 flex flex-col">
          <h3 className="text-lg font-semibold">{name}</h3>
          <StyledMarkdown className="mt-2" stopPropagation>{description}</StyledMarkdown>
        </div>
      </div>
      {link && (
        <div className="ml-2">
          <ArrowForwardIcon />
        </div>
      )}
    </>
  ));
}
