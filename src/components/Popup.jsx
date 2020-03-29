import React from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import Popup from 'reactjs-popup';

import DoneIcon from '@material-ui/icons/Done';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

function getPopupContentComponent(heading, firstButtonComponent, secondButtonComponent) {
  const popupContentClasses = 'p-4 bg-kaki font-open-sans flex flex-col justify-center items-center';
  const strongerTogetherHashtag = <i>#strongertogether</i>;
  const textBodyWasYourRequestSuccessful = (
    <>
      <p className="mt-2">
        {i18n.t('components.entry.popup.wasYourRequestSuccessful.firstSentence')}
        {strongerTogetherHashtag}
      </p>
      <p>{i18n.t('components.entry.popup.wasYourRequestSuccessful.secondSentence')}</p>
      <p>{i18n.t('components.entry.popup.wasYourRequestSuccessful.thirdSentence')}</p>
    </>
  );

  const textBodyYourRequestWasDeleted = (
    <>
      <p>{i18n.t('components.entry.popup.yourRequestWasDeleted.firstSentence')}</p>
      <p>
        {i18n.t('components.entry.popup.yourRequestWasDeleted.secondSentence')}
        {strongerTogetherHashtag}
      </p>
    </>
  );

  let textBody = null;
  if (heading === i18n.t('components.entry.popup.wasYourRequestSuccessful.heading')) textBody = textBodyWasYourRequestSuccessful;
  if (heading === i18n.t('components.entry.popup.yourRequestWasDeleted.heading')) textBody = textBodyYourRequestWasDeleted;

  return () => (
    <div className={popupContentClasses}>
      <div className="mb-3 pl-8 pt-2 pb-5 min-w-full">
        <div className="font-bold">{heading}</div>
        {textBody}
      </div>
      {firstButtonComponent}
      {secondButtonComponent}
    </div>
  );
}

function getButtonForPopup(commonButtonClasses, text, onClickFunction, icon, disabled = false) {
  return () => (
    <button type="button" className={commonButtonClasses} onClick={onClickFunction} disabled={disabled}>
      {text}
      {icon}
    </button>
  );
}

export default function PopupOnEntryAction(props) {
  const {
    commonButtonClasses,
    responses,
    attemptingToDelete,
    deleted,
    popupVisible,
    setPopupVisible,
    handleSolved,
    showAsSolved,
    handleNewAskForHelp,
    cancelDelete,
    handleDelete,
    backToOverview,
  } = props;

  const { t } = useTranslation();

  const positiveActionButtonClasses = `bg-secondary text-white hover:opacity-75 rounded mb-2 block min-w-90 ${commonButtonClasses}`;
  const invertedDeleteButtonClasses = `text-primary font-medium min-w-90 ${commonButtonClasses.replace('font-bold', '')}`;

  const HeroFoundButton = getButtonForPopup(
    positiveActionButtonClasses,
    t('components.entry.popup.heroFound'),
    handleSolved,
    <DoneIcon className="ml-2 mb-1" />,
    showAsSolved,
  );

  const NewAskForHelpButton = getButtonForPopup(
    positiveActionButtonClasses,
    t('components.entry.popup.createNewRequest'),
    handleNewAskForHelp,
    <ArrowForwardIosIcon className="ml-2 mb-1" />,
  );

  const CancelButton = getButtonForPopup(
    positiveActionButtonClasses,
    t('components.entry.popup.cancel'),
    cancelDelete,
    null,
  );

  const DeleteAnywayButton = getButtonForPopup(
    invertedDeleteButtonClasses,
    t('components.entry.popup.deleteAnyway'),
    handleDelete,
    <ArrowForwardIosIcon className="ml-2 mb-1" />,
  );

  const DeleteTerminallyButton = getButtonForPopup(
    invertedDeleteButtonClasses,
    t('components.entry.popup.deleteTerminally'),
    handleDelete,
    <ArrowForwardIosIcon className="ml-2 mb-1" />,
  );

  const BackToOverviewButton = getButtonForPopup(
    invertedDeleteButtonClasses,
    t('components.entry.popup.backToOverview'),
    backToOverview,
    <ArrowForwardIosIcon className="ml-2 mb-1" />,
  );

  const PopupContentDeleteReassure = getPopupContentComponent(
    t('components.entry.popup.reassureDeletion'),
    <CancelButton />,
    <DeleteTerminallyButton />,
  );

  const PopupContentSolvedHint = getPopupContentComponent(
    t('components.entry.popup.wasYourRequestSuccessful.heading'),
    <HeroFoundButton />,
    <DeleteAnywayButton />,
  );

  const PopupContentDeleteSuccess = getPopupContentComponent(
    t('components.entry.popup.yourRequestWasDeleted.heading'),
    <NewAskForHelpButton />,
    <BackToOverviewButton />,
  );

  let popupContent = <></>;
  if (attemptingToDelete && (responses === 0 || showAsSolved)) popupContent = <PopupContentDeleteReassure />;
  if (attemptingToDelete && responses !== 0 && !showAsSolved) popupContent = <PopupContentSolvedHint />;
  if (deleted) popupContent = <PopupContentDeleteSuccess />;

  return (
    <Popup
      modal
      open={popupVisible}
      onClose={() => {
        setPopupVisible(false);
      }}
      // we cannot set this with classes because the popup library has inline style, which would overwrite the width and padding again
      contentStyle={
        {
          padding: '0',
          width: 'auto',
          maxWidth: '70%',
          minWidth: '30%',
        }
      }
    >
      {popupContent}
    </Popup>
  );
}
