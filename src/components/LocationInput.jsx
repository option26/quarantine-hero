import PlacesAutocomplete from 'react-places-autocomplete';
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isMapsApiEnabled } from '../featureFlags';

export default function LocationInput(props) {
  const { t } = useTranslation();

  const validateNumber = (event) => {
    const charCode = (event.which) ? event.which : event.keyCode;
    return charCode <= 47 || (charCode >= 48 && charCode <= 57);
  };

  const inputRef = useRef();
  const setValidity = (valid, msg = undefined) => {
    if (valid) {
      inputRef.current.setCustomValidity('');
    } else {
      inputRef.current.setCustomValidity(msg);
    }
  };

  const setInvalidNoSelect = () => {
    if (isMapsApiEnabled) {
      setValidity(false, t('components.locationInput.invalidNoSelect'));
    }
  };

  useEffect(setInvalidNoSelect, []);

  if (isMapsApiEnabled) {
    return (
      <PlacesAutocomplete
        onChange={(value) => {
          setInvalidNoSelect();
          props.onChange(value);
        }}
        value={props.value}
        onSelect={(value, placeId) => {
          // We want to prevent hitting enter without selecting entry, hence we check
          // placeId as it is null if enter is pressed wthout an entry being selected
          if (value && placeId) {
            setValidity(true);
            props.onSelect(value);
          }
        }}
        searchOptions={{
          types: ['(regions)'],
          componentRestrictions: { country: ['de', 'at', 'ch', 'it'] },
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div className="relative">
            <input
              ref={inputRef}
              required={props.required}
              {...getInputProps({
                onKeyDown: (e) => {
                  if (!props.fullText && !validateNumber(e)) e.preventDefault();
                },
                placeholder: props.fullText ? t('components.locationInput.yourPostalCodeOrNeighbourhood') : t('components.locationInput.yourPostalCode'),
                className: 'location-search-input appearance-none input-focus',
              })}
            />
            <div className="absolute w-full shadow-xl z-10">
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? 'p-2 suggestion-item--active'
                  : 'p-2 suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
  return (
    <div className="w-full">
      <input
        ref={inputRef}
        required={props.required}
        type="number"
        className="input-focus"
        maxLength={5}
        min={0}
        max={99999}
        placeholder={t('components.locationInput.yourPostalCode')}
        onChange={(e) => {
          if (e.target.value.length >= 4 && e.target.value.length <= 5) {
            setValidity(true);
          } else {
            setValidity(false, t('components.locationInput.invalidPlz'));
          }
          props.onChange(e.target.value);
        }}
      />
    </div>
  );
}
