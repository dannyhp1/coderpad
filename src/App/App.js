import React from 'react';
import routes from '../routes/routes';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import NavigationBar from '../components/navigation/NavigationBar';
import CoderpadWrapper from '../components/coderpad/CoderpadWrapper';
import 'react-notifications-component/dist/theme.css'
import './App.css';

function App() {
  return (
    <div className="App">
      <ReactNotification />
      <Router>
        <NavigationBar />
        <Route
          exact
          path={routes['default']}
          render={(props) => <CoderpadWrapper {...props} />}
        />
        <Route 
          exact
          path={routes['coderpad']} 
          render={(props) => <CoderpadWrapper {...props} />}
        />
        <Route
          exact
          path={routes['coderpadId']}
          render={(props) => <CoderpadWrapper {...props} />}
        />
        <Route
          exact
          path={routes['sourceCode']}
          component={() => {
            window.location.href = 'https://github.com/dannyhp1/coderpad'
          }}
        />
      </Router>
    </div>
  );
}

export default App;
