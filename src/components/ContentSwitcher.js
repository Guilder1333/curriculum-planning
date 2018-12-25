import React from "react";

export default class ContentSwitcher extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      keyValue: this.props.initialKey,
      transition: "transition",
      child: ContentSwitcher.findChild(this.props.initialKey, this.props),
      transitionChild: null
    };
    this.transitionEndHandler = this.transitionEndHandler.bind(this);
  }

  transitionEndHandler() {
    this.setState((state, props) => {
      if (!state.transitionChild) {
        return null;
      }
      return {
        transition: "transition",
        child: state.transitionChild,
        transitionChild: null,
      };
    });
  }

  componentDidMount() {
    //this.key = this.props.initialKey;
  }

  static findChild(key, props) {
    let children = React.Children.toArray(props.children);
    for(let i = 0; i < children.length; i++) {
      if (children[i].props.switchKey === key) {
        return children[i];
      }
    }
    return null;
  }

  set key(value) {
    this.setState((state, props) => {
      let child = ContentSwitcher.findChild(value, props);
      if (!child) {
        return;
      }

      if (state.child === null) {
        return {
          keyValue: value,
          child: child
        };
      } else if (props.transition) {
        return {
          keyValue: value,
          transitionChild: child,
          transition: "transition start"
        };
      }
    });

  }

  render() {
    return (
      <div className={"switcher" + (this.state.keyValue ? " selected-case-" + this.state.keyValue : "")}>
        <div className={this.state.transition} onTransitionEnd={this.transitionEndHandler}>
          {this.state.child}
          {this.state.transitionChild}
        </div>
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
      <div className={"switch-case" + (this.props.switchKey ? " " + this.props.switchKey : "")}>
        {this.props.children}
      </div>
    );
  }
}