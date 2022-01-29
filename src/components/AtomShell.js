import React from "react";

import bioHackImg from '../assets/biohack.jpeg';

class AtomShell extends React.Component {
    constructor (props) {
        super(props);
        // Local storage for caching state of dashboard hide toggle
        let h = ((window.localStorage.getItem(this.props.title)) == null) ? {
            hidden: false
        } : (JSON.parse(window.localStorage.getItem(this.props.title)));

        this.state = {
            hidden: h
        }
    }
    componentDidMount(){
    }

    handleClick(){

        let newHide = ! this.state.hidden;
        window.localStorage.setItem(this.props.title, newHide);
        this.setState({hidden: newHide})
    }

    render() {
        let styles = {
            bgStyle : {
                padding: "30px",
                display: "inline-block",
                height:"auto",
                border: "2px solid #00063e",
                // width: "140px",
                margin: "2px",
                backgroundColor: "#213A28",
                overflow: "hidden",
                position: "relative"
            },
            title:{
                "paddingLeft":"10px",
                "fontWeight": "bold"
            },
            cover: {
                position: "absolute",
                top:"-160",
                left:"0",
                width:"170px",
                height:"100%",
                opacity:"80%",
                backgroundImage: `url(${bioHackImg})`,
                backgroundSize: "200px 400px",
                zIndex: "1"
            },
            videoContainer : {
                height: "300px",
                width: "300px",
                overflow: "hidden",
                position: "relative"
            },

            videoContainerVideo : {
                    minWidth: "100%",
                    minHeight: "100%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translateX(-50%) translateY(-50%)"
            },

                /* Just styling the content of the div, the *magic* in the previous rules */
            videoContainerCaption : {
                    zIndex: "1",
                    position: "relative",
                    textAlign: "center",
                    color: "black",
                    padding: "10px"
                }

        }
        let cover = (this.state.hidden) ? null : <div style={styles.cover}></div>;
        return (
            <div style={styles.bgStyle} onClick={()=>{this.handleClick();}}>
                <video style={styles.videoContainerVideo} autoPlay muted loop>
                    <source src={this.props.video}
                            type="video/mp4"/>
                </video>

                    <div style={styles.videoContainerCaption} >
                        <h2>{this.props.title}</h2>
                        <div style={styles.title}>  </div>
                        {this.props.children}
                    </div>

            </div>

        )
    }
}
// {cover} removed for now

export default AtomShell;