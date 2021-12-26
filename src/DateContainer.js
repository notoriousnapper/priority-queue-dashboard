import React from "react";
import Card from './Card';

class DateContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            atomList: []
            // focusDate: "2021-09-11"
        };

    }
    componentDidMount(){

        let d1 = Date.parse(this.state.startDate);
        let d2 = Date.parse(this.state.endDate);
        if (d2 < d1) {
            alert ("Error! Starting date is later than end date!");
        }
        const proxyPortUrl = new URL("http://localhost:3010/atom");
        fetch(proxyPortUrl)
            .then(response => response.json())
            .then(data =>
            {
                if (data){
                    console.log("DATA!" + JSON.stringify(data, null, 4));
                    // TODO: Should be atoms

                    // data.filter
                    // // TODO: some values have NAN..
                    // data.filter(
                    //     (atom)=>{
                    //         let atomDate = Date.parse(atom.date);
                    //         if (atomDate){
                    //             console.log("date: " + atomDate + "vs. " + d1);
                    //         }
                    //         else {
                    //             if (atom.date){
                    //                 let simpleDate = atom.date.substring(0,10);
                    //                 console.log("Simple DATE: " + simpleDate);
                    //                 Date.parse(simpleDate);
                    //
                    //             }
                    //         }
                    //         return atomDate >= d1;
                    //     }
                    // );
                    this.setState({atomList: data});
                }
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
            }
        };

        let {atomList} = this.state;
        let CardList = [
            atomList.map(
            atom => {
                return (<Card atom={atom}/>);
            })
            ];
        return (
            <div style={styles.cardContainer}>
                Atoms
                <br/>
                {CardList}
            </div>
        );
    }
};

export default DateContainer;