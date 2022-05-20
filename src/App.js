import './App.css';
import 'video.js/dist/video-js.css';


import React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import moment from 'moment';

import oura from './assets/oura-ring.png';
import stretch from './assets/stretch.png';
import release from './assets/release.png';
import ok from './assets/ok.png';
import flow from './assets/flow.png';
import exercise from './assets/exercise.png';
import techniqueOne from './assets/technique-1.png';
import guitarIcon from './assets/guitar.png';
import videoIcon from './assets/video-file.png';
import foamRollerImg from './assets/foam-roller.png';
import csImg from './assets/cs.png';

import fireflyVideo from './assets/fireflyVideo.mp4';
import carSunSetVideo from './assets/visual-car-sunset.mp4';

import ProgressBar from '@ramonak/react-progress-bar';
import HideItems from './HideItems';
import CardContainer from './CardContainer';
import HappyJarContainer from './HappyJarContainer';
import FormContainer from './FormContainer';
import CuratedDashboard from './CuratedDashboard';
import DateController from './DateController';
import DateSelectorController from './DateSelectorController';
import Info from './components/Info';
import BarGraph from './components/BarGraph';
import greenBorder from './assets/green-border.svg';
import AtomShell from './components/AtomShell';
import DropdownTagView from './components/DropdownTagView';
import Globals from './helper/Globals';


let BASE_URL_PROXY = 'http://localhost:8080'; // 9999 with proxyman
let sleepUrl= new URL(BASE_URL_PROXY + '/sleep');
const moveUrl= new URL(BASE_URL_PROXY + '/move');
const movePostUrl= new URL(BASE_URL_PROXY + '/move');
const moveRecordUrl = new URL(BASE_URL_PROXY + '/moverecords');
const moveAggregateUrl = new URL(BASE_URL_PROXY + '/aggregates');
const songListItemsUrl = new URL(BASE_URL_PROXY + '/listsong');
const listItemsUrl = new URL(BASE_URL_PROXY + '/list');
const formDataUrl = new URL(BASE_URL_PROXY + '/form');
const fileDataUrl = new URL(BASE_URL_PROXY + '/file');
const filePostURL = new URL(BASE_URL_PROXY + '/file');




