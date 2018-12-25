import React from 'react';
import CaptionInput from "./CaptionInput";
import {SwitchCase} from "./ContentSwitcher";

export default class RegisterPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {tempPassword: true};
    this.regMailRef = React.createRef();
    this.regTeacherRef = React.createRef();
    this.regPassword1 = React.createRef();
    this.regPassword2 = React.createRef();
  }

  authTypeChange(e) {
    console.log(e.value);
    this.setState({tempPassword: e.value});
  }

  render() {
    let customPassword = null;
    if (!this.state.tempPassword) {
      customPassword = (
        <React.Fragment>
          <CaptionInput caption="Пароль"
                        inputType="password"
                        inputHint="Пароль"
                        ref={this.regPassword1}/>
          <CaptionInput caption="Пароль"
                        inputHint="Подтверждение пароля"
                        inputType="password"
                        ref={this.regPassword2}/>
        </React.Fragment>);
    }
    return (
      <div className="register-panel">
        <CaptionInput ref={this.regMailRef}
                      value={this.props.email}
                      caption="E-Mail"
                      inputType="email"
                      inputHint="Введите свой E-Mail" />
        <CaptionInput ref={this.regNameRef}
                      caption="Имя"
                      inputHint="Имя, Фамилия" />
        <CaptionInput ref={this.regNameRef}
                      caption="Группа"
                      inputHint="Группа или название курса" />
        <div className="hint-small">
          Имя, название группы, курса и/или год обучения нужны чтобы преподаватель мог отличить вас от других учеников.
          Сюда можно ввести любые данные, которые помогут в этом, особенно если группа состоит из Иванов Ивановых.
        </div>
        {customPassword}
        <CaptionInput className="temporary-password-auth"
                      caption="Вход по одноразовому паролю"
                      inputType="checkbox"
                      onChange={this.authTypeChange.bind(this)}
                      value={true}/>
        <div className="hint-small">
          Запоминать пароль не потребуется. Он будет приходить каждый раз на почту, когда вам потребуется зайти.
        </div>
        <CaptionInput ref={this.regTeacherRef}
                      className="teacher-registration"
                      caption="Регистрация в качестве преподавателя"
                      inputHint=""
                      inputType="checkbox"
                      />
      </div>
    );
  }
}