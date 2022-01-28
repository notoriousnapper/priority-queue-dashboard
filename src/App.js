import './App.css';
import React from 'react';
import "video.js/dist/video-js.css";


import oura from './assets/oura-ring.png';
import stretch from './assets/stretch.png';
import release from './assets/release.png';
import ok from './assets/ok.png';
import flow from './assets/flow.png';
import exercise from './assets/exercise.png';
import techniqueOne from './assets/technique-1.png';

import fireflyVideo from './assets/fireflyVideo.mp4';

import CardContainer from './CardContainer';
import HappyJarContainer from './HappyJarContainer';
import DateController from './DateController';
import Info from './components/Info';
import BarGraph from './components/BarGraph';
import greenBorder from './assets/green-border.svg';
import AtomShell from './components/AtomShell';


const proxyString = "http://localhost:8080"; // 9999 with proxyman
const sleepUrl = new URL(proxyString + "/sleep");
const moveUrl = new URL(proxyString + "/move")
const movePostUrl = new URL(proxyString + "/move")
const moveRecordUrl = new URL(proxyString + "/moverecords")
const moveAggregateUrl = new URL(proxyString + "/aggregates")



class App extends React.Component {
    constructor(props) {
        super(props);

        // Local storage for caching state of dashboard hide toggle
        let h = ((window.localStorage.getItem("hide")) == null) ? {
            "move": false,
                "moveAll": true,
                "record":true
        } : (JSON.parse(window.localStorage.getItem("hide")));

        this.state = {
            audio: null,
            aggregates:[],
            aggregateFilterType: "sum",
            totalReactPackages: null,
            ouraSleepSummaryList: [],
            movesList:[],
            movesAllList:[],
            recordList:[],
            startDay: "2021-08-19",
            endDay: "2021-09-01",
            showHideTestPage: true, // For main other lifedash
            showHideByDatePage: false,
            isWeekViewOn: false,
            value: {
                // "30s"
            },
            hide: h
        };

        this.handleChange = this.handleChange.bind(this);
    }


