import React from "react";
import Card from './Card';
import video from './assets/acl_fest-10-11-21.mp4'



// TODO: Can have local too? maybe
class CardContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            atomList: [],
            startDate: "2021-09-11", // TODO: Doesn't currently work
            endDate: "2021-10-12",
            dateObjArray: []
        };

    }
    componentDidMount(){




        let d1 = Date.parse(this.state.startDate);
        let d2 = Date.parse(this.state.endDate);
        if (d2 < d1) {
            alert ("Error! Starting date is later than end date!");
        }
        // TODO: should just be atoms and collect
        // TODO: Make them json arguments as request param/ best practicec
        const proxyPortUrl = new URL("http://localhost:3010/atom");
        let dateSliceArray = {};

        fetch(proxyPortUrl)
            .then(response => response.json())
            .then(data =>
            {
                if (data){
                    console.log("DATA!" + JSON.stringify(data, null, 4));
                    this.setState({atomList: data});

                    /*
                     * Algorithm:
                     * Given an array of dates,
                     * for each date
                     * extract array of elements from atomList date
                     * Create array sequence based on it
                     */
                    let dateSelection = [
                        "2021-09-01",
                        "2021-09-02",
                        "2021-09-04",
                        "2021-09-14",
                        "2021-09-15",
                        "2021-10-12"
                    ];
                    dateSelection.map(
                        (dateSlice)=>{
                            dateSliceArray[dateSlice] = [];
                            console.log("slice: " + dateSlice + " and " + dateSliceArray[dateSlice]);
                            data.forEach(
                                (atom)=>{
                                    switch(atom.type){
                                        case "sleep":
                                            if (atom.summary_date){
                                                if (dateSlice === atom.summary_date){
                                                    dateSliceArray[dateSlice].push(atom);
                                                }
                                            }
                                            break;
                                        case "workout":
                                            if (atom.date) {
                                                if (dateSlice === atom.date) {
                                                    dateSliceArray[dateSlice].push(atom);
                                                }
                                            }
                                        case "event":
                                            if (atom.date){
                                                if (dateSlice === atom.date){
                                                    dateSliceArray[dateSlice].push(atom);
                                                }
                                            }
                                        case "asset":
                                            if (atom.date){
                                                if (dateSlice === atom.date){
                                                    dateSliceArray[dateSlice].push(atom);
                                                }
                                            }
                                    }
                                }
                            )

                        }
                    );

                    this.setState({dateObjArray: dateSliceArray});
                }
                console.log("Date Slice: " + JSON.stringify(dateSliceArray, null, 4));

            })
            .catch(error=>{
                console.log("Unable to get proxyPortUrl: " + proxyPortUrl);
            })
        ;
    }

    render() {
        let styles = {
            cardContainer: {
                backgroundColor: "#F7F7F7",
                flexWrap: "wrap"
            },
            dateSliceContainer: {
                backgroundColor: "#F7F7F7",
                display: "flex",
                flexDirection: "row"
                // flexWrap: "wrap",
            }
        };

        let {atomList, dateObjArray } = this.state;
        let CardList = [
            atomList.map(
            atom => {
                return (<Card atom={atom}/>);
            })
            ];
        console.log("dateObjArray: " + JSON.stringify(this.state.dateObjArray));

        let dateSliceDiv = [];
        for (let key in dateObjArray){
            let slice = dateObjArray[key];


            if (slice.length == 0){continue;}

            let innerChild = [];
            slice.forEach(
                (atom)=>{
                    innerChild.push(
                        <Card atom={atom}/>
                    );
                });

            dateSliceDiv.push(
                <div>
                    <br/>
                    Date: {key}
                    {innerChild}
                </div>
            );
            };



        console.log("Date Slice Div #2 " + JSON.stringify(dateObjArray, null, 4));

        return (
            <div style={styles.cardContainer}>
                Atoms
                <br/>


                {/*{CardList} TODO: this is for show*/}
                <div style={styles.dateSliceContainer}> {dateSliceDiv} </div>
            </div>
        );
    }
};

export default CardContainer;