import React, {useEffect, useState} from 'react';
import MoveService from '../../api/MoveService';

const ChecklistItem = (props) => {

  const [move, setMove] = useState(props);
  const [hover, setHover] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    setMove(props.move);
    setIsFinished(props.isFinished);

  }, [props]);

  let statusStyle = (move.hasOwnProperty('isFinished') && move.isFinished) ? { backgroundColor: "#72AD79"} : {};
  let typeStyle = null; // (move.tags.)
  let inputSubmissionDiv = <button style={{float: "right"}} onClick={()=> { MoveService.handleRecordSubmit(move, "");}}> button </button>;

  let styles = {
    backgroundStyle: {
      cursor: 'pointer',
      background: hover ?
          'red' :
          statusStyle.backgroundColor

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

  return (
      <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{...styles.item, ...styles.backgroundStyle, ...typeStyle, ...statusStyle}}>
        {move.name}
        {inputSubmissionDiv}
      </div>
  );
};

export default ChecklistItem;