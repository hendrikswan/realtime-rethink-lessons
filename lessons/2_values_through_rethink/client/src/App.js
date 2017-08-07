import React, { Component } from 'react';
import './App.css';
import { subscribeToTimer } from './api';


class App extends Component {
  constructor(props) {
    super(props);

    subscribeToTimer((timestamp) => {
      this.setState({
        timestamp
      });
    });
  }

  state = {
    timestamp: 'no timestamp yet'
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Our awesome drawing app</h2>
        </div>
        This is the value of the timer timestamp: {this.state.timestamp}      
      </div>
    );
  }
}

export default App;
