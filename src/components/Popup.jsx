import React from 'react';
import { useTranslation } from 'react-i18next';
import Popup from 'reactjs-popup';

import DoneIcon from '@material-ui/icons/Done';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { ReactComponent as DotsSvg } from '../assets/dots_grey.svg';

import 'reactjs-popup/dist/index.css';

function getPopupContentComponent(heading, firstButtonComponent, secondButtonComponent, textBody = null) {
  const popupContentClasses = 'p-4 bg-kaki font-open-sans flex flex-col justify-center items-center';
  const popupTextClasses = 'mb-3 pt-2 pb-5 min-w-full pl-5 md:pl-8 whitespace-pre-line';
  return () => (
    <div className={popupContentClasses}>
      <div className={popupTextClasses}>
        <div className="font-bold">{heading}</div>
        {textBody}
      </div>
      {firstButtonComponent}
      {secondButtonComponent}
    </div>
  );
}

function getButtonForPopup(commonButtonClasses, text, onClickFunction, icon, cyIdentifier, disabled = false) {
  return () => (
    <button type="button" data-cy={cyIdentifier} className={commonButtonClasses} onClick={onClickFunction} disabled={disabled}>
      {text}
      {icon}
    </button>
  );
}

function getButtonForContextMenu(text, onClickFunction, icon, cyIdentifier, disabled = false) {
  const commonButtonClasses = 'focus:outline-none flex items-stretch w-full';
  return () => (
    <div className="rounded py-1 my-0.75 bg-white text-gray-700 popup-context-menu-entry">
      <button type="button" data-cy={cyIdentifier} className={commonButtonClasses} onClick={onClickFunction} disabled={disabled}>
        {icon}
        {text}
      </button>
    </div>
  );
}

export function ContextMenuPopup(props) {
  const {
    eligibleToSolve,
    initializeDelete,
    initializeSolve,
    showAsSolved,
  } = props;

  const { t } = useTranslation();

  const HeroFoundButton = getButtonForContextMenu(
    t('components.entry.contextMenu.heroFound'),
    initializeSolve,
    <DoneIcon className="ml-2 mb-1" />,
    'btn-context-menu-hero-found',
  );

  const DeleteButton = getButtonForContextMenu(
    t('components.entry.contextMenu.deletePost'),
    initializeDelete,
    <DeleteOutlineIcon className="ml-2 mb-1" />,
    'btn-context-menu-delete-anyway',
  );

  const popupContent = (
    <div className="font-open-sans flex flex-col justify-center items-left">
      {eligibleToSolve && !showAsSolved ? <HeroFoundButton /> : <></>}
      <DeleteButton />
    </div>
  );

  return (
    <Popup
      data-cy="popup-context-menu"
      className="popup-context-menu"
      position="left center"
      trigger={() => (
        <button
          type="button"
          className="focus:outline-none"
        >
          <DotsSvg className="dots" alt="" />
        </button>
      )}
      contentStyle={
        {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }
      }
    >
      {popupContent}
    </Popup>
  );
}

