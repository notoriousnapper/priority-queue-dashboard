import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {SpinnerDotted} from 'spinners-react';

import Checklist from './components/checklist/Checklist';
import MoveItemHelper from './helper/MoveItemHelper.js';


let BASE_URL_PROXY = 'http://localhost:8080'; // 9999 with proxyman
const moveUrl= new URL(BASE_URL_PROXY + '/move');

// const arrayContainsTags = (tagArr) => {
//   for (let i = 0; i < tagArr.length; i++){
//     if (move.tags[i].includes("daily")){
//       return true;
//     }
//   }
//   return false;
// }
const filterByDailyTag = (moves) => {
  if (!moves){
    return [];
  } else {
    return moves.filter((move) => {
      return MoveItemHelper.arrayContainsTags(move.tags, move);
    })
  }
}

const DailyDashboard = () => {

  let intervalRef = useRef();
  intervalRef = [];

  let tempMoves = [
    {name: "a"},
    {name: "b"}
  ]

  const [moves, setMoves] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchMoves = () => {
    try {
      setLoading(true);
      const data = axios.get(moveUrl).
          then(res => {
            console.log("Getting moves" + JSON.stringify(res.data));
            setMoves(filterByDailyTag(res.data));
            setLoading(false);
          });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchMoves();
  }, []);
  console.log("new mvs: " + moves);

  return (
      <div>
        Daily Dashboard!
        Includes
        daily-core, daily-sleep, daily-sleep-reset

        💎 #1 Take control of your health.  For others sake in your life, and for your own dreams.
        {/*{JSON.stringify(moves)}*/}
        {
          (loading) ? <SpinnerDotted enabled={true} size={'100px'}/> : null
        }
        {/*<Checklist moves={moves}/>*/}
        <Checklist moves={moves}/>
      </div>
  );
};

export default DailyDashboard;