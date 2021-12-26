import './App.css';
import React from 'react';
import oura from './oura-ring.png';
import stretch from './stretch.png';
import release from './release.png';
import ok from './ok.png';
import flow from './flow.png';
import exercise from './exercise.png';
import techniqueOne from './technique-1.png';
import techniqueTwo from './technique-2.png';

import CardContainer from './CardContainer';
import DateController from './DateController';
// import { printConsoleTest as testFn} from './helper/loadjson'; TODO: Delete


import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';




const proxyString = "http://localhost:9999"; // 9999 with proxyman
const sleepUrl = new URL(proxyString + "/sleep");
const moveUrl = new URL(proxyString + "/move")
const moveRecordUrl = new URL(proxyString + "/moverecords")

// new URL("http://localhost:3010"); // Proxy URL
// const ouraUrl = new URL("https://api.ouraring.com/v1/sleep?access_token=3JEBRXC3GYTA6UVHK2KR2LDKAEE3FQOV&start=2021-08-21&end=2021-09-04");


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            totalReactPackages: null,
            ouraSleepSummaryList: [],
            movesList:[],
            recordList:[],
            startDay: "2021-08-19",
            endDay: "2021-09-01",
            showHideTestPage: true, // For main other lifedash
            showHideByDatePage: false,
            isWeekViewOn: false,
            value: {
                // "30s"
            },
            hide:{
                "move": false,
                "record":false
            }
        };

        this.handleChange = this.handleChange.bind(this);
    }


    handleHide(key){
        let hideObj = this.state.hide;
        hideObj[key] = !this.state.hide[key];

        this.setState(hideObj);
    }


    handleChange(event, keyId) {
        let obj = this.state.value;
        obj[keyId] = event.target.value;
        this.setState({value: obj});

        console.log( "Value" +  JSON.stringify(obj));
    }

    handleSubmit(move, recordValue){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", moveUrl.href, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            ...move,
            "recordValue": recordValue
        }));


        // (async () => {
        //     const rawResponse = await fetch("http://localhost:8080/move", {
        //         method: 'POST',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({id: 1, name: 'Textual content'})
        //     });
        //     const content = await rawResponse.json();
        //
        //     console.log("Content for post" + content);
        // })();
    }

    componentDidMount(){
        // Add "AWAIT" & Related as needed
        // Simple GET request using fetch
        // TODO: Check if it
        // TODO: unit tests?
        // TODO: worth learning ... + java
        // TODO: Error checks?

        // ouraUrl.searchParams.set("start", this.state.startDay)
        // ouraUrl.searchParams.set("end", this.state.endDay)
        // TODO: use ouraSearch with input

        // fetch(sleepUrl)
        //     .then(response => response.json())
        //     .then(data =>
        //     {
        //         if (data.sleep){
        //             this.setState({ouraSleepSummaryList: data.sleep});
        //         }
        //     });
        // TODO: - make the input by filter
        var params = {filter:"PRIORITY"}; // or:
        moveUrl.search = new URLSearchParams(params).toString();

        fetch(moveUrl)
            .then(response => response.json())
            .then(data =>
            {
                if (data){
                    this.setState({movesList: data});
                }

                let obj = {};
                data.forEach((a)=>{
                    obj[a.id] =  "";
                });

                //     });
                // }
            });


        fetch(moveRecordUrl)
            .then(response => response.json())
            .then(data =>
            {
                if (data){
                    this.setState({recordList: data});
                }
            });

    }
    render() {


        let styles = {
            ul: {
                display: "block"
            },
            li: {
                float: "left",
                display: "inline",
                border: "thick double #32a1ce",
                textAlign: "center"

            },
            year: {
                textAlign: "center",
                fontSize: "15px"  // TODO: Make scalable

            },
            oura: {
                width: "40px",
                height: "40px"
            }

        }

        const {ouraSleepSummaryList, movesList, recordList} = this.state; // Important line caused errors

        const sleepComponentsList = [
            ouraSleepSummaryList.map(
                item => {
                    const date = item.summary_date;
                    const displayDate = convertDateStringToMonthDay(item.summary_date);
                    const sleepDate = convertStringToDate(date);
                    console.log("Conversion" + sleepDate);
                    const dayOfWeek = weekday[sleepDate.getDay()];
                    return <li style={styles.li} key={date}> {dayOfWeek} <br/> {displayDate}
                        <br/> {} {truncateDuration((item.total / 60 / 60).toString())} hours </li>
                }
            )];

        const sleepComponentsParent = () => {
            return <ul style={styles.ul}> {sleepComponentsList} </ul>
        };
        console.log(sleepComponentsList);
        if (this.state.isWeekViewOn){
            return (
                <div className="card text-center m-3">
                    <img src={oura} style={styles.oura} alt="Logo" />
                    <h5 className="card-header">Powered by Oura Stealth Black Ring</h5>
                    <div className="card-body">
                        <div style={styles.year}> {new Date().getFullYear()} </div>
                    </div>
                    <div className="card-body">
                    </div>

                    <DateController />
                    <CardContainer />

                </div>
            );
        }
        else {
            const moveDiv =  [movesList.map(move=>{
                let image = (move.type === "Release") ? release :
                    (move.type === "Stretch") ? stretch :
                    (move.type === "Flow") ? flow :
                    (move.type === "Exercise" || move.type === "Strengthen") ? exercise :
                    (move.type === "TechniqueRepeat") ? techniqueOne :
                        oura
                ;

                /* MOVE DIV */

                let buttonStyle = {"float":"right"};
                let labelStyle = {"marginRight":"10px","width":"60px", "backgroundColor": "#33F894", "color":"black"};
                let textArea = (move.recordType !== "Do")? <textarea value={this.state.value[move.id]}
                              onChange={(e)=>{this.handleChange(e, move.id)}} />
                    : null;

                return <div
                key={move.id}
            style={{
                "color":"white",
                "backgroundColor":"grey",
                "display":"inline-block",
                "padding:":"10px 20px",
                "margin":"10px",
                "backgroundImage": `url(${move.imageURL})`,
                "backgroundSize": "150px 160px",
                "backgroundRepeat": "no-repeat"
            }}>
                    <div style={{"fontSize":"20px","fontWeight":"bold"}}> {move.name} </div>
                    <div style={labelStyle}> {move.type} </div>
                    {/*<div style={labelStyle}> {move.recordType} </div>*/}
                <img style={{"height":"50px"}} src={image} alt="Logo" />
                    <label>
                        {/*<textarea value={this.state.value[moveId]} onChange={this.handleChange} />*/}
                        {textArea}
                    </label>
                    <button style={buttonStyle} onClick={(e)=>{this.handleSubmit(move, this.state.value[move.id], e)}}>
                        <img style={{"height":"30px", "cursor":"pointer"}} src={ok} alt="Logo" />
                        </button>
                <br/>
                </div>
            })];

            let spanStyle= {"backgroundColor":"black", "width": "390px"};
            const recordDiv =  [recordList.map(move=>{ return <div
                style={{
                    "color":"white",
                    "backgroundColor":"grey",
                    "display":"inline-block",
                    "padding:":"10px 20px",
                    "margin":"10px",
                    "width":"100%"
                }}>

                <div >
                    <span style={spanStyle}> {move.move.name.toUpperCase()} <em>--</em></span>
                {move.recordValue} <em>--</em>
                {move.dateTime} <em>--</em>
                </div>
                <br/>
            </div>
            })];



            let moves = <div> Day view Here
                <div> {moveDiv} </div>
            </div>;
            let records = <div> Day view Here
                <div> Record Log of Moves </div>
                <div> {recordDiv} </div>
            </div>;


            let hiddenMoves = (this.state.hide["move"]) ? <div> Day (Hidden) </div> : moves;
            let hiddenRecord = (this.state.hide["record"]) ? <div> Hidden Record </div> : records;
            let btnStyle= {"height":"100px"};


            return <div>
                <button style={btnStyle} onClick={()=>{this.handleHide("move")}}> HIDE MOVES </button>
                {hiddenMoves}

                <button style={btnStyle} onClick={()=>{this.handleHide("record")}}> Hide Records</button>
                {hiddenRecord}
            </div>
        }

    }
}
// TODO: Important
// sleepComponentsParent()
{/*<WorkoutContainer/>*/}

const convertDateStringToMonthDay = function (dateString) {

    let dateParts = dateString.split("-"); // TODO: implementation specific to oura, change to handle multiple or use Moment.js
    let newDateString = dateParts[1] + "-" + dateParts[2];
    return newDateString;
}
const convertStringToDate = function (dateString) {

    let dateParts = dateString.split("-"); // TODO: implementation specific to oura, change to handle multiple or use Moment.js
    let myDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // month starts from 0, January
    return myDate;
};

// TODO: Make better, will error out if number is less than 4 characters?
const truncateDuration = function (durationString) {
    return durationString.substring(0, 3);
}

const weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

export default App;