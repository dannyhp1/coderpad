import React, { Component } from 'react';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import ResultsEditor from '../components/ResultsEditor';
import { Grid, Button, FormControl, Select, MenuItem } from '@material-ui/core';
import code from '../resources/code';

import './App.css';

const devPostUrl = 'http://localhost:5000/execute'
const postUrl = 'https://dev.dannyhp.com:8443/execute';

class App extends Component {
  constructor(props) {
    super(props)

    // Default language set to Java; AceEditor does not support C++ yet.
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    // If the URL path ends with 'practice', highlight will turn off.
    return ({
      language: 'java',
      source: code['java'],
      results: [ ],
      disabled: false,
      highlight: window.location.search.endsWith('practice') ? false : true
    })
  }

  onChangeCode = (value) => {
    this.setState({
      ...this.state,
      source: value
    })
  }

  onChangeLanguage = (event) => {
    this.setState({
      ...this.state,
      language: event.target.value,
      source: code[event.target.value],
      results: [ ]
    })
  }

  setRunningStatus = () => {
    let currentResults = this.state.results;
    currentResults.unshift('Running your code...')

    this.setState({
      ...this.state,
      results: currentResults,
      disabled: true
    })
  }

  setFinishedStatus = () => {
    let currentResults = this.state.results;
    currentResults.shift()

    this.setState({
      ...this.state,
      results: currentResults,
      disabled: false
    })
  }

  executeCode = () => {
    this.setRunningStatus()

    axios.post(postUrl, {
      language: this.state.language,
      code: this.state.source,
    }).then(response => {
      const build = response['data']['build']
      const error = response['data']['error']
      const run = response['data']['run']

      const result = { build: null, message: null }

      if (run !== 'None') {
        result['build'] = true
        result['message'] = run
      } else {
        result['build'] = false
        result['message'] = build
      }

      this.addToLog(result)
    })
  }

  downloadCode = () => {
    // TODO: Code to download source code.
  }

  addToLog = (result) => {
    // Before processing the new result, we must pop the message 'Running your code...' off and re-enable the button.
    this.setFinishedStatus()

    // Will only keep the latest 10 results in the logs.
    let currentResults = this.state.results

    // Most recent results are at the top, remove the element at the end if we exceed 10 logs.
    if (currentResults.length >= 10) {
      currentResults.pop()
    }

    if (result['build'] === true) {
      currentResults.unshift('Build status: SUCCESS!\n\nStandard output:\n' + result['message'])
    } else {
      currentResults.unshift('Build status:\nFAILED!\n\nBuild errors:\n' + result['message'])
    }

    this.setState({
      ...this.state,
      results: currentResults,
      disabled: false
    })
  }

  getLogs = () => {
    return this.state.results.join('\n\n')
  }

  render() {
    return (
      <div className="App">
        <Grid container style={{ marginBottom: '1.5%' }}>
          <Grid item xs={6}>
            <CodeEditor 
              autocomplete={this.state.highlight}
              language={this.state.highlight === false ? 'markdown' : this.state.language} 
              source={this.state.source} 
              onChange={this.onChangeCode} />
          </Grid>
          <Grid item xs={6}>
            <ResultsEditor logs={this.getLogs()} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6} style={{ marginLeft: '1.5%' }}>
            <FormControl style={{ textAlign: 'center', width: '20%', marginRight: '3.5%' }}>
              <Select
                labelId='select-language-label'
                id='select-language'
                value={this.state.language}
                onChange={this.onChangeLanguage}
                style={{ color: '#ffffff' }}
              >
                <MenuItem value='java'>Java</MenuItem>
                <MenuItem value='python'>Python</MenuItem>
                <MenuItem value='c_cpp'>C++</MenuItem>
              </Select>
            </FormControl>
            <Button variant='contained' color='primary' 
              onClick={this.executeCode} 
              disabled={this.state.disabled} 
              style={{ background: '#0269a4', marginRight: '3.5%' }}>
              {this.state.disabled ? 'Running code...' : 'Run Code'}
            </Button>
            {/* TODO: Add 'Download Code' button to download script to local desktop for users. */}
            {/* <Button variant='contained' color='primary' 
              disabled
              onClick={this.downloadCode}
              style={{ background: '#0269a4', marginRight: '3.5%' }}>
              Download Code
            </Button> */}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;