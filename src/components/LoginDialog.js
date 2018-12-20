import React from 'react';
import CaptionInput from './CaptionInput.js';
import ContentSwitcher, {SwitchCase} from "./ContentSwitcher";
import ContentPanel from "./ContentPanel";
import axios from 'axios';
import WaitPanel from "./WaitPanel";
import ErrorPanel from "./ErrorPanel";
import Window from "./Window";

export default class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.buttonNext = React.createRef();
    this.buttonPrev = React.createRef();
    this.nextClick = this.nextClick.bind(this);
    this.state = {keyValue: "auth", error: null};
    this.switcherRef = React.createRef();
    this.emailRef = React.createRef();
  }

  nextClick() {
    axios.get("/api/auth", {
      params: {
        email: this.emailRef.current.value
      }
    }).then((r) => {
      const data = r.data;
      if (data.status === "mailInvalid") {
        this.setState({error: "Email имеет некорректный формат."});
        this.switcherRef.current.key = "auth";
      } else if (data.status === "ok") {
        if (data.login) {
          if (data.password) {
            this.switcherRef.current.key = "pass";
          } else {
            this.switcherRef.current.key = "pass_email";
          }
        } else {
          this.switcherRef.current.key = "register";
        }
      } else {
        this.setState({error: "Что-то пошло не так, попробуйте еще раз."});
        this.switcherRef.current.key = "auth";
      }
    }).catch(function (e) {
      console.error(e);
    });
    this.switcherRef.current.key = "wait";
  }

  render() {
    let errorWindow = null;
    if (this.state.error) {
      errorWindow = (<Window className="error-window" modal={true}>
        <ErrorPanel message={this.state.error}/>
      </Window>);
    }
    return (
      <div className="login_form">
        <div className="login_form--head">
          <img src="/coffee-desk-laptop-notebook.jpg" className="login_form--head--background"/>
          <div className="login_form--head--caption">Вход или Регистрация</div>
        </div>
        <ContentSwitcher ref={this.switcherRef} initialKey={this.state.keyValue} transition={true}>
          <SwitchCase switchKey="auth">
            <CaptionInput ref={this.emailRef} caption="E-Mail" inputType="text" inputHint="Введите свой E-Mail" />
          </SwitchCase>
          <SwitchCase switchKey="pass">
            <CaptionInput ref={this.passMailRef} caption="E-Mail" inputType="text" inputHint="Введите свой E-Mail" />
            <CaptionInput ref={this.passPasswordRef} caption="Пароль" inputType="text" inputHint="Введите свой пароль" />
          </SwitchCase>
          <SwitchCase switchKey="pass_email">
            <CaptionInput ref={this.pmMailRef} caption="E-Mail" inputType="text" inputHint="Введите свой E-Mail" />
            <div>Одноразовый пароль для входа отправлен на вашу почту.</div>
            <CaptionInput ref={this.pmPasswordRef} caption="Пароль" inputType="text" inputHint="Введите свой пароль" />
          </SwitchCase>
          <SwitchCase switchKey="register">
            <CaptionInput ref={this.regMailRef} caption="E-Mail" inputType="text" inputHint="Введите свой E-Mail" />
            <CaptionInput ref={this.regAuthTypeRef} caption="Вход по одноразовому паролю" inputType="checkbox" inputHint="" />
          </SwitchCase>
          <SwitchCase switchKey="wait">
            <WaitPanel />
          </SwitchCase>
        </ContentSwitcher>

        <div className="login_form--nav">
          <button className="login_form--prev invisible" ref={this.buttonNext}>Назад</button>
          <button className="login_form--next" ref={this.buttonPrev} onClick={this.nextClick}>Далее</button>
        </div>

        {errorWindow}
      </div>);
  }
}