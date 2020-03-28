import React from 'react';
import i18n from 'i18next';

export function getPopupContentComponent(heading, firstButtonComponent, secondButtonComponent) {
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

export function getButtonForPopup(commonButtonClasses, text, onClickFunction, icon, disabled = false) {
  return () => (
    <button type="button" className={commonButtonClasses} onClick={onClickFunction} disabled={disabled}>
      {text}
      {icon}
    </button>
  );
}
