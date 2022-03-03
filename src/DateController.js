import React from "react";
import DateContainer from './DateContainer';

class DateController extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            atomList: []
        };

    }
    componentDidMount(){

    }


    render() {

        // let startDate = Date.this.props.starteDate
      return (<div>
            Container For Date
        </div>);
    }
};

export default DateController;