class App extends React.Component {
  requiredFormProperties;
  constructor(props) {
    super(props);

    // Cached in local storage
    let hideSettings = ((window.localStorage.getItem('hide')) == null) ? {
      'move': false,
      'moveAll': true,
      'record': true,
    } : (JSON.parse(window.localStorage.getItem('hide')));


    this.state = {
      fileData:[],
      formDataList:[],
      listItems: [],
      dropDownValue: "relax",
      selectedDay: undefined,
      audio: null,
      songListItems: [],
      aggregates: [],
      aggregateFilterType: 'sum',
      totalReactPackages: null,
      sleepSummaryList: [],
      movesList: [],
      movesAllList: [],
      recordList: [],
      startDay: '2021-08-19',
      endDay: '2021-09-01',
      showHideTestPage: true, // For main other lifedash
      showHideByDatePage: false,
      isWeekViewOn: false,
      value: {
        // "30s"
      },
      hide: hideSettings,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
  }

  handleDropDownChange(event){
    this.setState({dropDownValue: event.target.value});
  }

  handleHide(key) {
    let hideObj = this.state.hide;
    hideObj[key] = !this.state.hide[key];
    window.localStorage.setItem('hide', JSON.stringify(hideObj));
    this.setState(hideObj);
  }

  handleChange(event, keyId) {
    let obj = this.state.value;
    obj[keyId] = event.target.value;
    this.setState({value: obj});
    console.log('Value' + JSON.stringify(obj));
  }

  handleDayClick(day, {selected}) {
    if (selected) {
      // Unselect the day if already selected
      this.setState({selectedDay: undefined});
      return;
    }
    this.setState({selectedDay: day});
  }

  handleRecordSubmit(move, recordValue) {
    let dateString = null;
    if (this.state.selectedDay != null){
      dateString = this.state.selectedDay.toLocaleDateString();
      console.log("selected day!" + dateString);
    } else {
      console.log("No selected day!" + dateString);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', movePostUrl.href, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      ...move,
      'recordValue': recordValue,
      'trueRecordDate': dateString
    }));
    this.state.audio.play();
  }
  handleFileSubmit(formData, formType) {
    var xhr = new XMLHttpRequest();
    if (formType === "FileItemForm"){
      xhr.open('POST', filePostURL.href, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        ...formData
      }));
      this.state.audio.play();
    } else if (formType === "ListItemForm"){
      xhr.open('POST', listItemsUrl.href, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        ...formData
      }));
      this.state.audio.play();
    }
  }

  componentDidMount() {
    this.state.audio = document.getElementsByClassName('audio-element')[0];
    fetch(moveUrl).then(response => response.json()).then(data => {
      if (data) {
        this.setState({movesAllList: data});
        // this.setState({testdiv: <div>Done testing</div>});
      }
      let obj = {};
      data.forEach((a) => {
        obj[a.id] = '';
      });
    });

    // Get moves with filter
    var params = {filter: 'PRIORITY', filterTwo: 'ATOM_SIZE_DESCENDING'};
    moveUrl.search = new URLSearchParams(params).toString();
    fetch(moveUrl).then(response => response.json()).then(data => {
      if (data) {
        console.log('getting moves: ');
        this.setState({movesList: data});
      }
    });

    fetch(moveRecordUrl).then(response => response.json()).then(data => {
      if (data) {
        this.setState({recordList: data});
      }
    });


    // Fetch Aggregates
    var aggregateParams = {
      idList: [],
      aggregateType: this.state.aggregateFilterType,
      showAllAggregates: true,
    };
    fetch(moveAggregateUrl,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(aggregateParams),
        }).then(response => response.json()).then(data => {
      if (data) {
        console.log('Aggregate Data ' + JSON.stringify(data));
        this.setState({aggregates: data});
      }
    });

    fetch(songListItemsUrl).then(response => response.json()).then(data => {
      if (data) {
        console.log('List Songs Data ' + JSON.stringify(data));
        this.setState({songListItems: data});
      }
    });


    // Calculate sleep for Monday of this week
    let startDate = moment().startOf('isoweek').format('YYYY-MM-DD');
    let endDate = moment().startOf('week').format('YYYY-MM-DD');
    let fullSleepUrl = sleepUrl + '?startDate=' + startDate + '&endDate=' + endDate;
    fetch(fullSleepUrl).then(response => response.json()).then(data => {
      if (data) {
        console.log('List Sleep Data ' + JSON.stringify(data.sleep));
        this.setState({sleepSummaryList: data.sleep});
      }
    });


    fetch(listItemsUrl).then(response => response.json()).then(data => {
      if (data) {
        this.setState({listItems: data});
      }
    });

    fetch(formDataUrl).then(response => response.json()).then(data => {
      console.log("form:" + JSON.stringify(data));
      if (data) {
        this.setState({formDataList: data});
      }
    });

    fetch(fileDataUrl).then(response => response.json()).then(data => {
      console.log("file:" + JSON.stringify(data));
      if (data) {
        this.setState({fileData: data});
      }
    });

    this.forceUpdate();

  }

  render() {
    let styles = {
      ul: {
        display: 'block',
      },
      li: {
        float: 'left',
        display: 'inline',
        border: 'thick double #32a1ce',
        textAlign: 'center',

      },
      year: {
        textAlign: 'center',
        fontSize: '15px',

      },
      oura: {
        width: '40px',
        height: '40px',
      },

    };

    const {sleepSummaryList, movesList, movesAllList, recordList, dropDownValue} = this.state; // Important line caused errors

    // Adding filtered groups by Tags
    let tags = Globals.COMMON_TAGS;
    let bioHackMoves = movesAllList.filter(
        moves => {
          if (moves.tags == null) {
          } else {
            console.log(
                'All the Tags: ' + JSON.stringify(moves.tags) + 'found:' +
                moves.tags.find((t) => t === 'biohack'));
            return moves.tags.find((t) => t === tags[0]) === tags[0];
          }
        });
    let taggedMoves = [];
    tags.forEach(t => {
      let filteredMoves = movesAllList.filter(
          moves => {
            if (moves.tags == null) {
            } else {
              return moves.tags.find((x) => x.trim() === t.trim()) === t.trim();
            }
          });
      taggedMoves.push(filteredMoves);
    });

    const sleepComponentsList = [
      sleepSummaryList.map(
          item => {
            const date = item.summary_date;
            const displayDate = convertDateStringToMonthDay(item.summary_date);
            const sleepDate = convertStringToDate(date);
            console.log('Conversion' + sleepDate);
            const dayOfWeek = weekday[sleepDate.getDay()];
            return <li style={styles.li} key={date}> {dayOfWeek}
              <br/> {displayDate}
              <br/> {} {truncateDuration(
                  (item.total / 60 / 60).toString())} hours </li>;
          },
      )];

    const sleepComponentsParent = () => {
      return <ul style={styles.ul}> {sleepComponentsList} </ul>;
    };

    console.log(sleepComponentsList);
    if (this.state.isWeekViewOn) {
      return (
          <div className="card text-center m-3">
            <img src={oura} style={styles.oura} alt="Logo"/>
            <h5 className="card-header">Powered by Oura Stealth Black Ring</h5>
            <div className="card-body">
              <div style={styles.year}> {new Date().getFullYear()} </div>
            </div>
            <div className="card-body">
            </div>

            <DateController/>
            <CardContainer/>

          </div>
      );
    } else {

      const createMoveGeneralDivFromArray = function(mList) {
        console.log(mList.length + " given length");
        if (mList.length === 0 || !mList) {
          return [];
        }
        return [
          mList.map(move => {
            let image = (move.type === 'Release') ? release :
                (move.type === 'Ritual') ? oura :
                    (move.type === 'Stretch') ? stretch :
                        (move.type === 'Flow') ? flow :
                            (move.type === 'Exercise' || move.type ===
                                'Strengthen') ? exercise :
                                (move.type === 'TechniqueRepeat') ?
                                    techniqueOne :
                                    oura
            ;

            /* MOVE DIV */
            let buttonStyle = {'float': 'right'};
            let labelStyle = {
              'paddingLeft': '15px',
              'fontWeight': 'light',
              'fontSize': '12px',
              'padding': '2px 10px 2px 7px',
              'marginRight': '10px',
              'width': 'fit-content',
              'backgroundColor': '#5e5e5e',
              'color': 'black',
            };
            let textArea = (move.recordType !== 'Do') ?
                <textarea style={{'width': '50%'}}
                          value={this.state.value[move.id]}
                          onChange={(e) => {
                            this.handleChange(e, move.id);
                          }}/>
                :
                null;

            let divType = ''; // type: [smallAtom, mediumAtom, bigAtom, listAtom]...
            // Needs to be here before styles
            let customStyles = {

              mediumTileGeneral: {
                backgroundImage: `url(${greenBorder})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'left',
                width: '410px',
                cursor: 'pointer',
              },
              mediumTileLabel: {
                backgroundColor: '#05004F',
                fontWeight: 'bold',
                fontStyle: 'italic',
                paddingLeft: '10px',
              },
              mediumTileTitle: {
                font: '10px',
                paddingLeft: '10px',
                textAlign: 'center',
              },
              mediumTileImage: {
                marginTop: '9px',
                height: '40px',
                marginLeft: '10px',
              },

              smallTileGeneral: {
                'opacity': '80%',
                'width': '140px',
              },
              smallTileTitle: {
                // "width": "140px"
                fontSize: '13px',
              },
              smallTileLabel: {
                backgroundColor: '#05004F',
                fontWeight: 'bold',
                fontStyle: 'italic',
                paddingLeft: '10px',
                fontSize: '10px',
              },
              smallTileImage: {
                height: '30px',
              },
              smallTileSubmit: {
                height: '30px',
                width: '30px',
                backgroundColor: '#33F894',
                border: '15px #abdf86',
                cursor: 'pointer',
              },
            };
            let color = 'white';
            let bgColor = 'grey';
            let selectedTypeStyle = {}, selectedTypeImageStyle = {},
                selectedTypeSubmitStyle = {},
                selectedLabelStyle, selectedTitleStyle = {};
            switch (move.type) {
              case 'MultiSelect':
                bgColor = Colors.lightBlue;
              case 'Ritual':
                divType = 'mediumAtom';
                break;
              case 'Flow':
                break;
              case 'Workout':
                bgColor = Colors.lightGreen;
                color = 'black';
                break;
              case 'Affirmation':
                bgColor = '#efcd02';
                color = 'black'; // TODO: clean *this*
                divType = 'smallAtom';
                break;
              default:
                // selectedTypeStyle = customStyles.smallTileGeneral;
                // break;
                // code block
            }
            // TODO: Primary* tag first?, have separate PRIMARYTAG column?
            switch (move.tags[0]) {
              case 'biohack':
                bgColor = 'white';
                color = 'black'; // TODO: clean *this*
                divType = 'smallAtom';
                break;
              case 'relax':
                bgColor = 'white';
                color = 'black'; // TODO: clean *this*
                divType = 'smallAtom';
                break;
              default:
            }
            switch (divType) {
              case 'smallAtom':
                selectedTypeSubmitStyle = customStyles.smallTileSubmit;
                selectedTypeImageStyle = customStyles.smallTileImage;
                selectedTypeStyle = customStyles.smallTileGeneral;
                selectedTitleStyle = customStyles.smallTileTitle;
                selectedLabelStyle = customStyles.smallTileLabel;
                break;
              case 'mediumAtom':
                // selectedTypeSubmitStyle= customStyles.mediumTileSubmit;
                selectedTypeImageStyle = customStyles.mediumTileImage;
                selectedTypeStyle = customStyles.mediumTileGeneral;
                selectedLabelStyle = customStyles.mediumTileLabel;
                selectedTitleStyle = customStyles.mediumTileTitle;
                break;
              case 'bigAtom':
                break;
              default:
                break;
            }
            // (move.type === "Workout") ? : "grey";
            let styles = {
              overflow: {
                backgroundColor: 'red',
                maxWidth: '500px',
                maxHeight: '500px',
                overflowX: 'auto',
                overflowY: 'scroll',
                whiteSpace: 'nowrap',
              },
              general: {
                color: color,
                backgroundColor: bgColor,
                display: 'inline-block',
                margin: '10px',
                backgroundImage: `url(${move.imageURL})`,
                backgroundSize: '150px 160px',
                backgroundRepeat: 'no-repeat',
                borderRadius: '5px',
                height: '120px',
                width: '300px',
                verticalAlign: 'top',
              },

              title:
                  {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    whiteSpace: 'nowrap', /* forces text to single line */
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '240px',
                    maxWidth: '80%',
                    // "backgroundColor":"#6B6B6B" // Good idea ... maybe

                  },
              img: {'height': '50px'},
              submit: {'height': '30px', 'cursor': 'pointer'},
            };

            let submitButton = (divType === 'smallAtom') ? null :
                <img style={{...styles.submit, ...selectedTypeSubmitStyle}}
                     src={ok} alt="Logo"/>;

            return
            <div>
              {this.state.testDiv}
              <div
                key={move.id}
                style={
                  {...styles.general, ...selectedTypeStyle}
                }>
              <div style={{'padding': '10px 10px'}}>
                <Info info={move.name.charAt(0).toUpperCase() + move.name.slice(1) + ':  ' + move.description}>
                  <div
                      style={{...styles.title, ...selectedTitleStyle}}>{move.name} </div>
                </Info>
                <div
                    style={{...labelStyle, ...selectedLabelStyle}}> {move.type} </div>
                <img style={{...styles.img, ...selectedTypeImageStyle}}
                     src={image} alt="Logo"/>
                <label>
                  {textArea}
                </label>
                { (move.multiSelect != "") ? <div>
                  <select value={'a'} onChange={()=>{console.log("test");}}>
                    {this.state.listItems.filter((listItem)=> {
                      return listItem.type == "CS_ALG_DATA_STRUCTURE_PROBLEM"
                    }).map((option) => (
                          <option value={option.name}>{option.name}</option>
                      ))
                    }}
                  </select>
                </div> : <div></div> }
                <button style={{...buttonStyle, ...selectedTypeSubmitStyle}}
                        onClick={(e) => {
                          this.handleRecordSubmit(move, this.state.value[move.id], e);
                        }}>
                  {submitButton}
                </button>

                <br/>
              </div>
            </div>;
            </div>
          })];
      };

      console.log("creating parent divs");
      const moveFilteredDiv = createMoveGeneralDivFromArray.call(this,
          movesList);
      const moveBioHackDiv = createMoveGeneralDivFromArray.call(this,
          bioHackMoves);
      const moveAllDiv = createMoveGeneralDivFromArray.call(this, movesAllList);

      let taggedDivs = [];
      let taggedDivMap = {};
      // let dropDownTaggedDiv = [];
      let tagToVideoMapping = {
        "biohack" : fireflyVideo,
        "relax" : carSunSetVideo
      };
      /* Filling in the taggedDivs */
      for (var i = 0; i < taggedMoves.length; i++) {
        let d = createMoveGeneralDivFromArray.call(this, taggedMoves[i]);
        // taggedDivs.push(d);
        let atomShell = <AtomShell title={tags[i].toUpperCase()} children={d}
                                   video={tagToVideoMapping[tags[i]]}>
        </AtomShell>;
        // taggedDivs.push(atomShell);
        taggedDivMap[tags[i]] = atomShell;
        // if (dropDownValue == tags[i]){
        //   dropDownTaggedDiv.push(atomShell);
        // }
      }

      /* Filter specific Div */


      let spanStyle = {'backgroundColor': 'black', 'width': '390px'};
      const recordDiv = [
        recordList.map(move => {
          return <div
              style={{
                'color': 'white',
                'backgroundColor': 'grey',
                'display': 'inline-block',
                'padding:': '10px 20px',
                'margin': '10px',
                'width': '100%',
              }}>

            <div>
              <span style={spanStyle}> {move.move.name.toUpperCase()}
                <em>--</em></span>
              {move.recordValue} <em>--</em>
              {move.trueRecordDate} <em>--</em>
            </div>
            <br/>
          </div>;
        })];

      let moves = <div> Day view Here
        <div> {moveFilteredDiv} </div>
      </div>;

      let whiteSpace = (true) ? 'nowrap' : '';

      let movesAll = <div> Day full list Here
        <div style={{
          whiteSpace: whiteSpace,
          overflowX: 'scroll',
          overflowY: 'auto',
          width: '1000px',
          height: '300px',
        }}> {moveAllDiv} </div>
      </div>;

      let records = <div> Day view Here
        <div> Record Log of Moves </div>
        <div> {recordDiv} </div>
      </div>;

      let hiddenMoves = (this.state.hide['move']) ?
          <div> Day (Hidden) </div> :
          moves;
      let hiddenAllMoves = (this.state.hide['moveAll']) ?
          <div> Day (Hidden) </div> :
          movesAll;
      let hiddenRecord = (this.state.hide['record']) ?
          <div> Hidden Record </div> :
          records;
      let btnStyle = {'height': '100px'};

      // Setting up and filtering aggregate data for charts
      let barData = [];
      let aggNames = [];
      this.state.aggregates.map((aggObj) => {
        aggNames.push(aggObj.move.name + ' [' + aggObj.move.recordType + ']');
        barData.push(aggObj.aggregateValue);
      });
      let recordTypeFilterDo = 'Do';


      // Aggregate Data
      let aggNamesDo = this.state.aggregates.reduce(function(filtered, aggObj) {
        if (aggObj.move.recordType === recordTypeFilterDo) {
          filtered.push(aggObj.move.name + ' [' + aggObj.move.recordType + ']');
        }
        return filtered;
      }, []);
      let aggDataDo = this.state.aggregates.reduce(function(filtered, aggObj) {
        if (aggObj.move.recordType === recordTypeFilterDo) {
          filtered.push(aggObj.aggregateValue);
        }
        return filtered;
      }, []);

      let aggNamesAll = this.state.aggregates.reduce(function(filtered, aggObj) {
          filtered.push(aggObj.move.name + ' [' + aggObj.move.recordType + ']');
        return filtered;
      }, []);
      let aggDataAll = this.state.aggregates.reduce(function(filtered, aggObj) {
          filtered.push(aggObj.aggregateValue);
        return filtered;
      }, []);




      // Duration - count / goal count
      // Rule: 3 water cups [conditional: before 12pm], [conditional: count == 1]
      // Rule: Cold/ hot tea [conditional: before 12pm, [conditional: count == 1]]
      // Rule: 1 Walk for Sunlight & Air

      // If today is not Monday, get all dates of this week*
      var currentDate = moment();
      var weekStart = currentDate.clone().startOf('isoWeek');
      var weekEnd = currentDate.clone().endOf('isoWeek');
      var days = [];
      for (var i = 0; i <= 6; i++) {
        let d = moment(weekStart).add(i, 'days').toDate();
        days.push(d);
        console.log('Days of this week' +
            moment(weekStart).add(i, 'days').format('MMMM Do,dddd'));
        // .toDate());
        // .format('MMMM Do,dddd'));
      }

      return <div>
        <br/>
        <DayPicker
            onDayClick={this.handleDayClick}
            selectedDays={this.state.selectedDay}
        />
        {this.state.selectedDay ? (
            <p>You clicked {this.state.selectedDay.toLocaleDateString()}</p>
        ) : (
            <p>Please select a day.</p>
        )}
        <br/>


        <div style={{width: '50%'}}>
          <ProgressBar completed={60}/>
          <br/>
          <ProgressBar style={{'color': 'green'}} completed={40}/>
        </div>

        <br/>



       <DropdownTagView
           label={"Tags"}
           options={tags}
           value={dropDownValue}
           onChange={this.handleDropDownChange}
           selectedTagMoves={taggedDivMap[dropDownValue]}
       />

        <CuratedDashboard fileItems={this.state.fileData} />

        { this.state.formDataList.map(formData => {
          return <FormContainer
                                type={formData.formDataTitle}
                                properties={[...formData.requiredFormProperties, ...formData.extraFormProperties]}
                                onSubmit={this.handleFileSubmit}/>
        })

        }
        {/*<FormContainer type={"listItem"} properties={{"a":1,"b":2,"c":3}}/>*/}
        <HappyJarContainer></HappyJarContainer>
        Jesse's Forever Collection of Songs He loves and performs
        {
          this.state.songListItems.map((songListItem)=>{
            return <div>
              <img style={{width:"30px",height:"30px"}} src={guitarIcon}/>
              <span> Song: {songListItem.name}  </span>
              <span> Author: {songListItem.author}  </span>
              <span> Ideas and Practice Links:
                {(songListItem.artifacts !== null) ? songListItem.artifacts.split(',').map((artifactLink)=>{
                  return <div style={{display: "inline-block"}}> <a href={artifactLink}> <img style={{width:"30px",height:"30px"}} src={videoIcon}/> </a>
                    {/*<div style={{fontSize: "8px"}}> {artifactLink.split(".")[1].split("/")[2].slice(0,15)} </div>*/}
                  </div>;
                }) : null}
                </span>
              </div>
          })
        }

        Jesse's List Items
        {
          this.state.listItems.map((listItem)=>{

            let imgIcon = (listItem.type == "CS_ALG_DATA_STRUCTURE_PROBLEM") ?
                csImg :  (listItem.type == "PHYSICAL_ACTIONS") ? foamRollerImg : foamRollerImg;
            return <div>
              <img style={{width:"30px",height:"30px"}} src={imgIcon}/>
              <span style={{backgroundColor: "green", color: "white"}}> {listItem.type}  </span>
              <span> {listItem.name}  </span>
              <span style={{backgroundColor: "red", color: "white", fontSize: "11px"}}> {listItem.tags}  </span>
              <HideItems items={listItem.description}/>
            </div>
          })
        }


        <button style={btnStyle} onClick={() => {
          this.handleHide('move');
        }}> HIDE MOVES
        </button>
        {hiddenMoves}

        <button style={btnStyle} onClick={() => {
          this.handleHide('moveAll');
        }}> HIDE Master list of MOVES
        </button>
        <div> {hiddenAllMoves} </div>

        <button style={btnStyle} onClick={() => {
          this.handleHide('record');
        }}> Hide Records
        </button>
        {hiddenRecord}

        <audio className="audio-element">
          <source
              src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
        </audio>
        <BarGraph
            moveNames={aggNamesDo}
            data={aggDataDo}
            aggregateType={this.state.aggregateFilterType + ' ' +
            recordTypeFilterDo}
        ></BarGraph>

        <BarGraph
            moveNames={aggNamesAll}
            data={aggDataAll}
            aggregateType={this.state.aggregateFilterType + ' ' + "All"}
        ></BarGraph>

        <div>
          💎 Things to look forward too <br/>
          1. Hawaii Trip w/ Friends. Just art, healing, strength, in a good time to bring friends. <br/>
          2. Future Races <br/>
          3. Inktober 2022 with friends close by <br/>
        </div>
        <DateSelectorController
            moveRecords={recordList}
            sleepRecords={sleepSummaryList}
            dates={days}
            events={{
              'workouts': '🩸',
              'events': '🥏',
              'artifacts': '💎',
            }}
        />
      </div>;
    }

  }
}

// TODO: Important
// sleepComponentsParent()
{/*<WorkoutContainer/>*/
}

const convertDateStringToMonthDay = function(dateString) {

  let dateParts = dateString.split('-'); // TODO: implementation specific to oura, change to handle multiple or use Moment.js
  let newDateString = dateParts[1] + '-' + dateParts[2];
  return newDateString;
};
const convertStringToDate = function(dateString) {

  let dateParts = dateString.split('-'); // TODO: implementation specific to oura, change to handle multiple or use Moment.js
  let myDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // month starts from 0, January
  return myDate;
};

// TODO: Make better, will error out if number is less than 4 characters?
const truncateDuration = function(durationString) {
  return durationString.substring(0, 3);
};

// Constants
const weekday = new Array(7);
weekday[0] = 'Sunday';
weekday[1] = 'Monday';
weekday[2] = 'Tuesday';
weekday[3] = 'Wednesday';
weekday[4] = 'Thursday';
weekday[5] = 'Friday';
weekday[6] = 'Saturday';

const Colors = {
  lightGreen: '#abdf86',
  lightBlue: '#B7F2DE',
};

export default App;
