import React from "react";

class AtomShell extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
        };

    }
    componentDidMount(){
    }


    render() {
        let styles = {
            bgStyle : {
                display: "inline-block",
                height:"auto",
                border: "2px solid #00063e",
                margin: "2px"
                // backgroundImage: `url(${blueRitualBG})`,
            },
            title:{
                "paddingLeft":"10px",
                "fontWeight": "bold"
            }
        }
        return (
            <div style={styles.bgStyle}>
                <div style={styles.title}> {this.props.title} </div>
                {this.props.children}
            </div>

        )
    }
}

export default AtomShell;