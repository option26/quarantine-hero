import { useEffect, useState } from 'react';
import createEventListener from '../util/createEventListener';
import { ArrowDownIcon } from '../util/Icons';

export default function ArrowDown(props) {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const hideOffset = 100;

  useEffect(() => {
    setVisible(window.pageYOffset < hideOffset);
    return createEventListener(window, 'scroll', () => {
      setVisible(window.pageYOffset < hideOffset);
      setOpacity((hideOffset - window.pageYOffset) / hideOffset);
    });
  }, []);

  if (visible) {
    return (
      <button type="button" style={{ opacity }} className="arrow-more-content flex items-center justify-center w-full" onClick={() => props.onClick()}>
        <img alt="arrow-down" className="mt-1" src={ArrowDownIcon} />
      </button>
    );
  }
  return null;
}
