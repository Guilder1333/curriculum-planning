import React from 'react';
import ReactDOM from 'react-dom';
import LoginDialog from './components/LoginDialog';
import Window from "./components/Window";
import axios from "axios";
import ErrorPanel from "./components/ErrorPanel";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: null, login: false};
  }

  componentDidMount() {
    axios.post("/api/login", { stage: "check" }, { withCredentials: true }).then((r) => {
      console.log(r.data);
      if (r.data.status === "auth") {
        this.setState({login: false, error: null});
      } else {
        this.setState({login: true, error: null});
      }
    }).catch((e) => {
      console.error(e);
      this.setState({ error: e, login: false })
    });
  }

  render() {
    let window = null;
    if (this.state.error) {
      window = (
        <Window className="error-window" modal={true}>
          <ErrorPanel message={this.state.error}/>
        </Window>
      );
    } else if (this.state.login) {
      window = (
        <Window className="login-window" modal={true}>
          <LoginDialog/>
        </Window>
      );
    }
    return (
      <div>
        {window}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app-root"));