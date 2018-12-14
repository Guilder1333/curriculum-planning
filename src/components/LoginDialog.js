import React from 'react';
import CaptionInput from './CaptionInput.js';
import ContentSwitcher, {SwitchCase} from "./ContentSwitcher";
import ContentPanel from "./ContentPanel";

export default class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.buttonNext = React.createRef();
    this.buttonPrev = React.createRef();
    this.nextClick = this.nextClick.bind(this);
    this.state = {keyValue: "email"};
    this.switcherRef = React.createRef();
  }

  nextClick() {
    // this.switcherRef.setState({
    //   keyValue: "password"
    // });
    this.switcherRef.current.key = "password";
  }

  render() {
    return (
      <div className="login_form">
        <div className="login_form--head">
          <img src="../../public/coffee-desk-laptop-notebook.jpg" className="login_form--head--background"/>
          <div className="login_form--head--caption">Вход или Регистрация</div>
        </div>
        <ContentSwitcher ref={this.switcherRef} initialKey={this.state.keyValue} transition={true}>
          <SwitchCase switchKey="email">
            <CaptionInput caption="E-Mail" inputType="text" inputHint="Введите свой E-Mail" />
          </SwitchCase>
          <SwitchCase switchKey="password">
            <ContentPanel />
          </SwitchCase>
        </ContentSwitcher>

        <div className="login_form--nav">
          <button className="login_form--prev invisible" ref={this.buttonNext}>Назад</button>
          <button className="login_form--next" ref={this.buttonPrev} onClick={this.nextClick}>Далее</button>
        </div>
      </div>);
  }
}