export function PopupOnEntryAction(props) {
  const {
    responses,
    attemptingToDelete,
    attemptingToSolve,
    deleted,
    popupVisible,
    handlePopupClose,
    showAsSolved,
    handleSolved,
    handleNewAskForHelp,
    cancelDelete,
    handleDelete,
    attemptingToRequestMoreHelp,
    cancelAttemptingToRequestMoreHelp,
    handleRequestMoreHelp,
    moreHelpRequested,
    moreHelpRequestFailed,
    backToOverview,
  } = props;

  const { t } = useTranslation();

  const positiveActionButtonClasses = 'bg-secondary text-white hover:opacity-75 rounded mb-2 block min-w-90 btn-common focus:outline-none';
  const negativeActionButtonClasses = 'text-primary min-w-90 btn-common-font-normal focus:outline-none';

  const strongerTogetherHashtag = <i> #strongertogether</i>;
  const textBodyWasYourRequestSuccessful = (
    <>
      <p className="mt-2">
        {t('components.entry.popup.wasYourRequestSuccessful.firstSentence')}
        {strongerTogetherHashtag}
      </p>
      <p>{t('components.entry.popup.wasYourRequestSuccessful.secondSentence')}</p>
      <p>{t('components.entry.popup.wasYourRequestSuccessful.thirdSentence')}</p>
    </>
  );

  const textBodySolveReassure = (
    <>
      <p className="mt-2">
        {t('components.entry.popup.solveReassure.firstSentence')}
      </p>
      <p>{t('components.entry.popup.solveReassure.secondSentence')}</p>
    </>
  );

  const textBodyYourRequestWasDeleted = (
    <>
      <p>{t('components.entry.popup.yourRequestWasDeleted.firstSentence')}</p>
      <p>
        {t('components.entry.popup.yourRequestWasDeleted.secondSentence')}
        {strongerTogetherHashtag}
      </p>
    </>
  );

  const textBodyAskForMoreHelp = (
    <>
      <p>{t('components.entry.popup.requestMoreHelp.firstSentence')}</p>
      <p>{t('components.entry.popup.requestMoreHelp.secondSentence')}</p>
      <p>{t('components.entry.popup.requestMoreHelp.thirdSentence')}</p>
    </>
  );

  const textBodyAskForMoreHelpSuccessful = (
    <>
      <p>{t('components.entry.popup.requestMoreHelpSuccessful.firstSentence')}</p>
      <p>{t('components.entry.popup.requestMoreHelpSuccessful.secondSentence')}</p>
      {strongerTogetherHashtag}
    </>
  );

  const textBodyAskForMoreHelpFailed = (
    <>
      <p>{t('components.entry.popup.requestMoreHelpFailed.firstSentence')}</p>
      <p>{t('components.entry.popup.requestMoreHelpFailed.secondSentence')}</p>
      {strongerTogetherHashtag}
    </>
  );

  const HeroFoundButton = getButtonForPopup(
    positiveActionButtonClasses,
    t('components.entry.popup.heroFound'),
    handleSolved,
    <DoneIcon className="ml-2 mb-1" />,
    'btn-popup-hero-found',
    showAsSolved,
  );

  const NewAskForHelpButton = getButtonForPopup(
    positiveActionButtonClasses,
    t('components.entry.popup.createNewRequest'),
    handleNewAskForHelp,
    <ArrowForwardIosIcon className="ml-2 mb-1" />,
    'btn-popup-ask-for-help',
  );

  const AskForMoreHelpButton = getButtonForPopup(
    positiveActionButtonClasses,
    t('components.entry.popup.requestMoreHelpButton'),
    handleRequestMoreHelp,
    <ArrowForwardIosIcon className="ml-2 mb-1" />,
    'btn-popup-ask-for-help',
  );

  const CancelButtonPositiveClass = getButtonForPopup(
    positiveActionButtonClasses,
    t('components.entry.popup.cancel'),
    cancelDelete,
    null,
    'btn-popup-cancel-positive',
  );

  const CancelButtonNegativeClass = getButtonForPopup(
    negativeActionButtonClasses,
    t('components.entry.popup.cancel'),
    cancelDelete,
    null,
    'btn-popup-cancel-negative',
  );

  const CancelAskForMoreHelpButtonClass = getButtonForPopup(
    negativeActionButtonClasses,
    t('components.entry.popup.cancel'),
    cancelAttemptingToRequestMoreHelp,
    null,
    'btn-popup-cancel-negative',
  );

  const DeleteAnywayButton = getButtonForPopup(
    negativeActionButtonClasses,
    t('components.entry.popup.deleteAnyway'),
    handleDelete,
    <ArrowForwardIosIcon className="ml-2 mb-1" />,
    'btn-popup-delete-anyway',
  );

  const DeleteTerminallyButton = getButtonForPopup(
    negativeActionButtonClasses,
    t('components.entry.popup.deleteTerminally'),
    handleDelete,
    <ArrowForwardIosIcon className="ml-2 mb-1" />,
    'btn-popup-delete-terminally',
  );

  const BackToOverviewButton = getButtonForPopup(
    negativeActionButtonClasses,
    t('components.entry.popup.backToOverview'),
    backToOverview,
    <ArrowForwardIosIcon className="ml-2 mb-1" />,
    'btn-popup-back-to-overview',
  );

  const PopupContentDeleteReassure = getPopupContentComponent(
    t('components.entry.popup.reassureDeletion'),
    <CancelButtonPositiveClass />,
    <DeleteTerminallyButton />,
  );

  const RequestMoreHelpReassure = getPopupContentComponent(
    t('components.entry.popup.requestMoreHelp.heading'),
    <AskForMoreHelpButton />,
    <CancelAskForMoreHelpButtonClass />,
    textBodyAskForMoreHelp,
  );

  const PopupContentSolveReassure = getPopupContentComponent(
    t('components.entry.popup.solveReassure.heading'),
    <HeroFoundButton />,
    <CancelButtonNegativeClass />,
    textBodySolveReassure,
  );

  const PopupContentSolvedHint = getPopupContentComponent(
    t('components.entry.popup.wasYourRequestSuccessful.heading'),
    <HeroFoundButton />,
    <DeleteAnywayButton />,
    textBodyWasYourRequestSuccessful,
  );

  const PopupContentDeleteSuccess = getPopupContentComponent(
    t('components.entry.popup.yourRequestWasDeleted.heading'),
    <NewAskForHelpButton />,
    <BackToOverviewButton />,
    textBodyYourRequestWasDeleted,
  );

  const RequestMoreHelpSuccess = getPopupContentComponent(
    t('components.entry.popup.requestMoreHelpSuccessful.heading'),
    <NewAskForHelpButton />,
    <BackToOverviewButton />,
    textBodyAskForMoreHelpSuccessful,
  );

  const RequestMoreHelpFailed = getPopupContentComponent(
    t('components.entry.popup.requestMoreHelpFailed.heading'),
    <></>,
    <BackToOverviewButton />,
    textBodyAskForMoreHelpFailed,
  );

  let popupContent = <></>;
  if (attemptingToSolve && !showAsSolved) popupContent = <PopupContentSolveReassure />;
  if (attemptingToDelete && (responses === 0 || showAsSolved)) popupContent = <PopupContentDeleteReassure />;
  if (attemptingToDelete && responses !== 0 && !showAsSolved) popupContent = <PopupContentSolvedHint />;
  if (deleted) popupContent = <PopupContentDeleteSuccess />;
  if (attemptingToRequestMoreHelp) popupContent = <RequestMoreHelpReassure />;
  if (moreHelpRequested) popupContent = <RequestMoreHelpSuccess />;
  if (moreHelpRequestFailed) popupContent = <RequestMoreHelpFailed />;

  return (
    <Popup
      modal
      data-cy="popup-hint-for-entry"
      open={popupVisible}
      onClose={handlePopupClose}
      // we cannot set this with classes because the popup library has inline style, which would overwrite the width and padding again
      contentStyle={
        {
          padding: '0',
          width: 'auto',
          maxWidth: '90%',
          minWidth: '30%',
        }
      }
    >
      {popupContent}
    </Popup>
  );
}
