import React from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


class BarGraph extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
        };

    }
    componentDidMount(){
    }

    render() {

        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: "Jesse\'s Lifepad Stats 2022+",
                },
            },
        };



        const labels =  this.props.moveNames;//
        const data = {
            labels,
            datasets: [
                {
                    label: "Cumulative Historical Aggregates: " + this.props.aggregateType.toUpperCase(),
                    data: this.props.data,
                    backgroundColor: "#abdf86",
                }
            ],
        };

        return (
            <Bar style={{maxWidth:"400px", maxHeight:"400px", border: "5px solid #abdf86", margin: "10px"}} options={options} data={data} />

        )
    }
}

export default BarGraph;