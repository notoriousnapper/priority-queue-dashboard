import React, {useEffect, useState} from 'react';

const ChecklistItem = (props) => {

  const [move, setMove] = useState(props);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    setMove(props.move);

  }, [props]);

  let styles = {
    backgroundStyle: {
          cursor: 'pointer',
          background: hover ?
              'red' :
              '#F3F3F3',
    },
    item: {
      border: 'black solid',
      width: '100%',
      height: '50px'
    },
    button: {
      float: 'right',
    },
  };

  let typeStyle = null; // (move.tags.)

  return (
      <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{...styles.item, ...styles.backgroundStyle, ...typeStyle}}>
        {move.name}
      </div>
  );
};

export default ChecklistItem;