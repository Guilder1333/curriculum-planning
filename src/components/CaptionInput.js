import React from "react";

export default class CaptionInput extends React.Component {
  /**
   *
   * @param {{caption: string, inputType: string, inputHint: string}} props
   */
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  /**
   *
   * @returns {string|boolean}
   */
  get value() {
    return this.inputRef.value;
  }

  render() {
    return (
      <div className="input_block">
        <div className="input_block--caption">{this.props.caption}</div>
        <input className="input_block--input" type={this.props.inputType} placeholder={this.props.inputHint} ref={this.inputRef} />
      </div>
    );
  }
}