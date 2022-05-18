import React from 'react';

class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
    };
    this.handleChange = this.handleChange.bind(this);

  }

  componentDidMount() {
    console.log('mount Properties: ' + JSON.stringify(this.props));
    let formProperties = {};
    this.props.properties.forEach((p) => {
      formProperties[p] = "";
    });
    this.setState({
      values: formProperties,
    });
  }

  handleChange(event, property) {
    let origValues = this.state.values;
    // console.log(evnt.target + " " + "avalues");
    origValues[property] = event.target.value;
    this.setState({value: origValues });
  }

  render() {
    let formStyle = {
      width: '500px',
      height: '500px',
      backgroundColor: '#B5AAAA',
    };
    let inputList = this.props.properties.map((property) => {
      return (<div>
            <label>Name: {property} </label>
            <input
                type="text"
                value={this.state.values[property]}
                onChange={(e) => { this.handleChange(e, property); }}
            />);
          </div>
      );
    });
    let form = <form onSubmit={()=>{this.props.onSubmit(this.state.values, this.props.type)}}> {inputList} <input type="submit" value="Submit"/> </form>;

    return (
        <div style={formStyle}>
          <h3> { this.props.type } </h3>
          {form }
        </div>
    );
  }
}

export default FormContainer;