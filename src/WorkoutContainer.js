import React from "react";


const proxyPortUrl = new URL("http://localhost:3010/workout"); // Proxy URL

class WorkoutContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            workoutSummaryList: []
        };

    }
    componentDidMount(){

        console.log("Where is the data ");
        fetch(proxyPortUrl)
            .then(response => response.json())
            .then(data =>
            {

                console.log("Where is the data " + JSON.stringify(data, null, 4));
                if (data.workouts){
                    console.log("Where is the data " + JSON.stringify(data, null, 4));
                    this.setState({workoutSummaryList: data.workouts});
                }
            })
    }

    render() {


        // TODO: Move to one file
        let styles = {
            ul: {
                display: "block"
            },
            workoutBox: {
                backgroundColor: "red",
                height: "100px",
                width: "200px",
                padding: "10px 30px",
                border: "10px solid black"
            },
            workoutBoxTitle: {
                fontSize: "20px",
                fontWeight: "bold"
            },
            workoutContainer: {
                padding: "10px 10px",
                paddingTop: "30px"
            }
        };

        const {workoutSummaryList} = this.state; // Important line caused errors
        const workoutComponentsList = [
            workoutSummaryList.map(
                item => {

                    // Consider destructure
                    const name = item.name;
                    const date = item.date;
                    const duration = item.duration;

                    const workoutDate = convertStringToDate(date);
                    console.log("Conversion" + workoutDate);
                    return <li style={styles.workoutBox} key={date}>
                        <div style={styles.workoutBoxTitle}> name: { name } </div>
                        <br/>
                        duration: {duration}
                    </li>
                }
            )];

        const workoutComponentsParent = () => {
            return <ul style={styles.ul}> {workoutComponentsList} </ul>
        };

        return (
            <div style={styles.workoutContainer}>
                <br/>
                <br/>
                <br/>
                There be workout items here
                {
                    workoutComponentsParent()
                }


            </div>
        );
    }
};

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

export default WorkoutContainer;