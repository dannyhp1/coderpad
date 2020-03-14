import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from '../components/Header';
import CoderpadWrapper from '../components/CoderpadWrapper';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <Route 
            exact
            path='/' 
            render={(props) => <CoderpadWrapper {...props} />}
          />
          <Route 
            exact
            path='/:id' 
            render={(props) => <CoderpadWrapper {...props} />}
          />
        </Router>
      </div>
    );
  }
}

export default App;
