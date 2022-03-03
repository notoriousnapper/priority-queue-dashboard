import React from 'react';
import DateContainer from './DateContainer';
import moment from 'moment';

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

    // let startDate = Date.this.props.starteDate
    let dateItems = this.props.dates.map((date) => {
      let moveRecords =
          // TODO: sort value for types
          this.props.moveRecords.map((moveRecord) => {
            let moveDate = moment(moveRecord.trueRecordDate, "YYYY-MM-DD").toDate();
                // new Date(moveRecord.trueRecordDate);

            console.log(
                'unchanged: ' + moveRecord.trueRecordDate + '\nDates: ' + moveDate.toISOString() + '\n orig moment date' + date + ' moves ' +
                JSON.stringify(moveRecord));

            let textDiv = (moveRecord.recordValue != null) ? moveRecord.recordValue.split(/\r?\n/).map((text)=>{
              return <div> {text} <br/></div>;
            }) : null;

            console.log("record type " + moveRecord.move.recordType);
            // TODO: FIX THIS ^ recording swapped for recordTType or type -
            let recordDiv = (moveRecord.move.recordType == "Text" || moveRecord.move.type == "Text")?
                <p style={{whiteSpace: "preline", backgroundColor: "#F0F0F0", padding: "10px"}}> {textDiv} </p> :
                (moveRecord.move.recordType == 'Workout') ?
                    <div>
                      💎 <h3>{moveRecord.move.name}</h3>
                      <br/> { moveRecord.recordValue}
                      </div> : (<div>
                      {moveRecord.move.name}
                      <br/> { moveRecord.recordValue}
                    </div>);

                    if ((moveRecord.move.recordType == "Text" || moveRecord.move.type == "Text")){
                      console.log("movedate: " + moveDate + "summarydate: " + date);
                    }

            if (sameDay(moveDate, date)) {
              return <div> <b>{moveRecord.move.name} </b><p>{ recordDiv }</p></div>;
            }

          });
      moveRecords.filter(x => x !== null);

      // TODO: Order by "Gems", Trace, and links, then whatever
      // Gems are defined as events, tags, and workouts, and symptoms (tags)
      return <div style={{float:"left", width:"15%"}}>
        <div>
          💎 Things to look forward too
          1. Hawaii Trip w/ Friends. Just art, healing, strength, in a good time to bring friends.
          2.

        </div>
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