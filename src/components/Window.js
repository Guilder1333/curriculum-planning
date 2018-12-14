import React from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById("modal-root");

let zIndex = 1000;

export default class Window extends React.Component {
  constructor(props) {
    super(props);

    this.element = document.createElement("DIV");
    this.element.className = "window";
  }

  static addWindow(component) {

  }

  componentDidMount() {
    this.element.style.zIndex = (++zIndex).toString();
    modalRoot.appendChild(this.element);
  }

  componentWillUnmount() {
    --zIndex;
    modalRoot.removeChild(this.element);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.element
    )
  }
}