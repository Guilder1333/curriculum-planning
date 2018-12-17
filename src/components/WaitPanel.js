import React from 'react';

function renderDefaultSpinner() {
  return (<svg className="default-spinner" width="40px" height="40px" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <rect x="19" y="19" width="20" height="20" fill="#0055a5">
      <animate attributeName="fill" values="#45aee7;#0055a5;#0055a5" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0s" calcMode="discrete"/>
    </rect>
    <rect x="40" y="19" width="20" height="20" fill="#0055a5">
      <animate attributeName="fill" values="#45aee7;#0055a5;#0055a5" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.125s" calcMode="discrete"/>
    </rect>
    <rect x="61" y="19" width="20" height="20" fill="#0055a5">
      <animate attributeName="fill" values="#45aee7;#0055a5;#0055a5" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.25s" calcMode="discrete"/>
    </rect>
    <rect x="19" y="40" width="20" height="20" fill="#0055a5">
      <animate attributeName="fill" values="#45aee7;#0055a5;#0055a5" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.875s" calcMode="discrete"/>
    </rect>
    <rect x="61" y="40" width="20" height="20" fill="#0055a5">
      <animate attributeName="fill" values="#45aee7;#0055a5;#0055a5" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.375s" calcMode="discrete"/>
    </rect>
    <rect x="19" y="61" width="20" height="20" fill="#0055a5">
      <animate attributeName="fill" values="#45aee7;#0055a5;#0055a5" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.75s" calcMode="discrete"/>
    </rect>
    <rect x="40" y="61" width="20" height="20" fill="#0055a5">
      <animate attributeName="fill" values="#45aee7;#0055a5;#0055a5" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.625s" calcMode="discrete"/>
    </rect>
    <rect x="61" y="61" width="20" height="20" fill="#0055a5">
      <animate attributeName="fill" values="#45aee7;#0055a5;#0055a5" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.5s" calcMode="discrete"/>
    </rect>
  </svg>)
}

export default class WaitPanel extends React.Component {
  constructor(props) {
    super(props);
    if (React.Children.count(props.children)) {
      this.spinner = React.Children.only(props.children);
    } else {
      this.spinner = renderDefaultSpinner();
    }
  }

  render() {
    return (
      <div className="wait-panel">
        {this.spinner}
      </div>
    );
  }
}