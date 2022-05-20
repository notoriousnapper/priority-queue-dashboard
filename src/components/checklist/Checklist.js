import {useEffect, useState} from 'react';
import axios from 'axios';
import {SpinnerDotted} from 'spinners-react';
import React from 'react';
import ChecklistItem from './ChecklistItem';

const Checklist = (props) => {

  const [moves, setMoves] = useState(props);
  let checklist = null;

  useEffect(() => {
    setMoves(props);
      console.log("moves new: " + JSON.stringify(moves.moves));
  }, [props]);

  return (
      <div style={{padding: "10% 20%"}}>
        {/*{ JSON.stringify(moves) }*/}
        {(moves !== null && moves.moves !== null && moves.moves.data !== null) ? moves.moves.map(
            move => {
              return (<ChecklistItem move={move}/>);
            }
        ) : null}
      </div>
  );
};

export default Checklist;