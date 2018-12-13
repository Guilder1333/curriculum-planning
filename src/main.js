import React from 'react';
import ReactDOM from 'react-dom';
import LoginDialog from './components/LoginDialog';

class App extends React.Component {
  render() {
    return (
      <div>
        <LoginDialog/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app-root"));