import React from 'react';
import moment from 'moment';
import oura from './assets/oura-ring.png';

class DateSelectorController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      atomList: [],
    };

  }

  componentDidMount() {

  }

  render() {

    let styles = {
      snapShot : {border:"1px solid #B77373", color: "red", whiteSpace: "preline", backgroundColor: "#F0F0F0", padding: "10px"},
      moveRecordTitle : { fontWeight: "bold"}
    };
    let dateItems = this.props.dates.map((date) => {
      let moveRecords =
          // TODO: sort value for types
          this.props.moveRecords.map((moveRecord) => {
            let moveDate = moment(moveRecord.trueRecordDate, "YYYY-MM-DD").toDate();

            let textDiv = (moveRecord.recordValue != null) ? moveRecord.recordValue.split(/\r?\n/).map((text)=>{
              return <div> {text} <br/></div>;
            }) : null;

            // TODO: FIX THIS ^ recording swapped for recordTType or type -

            let recordDiv = (moveRecord.move.recordType == "Snapshot" || moveRecord.move.type == "Snapshot") ?
                (<p style={styles.snapShot}> 📸 SnapShot <br/><br/>{textDiv} </p>)
                : (moveRecord.move.recordType == "Text" || moveRecord.move.type == "Text")?
                    (<p style={{whiteSpace: "preline", backgroundColor: "#F0F0F0", padding: "10px"}}> {textDiv} </p>)
                    :
                (moveRecord.move.recordType == 'Workout') ?
                    <div>
                      <h3 style={{color:"#F8E71C"}}>💎 {moveRecord.move.name}</h3>
                      {moveRecord.recordValue}
                      </div> : (<div style = {{border:"1px solid #B77373", padding: "5px", fontSize:"0.7em"}}>{moveRecord.move.name}</div>);

                    if ((moveRecord.move.recordType == "Text" || moveRecord.move.type == "Text")){
                      console.log("movedate: " + moveDate + "summarydate: " + date);
                    }

            if (sameDay(moveDate, date)) {
              return <div ><div style={styles.moveRecordTitle}>{moveRecord.move.name}<br/></div><p>{ recordDiv }</p></div>;
            }

          });
      moveRecords.filter(x => x !== null);


      let sleepRecords =
          this.props.sleepRecords.map((sleepRecord) => {
            let sleepDate = moment(sleepRecord.summary_date, "YYYY-MM-DD").toDate();
            // new Date(moveRecord.trueRecordDate);


            let textDiv = <div> Sleep Record: {sleepRecord.name } <br/></div>;
            if (sameDay(sleepDate, date)) {
              return <div ><img style={{width:"20px",height:"20px"}} src={oura}/>
                <p>{ textDiv }</p></div>;
            }

          });
      sleepRecords.filter(x => x !== null);

      // TODO: Order by "Gems", Trace, and links, then whatever
      // Gems are defined as events, tags, and workouts, and symptoms (tags)
      return <div style={{float:"left", width:"15%"}}>

        <h1> {moment(date).format('MMM Do,ddd')}</h1>
        <br/>
        <div style={{
          margin: "4px 4px",
          padding: "4px",
          height: "410px",
          overflowX: "hidden",
          overflowY: "auto",
          textAlign: "justify"
        }}>
          {moveRecords}
          {sleepRecords}
        </div>
        <br/>
      </div>;
    });
    return (<div style={{width: "100%"}}>
      {dateItems}
      Container For Date
    </div>);
  }
};

function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
}

export default DateSelectorController;