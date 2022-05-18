import React from 'react';

class HideItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: true,
    };
    this.hideSubmit = this.hideSubmit.bind(this);

  }

  componentDidMount() {
    console.log('mount Properties: ' + JSON.stringify(this.props));
  }

  hideSubmit() {
    this.setState(
        {
          hide: !this.state.hide
        }
    );
  }

  render() {
      let item = (!this.state.hide)? this.props.items : "";
      return (<div>
        <button onClick={this.hideSubmit}> *HIDE* </button>
        {item}

          </div>);
  }

}

export default HideItems;