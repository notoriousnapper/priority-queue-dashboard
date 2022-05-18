import React from 'react';
import eventImg from './assets/event.png';
import sleepImg from './assets/oura-ring.png';
import exerciseImg from './assets/exercise.png';
import jar from './assets/happy_jar.jpg';

class CuratedDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
    };
    this.handleChange = this.handleChange.bind(this);

  }

  componentDidMount() {
  }

  handleChange(event, property) {
  }

  render() {
    let styles = {
      thumbNailStyle: {
        height: "20px",
        weight: "20px",
        paddingRight: "5px"
      },
      fileItemStyle: {
        backgroundColor: "#EBEBEB",
        border: "white solid 1px",
        padding: "5px 10px"

      },
      tagStyle : {
        float: "right",
        backgroundColor: "#77C2A9",
        border: "white solid 1px",
        fontSize: "14px",
        padding: "4px 4px"
      }
    }
    let fileItems = this.props.fileItems.map((file)=>{
      let tags = null;
      if (file.tags != "" && file.tags != null) {
        tags = file.tags.split(",").map((tag)=>{
          return <span style={styles.tagStyle}> {tag} </span>;
        });
      }
      return <div style={styles.fileItemStyle}>
        <a href={file.fileURL}>
        <img style={styles.thumbNailStyle} src={file.thumbnailURL}/>
        </a>
        FILE! {file.name}
        {tags}
      </div>;});
    return (
        <div>
          {fileItems}
        </div>
    );
  }
}

export default CuratedDashboard;