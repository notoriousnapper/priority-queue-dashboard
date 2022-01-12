import React from "react";

import eggshell from "../eggshell-texture.png"
import arrow from "../arrow-down.png"




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
        // alert("hello");
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
                width: "20px",
                height: "20px",

            },
            info : {
                cursor:"pointer",
                float: "right"

            },
            child: {
                backgroundColor: "#F0F0F0",
                position:"absolute",
                color: "grey",
                marginLeft: "-200px",
                padding: "20px 20px",
                marginTop:"10px",
                zIndex: "9999",
                maxWidth:"500px", // Whatever the parent card is
                // backgroundImage: `url(${eggshell})`
            }
        };

        let hiddenInfo = (!this.state.hide)?
            <div style={styles.child}>
                {this.state.info}
            </div>
            :
            <div></div>;

        return (
            <div style={styles.info}
                 onMouseEnter={() => this.reveal()}
                 onMouseLeave={() => this.hide()}
            >
                <img style={styles.img} src={arrow}/>
                {hiddenInfo}
            </div>
        );
    }
}

export default Info;