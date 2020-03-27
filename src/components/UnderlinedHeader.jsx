import React from 'react';

export default function UnderlinedHeader({ title }) {
  return (
    <div>
      <p className="one-third-underline text-medium uppercase font-bold">{title}</p>
    </div>
  );
}
