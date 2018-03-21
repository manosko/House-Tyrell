import React from 'react';
import Alert from 'react-s-alert';

export default class Pinpad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pinpadOptions: [],
    };
  }

  componentDidMount() {
    // TODO: change this to instantiate based on options: pin, cash, [other?]
    this.setState({ pinpadOptions: this.props.pinpadOptions });
  }

  render() {
    return (
      <div id="pinpad" className="wrapper noselect" className={this.props.animation}>
        {this.state.pinpadOptions.map(option =>
          <div className="pinpad" onClick={() => this.props.handlePin(option)}>
            {option}
          </div>
        )}
      </div>
    )
  }
}
