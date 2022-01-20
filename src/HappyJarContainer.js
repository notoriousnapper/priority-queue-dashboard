import React from "react";
import eventImg from './assets/event.png';
import sleepImg from './assets/oura-ring.png';
import exerciseImg from './assets/exercise.png';
import jar from './assets/happy_jar.jpg';





class HappyJarContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            tags: []
        };

    }
    componentDidMount(){
    }
    revealHappiness(){
        var sum = 3;
        var rand = Math.floor(Math.random()) % sum;
        var happyLines = [
            "✨ Planning for future get-togethers with friends!\nDance and food and music! ✨",
            "✨ Watching Resident Evil 8 with brother",
            "✨ Having someone hold my hand when I'm sick, food poisoning or otherwise. Think 2021"
        ]
        alert(happyLines[rand]);
    }

    render() {
        let styles = {
            img: {
                width: "100px",
                height: "auto",
                cursor: "pointer"
            }
        };

        return (
            <div >
                <img onClick={this.revealHappiness} style={styles.img} src={jar}></img>
            </div>
        );
    }
}

export default HappyJarContainer;