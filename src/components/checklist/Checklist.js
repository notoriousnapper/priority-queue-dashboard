import {useEffect, useState} from 'react';
import axios from 'axios';
import {SpinnerDotted} from 'spinners-react';
import React from 'react';
import ChecklistItem from './ChecklistItem';

const Checklist = (props) => {

  const [moves, setMoves] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    setMoves(props.moves);
    setTitle(props.title);
      console.log("moves new: " + JSON.stringify(moves));
  }, [props]);

  return (
      <div style={{padding: "10% 20%"}}>
        <h3> {title} </h3>
        {/*{ JSON.stringify(moves) }*/}
        {(moves !== null) ? moves.map(
            move => {
              return (<ChecklistItem move={move}/>);
            }
        ) : null}
      </div>
  );
};

export default Checklist;