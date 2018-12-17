import React from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById("modal-root");

let zIndex = 1000;

const isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

export default class Window extends React.Component {
  constructor(props) {
    super(props);

    if (props.modal) {
      this.modal = document.createElement("DIV");
      this.modal.className = "modal-curtain";
    } else {
      this.modal = null;
    }
    this.element = document.createElement("DIV");
    this.element.className = "window" + (props.className ? " " + props.className : "");
    Window.setStyle(this.element, props.style);
    if (props.id) {
      this.element.id = props.id;
    }
  }

  static setStyle(node, styles) {
    if (typeof styles === "string") {
      node.style.cssText = styles;
      return;
    }
    let style = node.style;
    for (let styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      let styleValue = Window.dangerousStyleValue(styleName, styles[styleName], false);
      if (styleName === 'float') {
        styleName = 'cssFloat';
      }
      style[styleName] = styleValue;
    }
  }

  static dangerousStyleValue(name, value) {
    if (value == null || typeof value === 'boolean' || value === '') {
      return '';
    }

    if (typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
      return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
    }

    return ('' + value).trim();
  }

  componentDidMount() {
    if (this.modal) {
      this.modal.style.zIndex = (++zIndex).toString();
      modalRoot.appendChild(this.modal);
    }
    this.element.style.zIndex = (++zIndex).toString();
    modalRoot.appendChild(this.element);
  }

  componentWillUnmount() {
    if (this.modal) {
      --zIndex;
    }
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