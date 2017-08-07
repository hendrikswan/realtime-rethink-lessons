import React, { Component } from 'react';
import './App.css';
import DrawingForm from './DrawingForm';
import DrawingList from './DrawingList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Our awesome drawing app</h2>
        </div>

        <DrawingForm />

        <DrawingList />
      </div>
    );
  }
}

export default App;
