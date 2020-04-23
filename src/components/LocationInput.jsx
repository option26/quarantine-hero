import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/browser';
import { isMapsApiEnabled } from '../featureFlags';
import { getSuggestions } from '../services/GeoService';

export default function LocationInput(props) {
  const {
    fullText,
    required,
    value,
    onChange,
    onSelect,
  } = props;

  if (isMapsApiEnabled) {
    return <Autocomplete required={required} value={value} onChange={onChange} onSelect={onSelect} fullText={fullText} />;
  }

  return <ZipCodeInput required={required} value={value} onChange={onChange} onSelect={onSelect} />;
}

function ZipCodeInput(props) {
  const {
    required = true,
    defaultValue = '',
    onChange = () => { },
    onChangeDebounced = () => { },
    debounce = 200,
  } = props;

  const { t } = useTranslation();

  const [scheduledChange, setScheduledChange] = useState(undefined);

  const handleChange = (e) => {
    if (scheduledChange) {
      clearTimeout(scheduledChange);
    }

    const { value } = e.target;
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
    onChange = () => { },
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

  const [selectionIndex, setSelectionIndex] = useState(-1);

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
        Sentry.captureException(err);
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
    const { key } = event;
    const keyInvalid = !fullText && key.length === 1 && !(/\d/.test(key));
    if (keyInvalid) {
      event.preventDefault();
    }
  };

  const handleKeyDown = (event) => {
    const { keyCode } = event;
    if (keyCode === 38) {
      setSelectionIndex((prevIdx) => {
        if (prevIdx === 0 && inputRef.current) {
          inputRef.current.focus();
        }
        return prevIdx > -1 ? prevIdx - 1 : -1;
      });
      event.preventDefault();
    }
    if (keyCode === 40) {
      setSelectionIndex((prevIdx) => (prevIdx < suggestions.length - 1 ? prevIdx + 1 : suggestions.length - 1));
      event.preventDefault();
    }
  };

  useEffect(setInvalidNoSelect, []);

  const loadingVisible = (inputRef.current && inputRef.current.value.length < minSearchInput) || waitingForResults;

  return (
    <div role="combobox" aria-controls="suggestion-box" aria-expanded={suggestions.length > 0} className="relative" tabIndex="0" onKeyDown={handleKeyDown}>
      <input
        ref={inputRef}
        className="location-search-input appearance-none input-focus truncate"
        data-cy="location-search-input"
        style={{ paddingRight: '45px' }}
        defaultValue={defaultValue}
        onChange={(e) => {
          setSelectionIndex(-1);
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
      <div id="suggestion-box" className="absolute w-full bg-white shadow-xl z-10">
        {suggestions.map((s, i) => (
          <AutocompleteSuggestion
            key={s.description}
            data-cy="autocomplete-suggestion"
            index={i}
            selectionIndex={selectionIndex}
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
    index,
    selectionIndex,
    onClick,
  } = props;

  const ref = useRef();

  useEffect(() => {
    if (selectionIndex === index && ref.current) {
      ref.current.focus();
    }
  }, [index, selectionIndex]);

  return (
    <button
      ref={ref}
      type="button"
      data-cy="autocomplete-suggestion"
      className="px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer w-full text-left"
      onClick={onClick}
    >
      <span>{suggestion.description}</span>
    </button>
  );
}
