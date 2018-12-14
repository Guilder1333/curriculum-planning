import React from 'react';
import ReactDOM from 'react-dom';
import LoginDialog from './components/LoginDialog';
import Window from "./components/Window";

class App extends React.Component {
  render() {
    return (
      <div>
        <Window>
          <LoginDialog/>
        </Window>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app-root"));