import React, { Component } from 'react';
import Header from '../components/Header';
import CoderpadWrapper from '../components/CoderpadWrapper';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <CoderpadWrapper />
      </div>
    );
  }
}

export default App;