    handleHide(key){
        let hideObj = this.state.hide;
        hideObj[key] = !this.state.hide[key];

        window.localStorage.setItem("hide",
            JSON.stringify(hideObj));
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
        xhr.open("POST", movePostUrl.href, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            ...move,
            "recordValue": recordValue
        }));
        console.log("Submitted move: " + JSON.stringify(move));
        this.state.audio.play();
    }

    componentDidMount(){
        this.state.audio = document.getElementsByClassName("audio-element")[0];

        fetch(moveUrl)
            .then(response => response.json())
            .then(data =>
            {
                if (data){
                    this.setState({movesAllList: data});
                }
                let obj = {};
                data.forEach((a)=>{
                    obj[a.id] =  "";
                });
            });


        // Get moves with filter
        var params = {filter:"PRIORITY", filterTwo: "ATOM_SIZE_DESCENDING"};
        moveUrl.search = new URLSearchParams(params).toString();
        fetch(moveUrl)
            .then(response => response.json())
            .then(data =>
            {
                console.log("data: " + JSON.stringify(data));
                if (data){
                    this.setState({movesList: data});
                }
            });


        fetch(moveRecordUrl)
            .then(response => response.json())
            .then(data =>
            {
                if (data){
                    this.setState({recordList: data});
                }
            });

        // Fetch Aggregates
        var aggregateParams = {idList:[], aggregateType: this.state.aggregateFilterType, showAllAggregates: true};
        fetch(moveAggregateUrl,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aggregateParams)
            })
            .then(response => response.json())
            .then(data =>
            {
                if (data){
                    this.setState({aggregates: data});
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

        const {ouraSleepSummaryList, movesList, movesAllList, recordList} = this.state; // Important line caused errors

        // Adding filtered groups by Tags
        let bioHackMoves = movesAllList.filter(
            moves => {
                console.log("Where is biohack" + JSON.stringify(moves));
            if (moves.tags == null) {
            }
            else {
                console.log("All the Tags: " + JSON.stringify(moves.tags) + "found:" + moves.tags.find((t) => t === "biohack"));
                return moves.tags.find((t) => t === "biohack") === "biohack";
            }
        });

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

            const createMoveGeneralDivFromArray = function(mList){
                if (mList.length === 0){
                    return [];
                }
                return [mList.map(move=>{
                    let image = (move.type === "Release") ? release :
                        (move.type === "Ritual") ? oura :
                        (move.type === "Stretch") ? stretch :
                            (move.type === "Flow") ? flow :
                                (move.type === "Exercise" || move.type === "Strengthen") ? exercise :
                                    (move.type === "TechniqueRepeat") ? techniqueOne :
                                        oura
                    ;

                    /* MOVE DIV */
                    let buttonStyle = {"float":"right"};
                    let labelStyle = {"paddingLeft":"15px","fontWeight":"light","fontSize":"12px","padding":"2px 10px 2px 7px","marginRight":"10px","width":"fit-content","backgroundColor": "#5e5e5e", "color":"black"};
                    let textArea = (move.recordType !== "Do")? <textarea style={{"width":"50%"}} value={this.state.value[move.id]}
                                                                         onChange={(e)=>{this.handleChange(e, move.id)}} />
                        : null;

                    let divType = ""; // type: [smallAtom, mediumAtom, bigAtom, listAtom]...
                        // Needs to be here before styles
                    let customStyles  =  {

                        mediumTileGeneral:{
                            backgroundImage: `url(${greenBorder})`,
                            backgroundSize: "100% 100%",
                            backgroundPosition: "left",
                            width: "410px",
                            cursor: "pointer"
                        },
                        mediumTileLabel: {
                            backgroundColor : "#05004F",
                            fontWeight: "bold",
                            fontStyle: "italic",
                            paddingLeft:"10px"
                        },
                        mediumTileTitle:{
                            font: "10px",
                            paddingLeft:"10px",
                            textAlign: "center"
                        },
                        mediumTileImage: {
                            marginTop: "9px",
                            height:"40px",
                            marginLeft:"10px"
                        },

                        smallTileGeneral:{
                            "opacity":"90%",
                            "width": "140px"
                        },
                        smallTileTitle:{
                            // "width": "140px"
                            fontSize: "13px"
                        },
                        smallTileLabel: {
                            backgroundColor : "#05004F",
                            fontWeight: "bold",
                            fontStyle: "italic",
                            paddingLeft:"10px",
                            fontSize: "10px"
                        },
                        smallTileImage: {
                            height:"30px"
                        },
                        smallTileSubmit: {
                            height:"30px",
                            width:"30px",
                            backgroundColor : "#33F894",
                            border : "15px #abdf86",
                            cursor: "pointer"
                        }
                    };
                    let color = "white";
                    let bgColor = "grey";
                    let selectedTypeStyle = {}, selectedTypeImageStyle = {}, selectedTypeSubmitStyle  = {},
                        selectedLabelStyle, selectedTitleStyle = {};
                    switch(move.type) {
                        case "Ritual":
                            divType = "mediumAtom";
                            break;
                        case "Flow":
                            break;
                        case "Workout":
                            bgColor = Colors.lightGreen;
                            color = "black";
                            break;
                        case "Affirmation":
                            bgColor = "#efcd02";
                            color = "black"; // TODO: clean *this*
                            divType = "smallAtom";
                            break;
                        default:
                            // selectedTypeStyle = customStyles.smallTileGeneral;
                            // break;
                        // code block
                    }
                    // TODO: Primary* tag first?, have separate PRIMARYTAG column?
                    switch(move.tags[0]) {
                        case "biohack":
                            bgColor = "#006bb4";
                            color = "black"; // TODO: clean *this*
                            divType = "smallAtom";
                            break;
                        default:
                    }
                    switch(divType){
                        case "smallAtom":
                            selectedTypeSubmitStyle= customStyles.smallTileSubmit;
                            selectedTypeImageStyle = customStyles.smallTileImage;
                            selectedTypeStyle = customStyles.smallTileGeneral;
                            selectedTitleStyle = customStyles.smallTileTitle;
                            selectedLabelStyle = customStyles.smallTileLabel;
                            break;
                        case "mediumAtom":
                            // selectedTypeSubmitStyle= customStyles.mediumTileSubmit;
                            selectedTypeImageStyle = customStyles.mediumTileImage;
                            selectedTypeStyle = customStyles.mediumTileGeneral;
                            selectedLabelStyle = customStyles.mediumTileLabel;
                            selectedTitleStyle = customStyles.mediumTileTitle;
                            break;
                        case "bigAtom":
                            break;
                        default:
                            break;
                    }
                        // (move.type === "Workout") ? : "grey";
                    let styles = {
                        overflow: {
                            backgroundColor: "red",
                            maxWidth: "500px",
                            maxHeight: "500px",
                            overflowX: "auto",
                            overflowY: "scroll",
                            whiteSpace: "nowrap"
                        },
                    general: {
                        color: color,
                        backgroundColor: bgColor,
                        display:"inline-block",
                        margin:"10px",
                        backgroundImage: `url(${move.imageURL})`,
                        backgroundSize: "150px 160px",
                        backgroundRepeat: "no-repeat",
                        borderRadius: "5px",
                        height:"120px",
                        width:"300px",
                        verticalAlign:"top"
                    },

                        title:
                            {
                            fontSize:"18px",
                            fontWeight:"bold",
                            display: "inline-block",
                            whiteSpace: "nowrap", /* forces text to single line */
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width:"240px",
                            maxWidth:"80%",
                                // "backgroundColor":"#6B6B6B" // Good idea ... maybe

                        },
                        img: {"height":"50px"},
                        submit: {"height":"30px", "cursor":"pointer"}
                    };

                    let submitButton = (divType === "smallAtom") ? null :
                        <img style={{...styles.submit, ...selectedTypeSubmitStyle}} src={ok} alt="Logo" />;

                    return <div
                        key={move.id}
                        style={
                            {...styles.general, ...selectedTypeStyle}
                        }>
                            <div style={{"padding":"10px 10px"}}>
                                <Info info={move.description} >
                                    <div style={{...styles.title, ...selectedTitleStyle}}>{move.name} </div>
                                    </Info>
                                <div style={{...labelStyle, ...selectedLabelStyle}}> {move.type} </div>
                                <img style={{...styles.img, ...selectedTypeImageStyle}}  src={image} alt="Logo" />
                                <label>
                                    {textArea}
                                </label>
                                <button style={{...buttonStyle, ...selectedTypeSubmitStyle}} onClick={(e)=>{this.handleSubmit(move, this.state.value[move.id], e)}}>
                                    {submitButton}
                                </button>

                                <br/>
                            </div>
                    </div>
                })];
            }

            const moveFilteredDiv = createMoveGeneralDivFromArray.call(this, movesList);
            const moveBioHackDiv = createMoveGeneralDivFromArray.call(this, bioHackMoves);
            const moveAllDiv = createMoveGeneralDivFromArray.call(this, movesAllList);

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
                <div> {moveFilteredDiv} </div>
            </div>;

            let whiteSpace = (true)? "nowrap" : "";

            let movesAll = <div> Day full list Here
                <div  style={{whiteSpace: whiteSpace, overflowX:"scroll", overflowY:"auto", width: "1000px", height: "300px"}}> {moveAllDiv} </div>
            </div>;

            let records = <div> Day view Here
                <div> Record Log of Moves </div>
                <div> {recordDiv} </div>
            </div>;


            let hiddenMoves = (this.state.hide["move"]) ? <div> Day (Hidden) </div> : moves;
            let hiddenAllMoves = (this.state.hide["moveAll"]) ? <div> Day (Hidden) </div> : movesAll;
            let hiddenRecord = (this.state.hide["record"]) ? <div> Hidden Record </div> : records;
            let btnStyle= {"height":"100px"};

            // Setting up and filtering aggregate data for charts
            let barData = [];
            let aggNames = [];
            this.state.aggregates.map((aggObj)=>{
                aggNames.push(aggObj.move.name + " [" + aggObj.move.recordType + "]");
                barData.push(aggObj.aggregateValue);
            });
            let recordTypeFilter = "Do";
            let aggNamesDo = this.state.aggregates.reduce(function(filtered, aggObj) {
                if (aggObj.move.recordType === recordTypeFilter) {
                    filtered.push(aggObj.move.name + " [" + aggObj.move.recordType + "]");
                }
                return filtered;
            }, []);
            let aggDataDo = this.state.aggregates.reduce(function(filtered, aggObj) {
                if (aggObj.move.recordType === recordTypeFilter) {
                    filtered.push(aggObj.aggregateValue);
                }
                return filtered;
            }, []);

            return <div>


                <AtomShell title={"BioHack".toUpperCase()} children={moveBioHackDiv} video={fireflyVideo}>
                </AtomShell>

                <HappyJarContainer></HappyJarContainer>
                <button style={btnStyle} onClick={()=>{this.handleHide("move")}}> HIDE MOVES </button>
                {hiddenMoves}

                <button style={btnStyle} onClick={()=>{this.handleHide("moveAll")}}> HIDE Master list of MOVES </button>
                <div> {hiddenAllMoves} </div>

                <button style={btnStyle} onClick={()=>{this.handleHide("record")}}> Hide Records</button>
                {hiddenRecord}

                <audio className="audio-element">
                    <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
                </audio>
                <BarGraph
                    moveNames={aggNamesDo}
                    data={aggDataDo}
                    aggregateType={this.state.aggregateFilterType + " " +  recordTypeFilter}

                ></BarGraph>


                <video
                    id="my-video"
                    className="video-js"
                    controls
                    preload="auto"
                    width="640"
                    height="264"
                    poster="MY_VIDEO_POSTER.jpg"
                    data-setup="{}"
                >
                    <source src="https://dsc.cloud/4a22b2/109.01_fakeid-01-23-22.mp4" type="video/mp4"/>
                    <p className="vjs-no-js">
                        To view this video please enable JavaScript, and consider upgrading to a
                        web browser that
                        <a href="https://videojs.com/html5-video-support/" target="_blank"
                        >supports HTML5 video</a
                        >
                    </p>
                </video>



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


// Constants
const weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

const Colors = {
    lightGreen : "#abdf86"
}

export default App;
