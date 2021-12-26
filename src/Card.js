import React from "react";
import eventImg from './event.png';
import sleepImg from './oura-ring.png';
import exerciseImg from './exercise.png';





class Card extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            tags: []
        };

    }
    componentDidMount(){
    }

    render() {
        let styles = {
            card: {
                border: "solid red 1px",
                backgroundColor: "#F7F7F7",
                color: "#265790",
                display: "flex",
                padding: "10px 10px"
                // height: "600px",
            },
            imgContainer: {
                // backgroundColor: "red",
                height: "100%"

            },
            atomImg: {
                // border: "solid red 1px",
                height: "20px",
                width: "30px"
            },
            infoTag: {
                marginLeft: "10px",
                marginRight: "10px"
            },
            personTag: {
                backgroundColor: "red",
                color: "white",
                height: "100%",
                marginLeft: "2px",
                borderRadius: "1px",
                fontSize: "12px"
            },
            statTag: {
                backgroundColor: "blue",
                color: "white",
                height: "100%",
                marginLeft: "2px",
                borderRadius: "1px",
                fontSize: "12px"
            },
            dateTag: {
                backgroundColor: "green",
                color: "white",
                height: "100%",
                marginLeft: "2px",
                borderRadius: "1px",
                fontSize: "12px"
            }

        };

        // TODO: if tags is fine
        let tagComponents = null;

        // TODO: Tags if you know
        // TODO: control flow check
        if (this.props.atom.tags != null){
            tagComponents = this.props.atom.tags.map(
                (tag) => {


                    let tagStyle;
                        // =styles.defaultTagStyle;
                    switch(tag.type){
                        case "person":
                            tagStyle = styles.personTag;
                            break;
                        case "stat":
                            tagStyle = styles.statTag;
                            break;
                        case "date":
                            tagStyle = styles.dateTag;
                            break;

                        default:
                            tagStyle = styles.personTag;
                            break;
                    }



                    return <div style={tagStyle}>
                        {tag.name}
                    </div>
                }
            );
        }


        let atomCode = "";
        if (this.props.atom.atomEventCode != null){
            atomCode = this.props.atom.atomEventCode.toUpperCase();
        }
        else if (this.props.atom.type != null){
            atomCode = this.props.atom.type.toUpperCase();
        }
            // (this.props.atom.atomCode != null) ? this.props.atomCode.toUpperCase():



        /* MediaType stuff*/
        let mediaView = (<div></div>);

        // TODO: Have it given and cached

        let imgByType = eventImg;
        let atom = this.props.atom;
        switch(atom.type) {
            case "workout":
                imgByType = exerciseImg;
                break;
                // code block
            case "sleep":
                imgByType = sleepImg;
                break;
            case "event":
                imgByType = eventImg;
                // code block
                break;
            case "asset":
                // TODO: switch case?
                if (atom.sub_type==="video"){
                    mediaView = (
                            <video
                                width="750" height="500" controls >
                                <source src={atom.url} type="video/mp4"/>
                            </video>
                        );
                }
            default:
                break;
        }

        return (
            <div style={styles.card}>
                <div style={styles.imgContainer}>
                    <img style={styles.atomImg} src={imgByType}/>
                </div>
                <div style={styles.infoTag}>
                    {atomCode}: &nbsp;
                {this.props.atom.name}
                    {mediaView}

                </div>
                    {tagComponents}
            </div>
        );
    }
}

export default Card;