import { createElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StyledMarkdown from '../util/StyledMarkdown';
import useCms from '../util/useCms';
import Loader from '../components/loader/Loader';

export default function FAQ() {
  const { t } = useTranslation();
  const [faqs] = useCms('faq');

  return (
    <div className="mb-10 p-4">
      <h1 className="text-2xl font-main mt-8">{t('views.faq.title')}</h1>
      <Loader waitOn={faqs.length > 0}>
        {faqs.map((faq) => <QA key={faq.question} question={faq.question}>{faq.answer}</QA>)}
      </Loader>
    </div>
  );
}

function QA({ question, children }) {
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
        <div className="font-semibold text-left mr-4">{question}</div>
        <div className="flex-1" />
        {
        createElement((isOpen ? ExpandLessIcon : ExpandMoreIcon), {
          className: 'cursor-pointer hover:opacity-50',
          style: { fontSize: '40px' },
        })
      }
      </button>
      <Collapse in={isOpen}>
        <div className="p-4 bg-kaki">
          <StyledMarkdown className="text-justify">{children}</StyledMarkdown>
        </div>
      </Collapse>
    </>
  );
}
