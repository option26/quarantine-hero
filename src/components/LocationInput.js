import PlacesAutocomplete from 'react-places-autocomplete';
import React from 'react';
import { isMapsApiEnabled } from '../featureFlags.js';

export default function LocationInput(props) {
  if (isMapsApiEnabled) {
    return (
      <PlacesAutocomplete
        onChange={props.onChange}
        value={props.value}
        onSelect={props.onSelect}
        searchOptions={{
          types: ['(regions)'],
          componentRestrictions: { country: ['de', 'at', 'ch', 'it'] },
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div className="relative">
            <input
              required={props.required}
              {...getInputProps({
                placeholder: 'Deine Postleitzahl oder Nachbarschaft...',
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
      <input required={props.required} type="number" className="input-focus" maxLength={5} max={99999} placeholder="Deine Postleitzahl" onChange={(e) => props.onChange(e.target.value)} />
    </div>
  );
}
