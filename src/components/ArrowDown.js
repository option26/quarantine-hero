import React, { useEffect, useState } from 'react';

export default function ArrowDown (props) {

  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const hideOffset = 100;

  useEffect(() => {
    window.addEventListener('scroll', (event) => {
      setVisible(window.pageYOffset < hideOffset);
      setOpacity((hideOffset - window.pageYOffset) / hideOffset)
    });
    setVisible(window.pageYOffset < hideOffset);
  }, []);

  if(visible) {
    return(
      <div style={{opacity: opacity}} className="arrow-more-content justify-center w-full" onClick={() => props.onClick()}>
        <img alt="arrow-down" className="arrow-down" src={require('../assets/arrow_down.png')}/>
      </div>
    );
  } else {
    return null;
  }
    
}
