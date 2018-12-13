import React from "react";

export default class ContentSwitcher extends React.Component {

  constructor(props) {
    super(props);

    this.child = null;
    this.state = {keyValue: props.initialKey};
  }

  set key(value) {
    this.setState({
      keyValue: value
    });
  }

  render() {
    const key = this.state.keyValue;
    let children = React.Children.toArray(this.props.children);
    let child = null;
    for(let i = 0; i < children.length; i++) {
      if (children[i].props.switchKey === key) {
        child = children[i];
        break;
      }
    }

    if (this.props.transition) {
      setInterval(() => {}, this.props.transition);
      return (
        <div className="switcher transition">
          {child}
          {this.child}
        </div>
      );
    }

    this.child = child;
    return (
      <div className="switcher">
        {child}
      </div>
    )
  }
}