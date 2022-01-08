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
                // backgroundColor: "red",
                position:"absolute",
                color: "grey",
                marginLeft: "50px",
                padding: "20px 20px",
                marginTop:"10px",
                zIndex: "9999",
                maxWidth:"200px",
                backgroundImage: `url(${eggshell})`
            }
        };

        let hiddenInfo = (!this.state.hide)?
            <div style={styles.child}>
                A shit ton of info lies here*
                A shit ton of info lies here*
                A shit ton of info lies here*
                A shit ton of info lies here*
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