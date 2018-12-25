import React from "react";

export default class CaptionInput extends React.Component {
  /**
   *
   * @param {{caption: string, inputType: string, inputHint: string, onChange: function}} props
   */
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.inputType === "checkbox") {
      this.inputRef.current.checked = !!this.props.value;
    }
    this.inputRef.current.value = this.props.value || "";
  }

  onChange() {
    if (this.props.onChange) {
      this.props.onChange(this);
    }
  }

  /**
   *
   * @returns {string|boolean}
   */
  get value() {
    if (this.props.inputType === "checkbox") {
      return this.inputRef.current.checked;
    }
    return this.inputRef.current.value;
  }

  render() {
    return (
      <div className={"input_block" + (this.props.className ? " " + this.props.className : "")} title={this.props.inputHint}>
        <div className="input_block--caption">{this.props.caption}</div>
        <input className={"input_block--" + (this.props.inputType || "input")}
               type={this.props.inputType}
               placeholder={this.props.inputHint}
               ref={this.inputRef}
               onChange={this.onChange.bind(this)}/>
      </div>
    );
  }
}