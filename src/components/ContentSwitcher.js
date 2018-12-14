import React from "react";

export default class ContentSwitcher extends React.Component {

  constructor(props) {
    super(props);

    this.child = null;
    this.transitionKey = null;
    this.renderedKey = null;
    this.state = {keyValue: props.initialKey, transition: props.transition ? "transition" : null};
    this.transitionEndHandler = this.transitionEndHandler.bind(this);
  }

  transitionEndHandler() {
    this.child = this.transitionKey;
    this.transitionKey = null;
    this.setState({
      transition: "transition"
    });
  }

  set key(value) {
    this.setState({
      keyValue: value
    });
  }

  componentDidUpdate() {
    if (this.transitionKey !== this.state.keyValue) {
      if (this.state.transition === "transition") {
        this.setState({
          transition: "transition start"
        });
      }
    }
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

    if (this.state.transition && this.transitionKey !== key) {
      this.transitionKey = key;
    }

    if (this.child != null && child !== null && this.transitionKey === key && this.state.transition) {
      return (
        <div className="switcher">
          <div className={this.state.transition} onTransitionEnd={this.transitionEndHandler}>
            {child}
            {this.child}
          </div>
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

export class SwitchCase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {style: ""};
  }

  get switchKey() {
    return this.props.switchKey;
  }

  set style(value) {
    this.setState({
      style: value
    });
  }

  render() {
    return (
      <div className="switch-case">
        {this.props.children}
      </div>
    );
  }
}