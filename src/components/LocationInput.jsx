import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isMapsApiEnabled } from '../featureFlags';
import { getSuggestions } from '../services/GeoService';

export default function LocationInput(props) {
  if (isMapsApiEnabled) {
    return <Autocomplete {...props} />;
  }
  return <ZipCodeInput {...props} />;
}

function ZipCodeInput(props) {
  const {
    required = true,
    defaultValue = '',
    onChange = () => {},
    onChangeDebounced = () => {},
    debounce = 200,
  } = props;

  const { t } = useTranslation();

  const [scheduledChange, setScheduledChange] = useState(undefined);

  const handleChange = (e) => {
    if (scheduledChange) {
      clearTimeout(scheduledChange);
    }

    const value = e.target.value;
    if (value.length >= 4 && value.length <= 5) {
      e.target.setCustomValidity('');
    } else {
      e.target.setCustomValidity(t('components.locationInput.invalidPlz'));
    }

    setScheduledChange(setTimeout(() => {
      onChangeDebounced(value);
    }, debounce));
    onChange(value);
  };

  return (
    <div className="w-full">
      <input
        required={required}
        defaultValue={defaultValue}
        type="number"
        className="input-focus"
        min={0}
        max={99999}
        minLength={4}
        maxLength={5}
        placeholder={t('components.locationInput.yourPostalCode')}
        onChange={handleChange}
      />
    </div>
  );
}

function Autocomplete(props) {
  const {
    required = true,
    defaultValue = '',
    onChange = () => {},
    fullText = false,
    onChangeDebounced = () => { },
    debounce = 200,
    minSearchInput = 4,
    onSelect = () => { },
  } = props;

  const { t } = useTranslation();
  const inputRef = useRef();

  const [scheduledChange, setScheduledChange] = useState(undefined);
  const [suggestions, setSuggestions] = useState([]);
  const [waitingForResults, setWaitingForResults] = useState(false);

  const loadSuggestions = async (searchValue) => {
    if (searchValue && searchValue.length >= minSearchInput) {
      try {
        const results = await getSuggestions(searchValue, {
          types: ['(regions)'],
          componentRestrictions: {
            country: ['de', 'at', 'ch', 'it'],
          },
        });

        setSuggestions(results);
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
    setWaitingForResults(false);
  };

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

  const handleDebouncedChange = (value) => {
    loadSuggestions(value);
    onChangeDebounced(value);
  };

  const handleChange = (value) => {
    setWaitingForResults(true);
    setInvalidNoSelect();
    if (scheduledChange) {
      clearTimeout(scheduledChange);
    }

    setScheduledChange(setTimeout(() => {
      handleDebouncedChange(value);
    }, debounce));
    onChange(value);
  };

  const handleSelect = (suggestion) => {
    if (suggestion) {
      setValidity(true);
      inputRef.current.value = suggestion.description;
      setSuggestions([]);
      onSelect(suggestion.description, suggestion.place_id);
    }
  };

  const validateKeypress = (event) => {
    const key = event.key;
    const keyInvalid = !fullText && key.length === 1 && !(/\d/.test(key));
    if (keyInvalid) {
      event.preventDefault();
    }
  };

  useEffect(setInvalidNoSelect, []);

  const loadingVisible = (inputRef.current && inputRef.current.value.length < minSearchInput) || waitingForResults;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="location-search-input appearance-none input-focus truncate"
        style={{ paddingRight: '45px' }}
        defaultValue={defaultValue}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        onKeyDown={validateKeypress}
        required={required}
        type="text"
        inputMode={fullText ? '' : 'numeric'}
        placeholder={fullText ? t('components.locationInput.yourPostalCodeOrNeighbourhood') : t('components.locationInput.yourPostalCode')}
      />
      {loadingVisible && (
        <LoadingIndicator
          className="absolute top-0 right-0 mr-2 mt-2"
          isLoading={inputRef.current && inputRef.current.value.length >= minSearchInput}
          fillLevel={inputRef.current && inputRef.current.value.length}
        />
      )}
      <div className="absolute w-full bg-white shadow-xl z-10">
        {suggestions.map((s) => (
          <AutocompleteSuggestion
            key={s.description}
            suggestion={s}
            onClick={() => handleSelect(s)}
          />
        ))}
      </div>
    </div>
  );
}

function LoadingIndicator(props) {
  const {
    isLoading = false,
    fillLevel = 0,
    className,
  } = props;

  const classNames = `${className} loader loader-${fillLevel} ${isLoading && 'loader-loading'}`;

  return (
    <div
      className={classNames}
    />
  );
}

function AutocompleteSuggestion(props) {
  const {
    suggestion,
    onClick,
  } = props;

  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
      {...props}
    >
      <span>{suggestion.description}</span>
    </div>
  );
}
