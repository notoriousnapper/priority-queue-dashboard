import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {SpinnerDotted} from 'spinners-react';

import Checklist from './components/checklist/Checklist';
import MoveItemHelper from './helper/MoveItemHelper.js';
import Globals from './helper/Globals';
import ListItem from './components/ListItem';

const DailyDashboard = () => {

  const [dailyMoves, setDailyMoves] = useState([]);
  const [weeklyMoves, setWeeklyMoves] = useState([]);
  const [moveRecords, setMoveRecords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [randomItem, setRandomItem] = useState({name:"", type:"", description:"", tags:""});

  const fetchMoveRecordsAndSync = (rawMoves) => {
    setLoading(true);
    axios.get(Globals.moveRecordUrlFilterByToday).
        then(res => {
          setMoveRecords(res.data);
          let rawMoveRecords = res.data;
          console.log(rawMoveRecords.length + rawMoves.length + "x");
          for (let i = 0; i < rawMoves.length; i++){
            for (let j = 0; j < rawMoveRecords.length; j++){
              if (rawMoves[i].id === rawMoveRecords[j].move.id){
                rawMoves[i]["isFinished"] = true;
              }
            }
          }
          setDailyMoves(MoveItemHelper.filterByTag(rawMoves, "daily"));
          setWeeklyMoves(MoveItemHelper.filterByTag(rawMoves, "weekly"));
          setLoading(false);
        });
  }
  const fetchDailyMoves = () => {
    try {
      setLoading(true);
      return axios.get(Globals.moveUrl)
    } catch (e) {
      console.log(e);
    }
  };

  const fetchRandomListItem = () => {
    try {
      axios.get(Globals.listItemRandomizedUrl).then(
          res => {
            setRandomItem(res.data);
          }
      )
    } catch (e) {
      console.log(e);
    }
  }


  useEffect(() => {
    fetchDailyMoves().then((res)=>{
      let returnVal = res.data;
      console.log("return val" + JSON.stringify(returnVal));
      fetchMoveRecordsAndSync(returnVal);
      // setMoves(MoveItemHelper.filterByTag(rawMoves, "daily"));
    }).catch(err => console.log("Axios err: ", err));

    fetchRandomListItem();
  }, []);

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
        <ListItem img={null} listItem={randomItem}/>
        <Checklist title={"Weeklies"} moves={weeklyMoves}/>
        <Checklist title={"Dailies"} moves={dailyMoves}/>

      </div>
  );
};

export default DailyDashboard;