import React from 'react';

export default class ErrorPanel extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="error-panel">
        {'' + this.props.message}
      </div>
    );
  }
}