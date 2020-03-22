import React from 'react';
import ReactSlider from 'react-slider';

export default function Slider(props) {
  const {
    initialValue = 0,
    min = 0,
    max = 30,
    onChange,
    onAfterChange,
  } = props;

  return (
    <ReactSlider
      className="w-full flex items-center"
      thumbClassName="slider-handle cursor-pointer outline-none"
      trackClassName="slider-track"
      onAfterChange={onAfterChange}
      defaultValue={initialValue}
      onChange={onChange}
      min={min}
      max={max}
    />
  );
}
