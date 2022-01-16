import React from "react";

import eggshell from "../assets/eggshell-texture.png"
import arrow from "../assets/arrow-down.png"


class Info extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            hide: true,
            info: this.props.info
        };

    }
    componentDidMount(){
    }
    reveal(){
        this.setState(
            {
                hide: false
            });
    }
    hide(){
        this.setState(
            {
                hide: true
            });
    }

    render() {
        let styles = {
            img: {
                width: "10px",
                height: "10px",
                display: "inline-block",
                verticalAlign:"top"

            },
            info : {
                cursor:"pointer",
                // float: "right"

            },
            child: {
                backgroundColor: "#F0F0F0",
                position:"absolute",
                color: "grey",
                marginLeft: "0px",
                padding: "20px 20px",
                marginTop:"100px",
                zIndex: "9999",
                maxWidth:"500px", // Whatever the parent card is
                // backgroundImage: `url(${eggshell})`
            },
            dot: {
                verticalAlign:"top",
                height: "12px",
                width: "12px",
                backgroundColor: "#B7BDB3", // "#ABDF86", // light-green
                borderRadius: "50%",
                display: "inline-block"
            }
        };

        let hiddenInfo = (!this.state.hide && null !== this.state.info && this.state.info !== "")?
            <div style={styles.child}>
                {this.state.info}
            </div>
            :
            <div></div>;

            let indicatorDotDiv = (null === this.state.info || this.state.info === "")
                ? null : <span style={styles.dot}></span>;
        return (
            <div style={styles.info}
                 onMouseEnter={() => this.reveal()}
                 onMouseLeave={() => this.hide()}
            >
                    {this.props.children}
                {indicatorDotDiv}
                {hiddenInfo}
            </div>
        );
    }
}

export default Info;