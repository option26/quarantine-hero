import React from 'react';
import i18n from 'i18next';

export function getPopupContentComponent(heading, firstButtonComponent, secondButtonComponent) {
  const popupContentClasses = 'p-4 bg-kaki font-open-sans flex flex-col justify-center items-center';

  const textBodyWasYourRequestSuccessful = (
    <>
      <p className="mt-2">
        Lass die Community wissen ob deine Suche erfolgreich war.
        <i>#strongertogether</i>
      </p>
      <p>Anstatt dein Hilfegesuch zu löschen markieren wir es als abgeschlossen.</p>
      <p>Du kannst es natürlich jederzeit trotzdem löschen.</p>
    </>
  );

  const textBodyYourRequestWasDeleted = (
    <>
      <p>Bitte beachte, dass es einen Moment dauern kann, bis der Eintrag gelöscht wird.</p>
      <p>
        Du kannst natürlich jederzeit eine neue Anfrage erstellen und eine*n Held*in um Hilfe bitten.
        <i>#strongertogether</i>
      </p>
    </>
  );

  /* eslint-disable-next-line no-nested-ternary */
  const textBody = heading === i18n.t('components.entry.popup.wasYourRequestSuccessful')
    ? textBodyWasYourRequestSuccessful
    : (heading === i18n.t('components.entry.popup.yourRequestWasDeleted') ? textBodyYourRequestWasDeleted : null);

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
