import React, { Component } from 'react';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import ResultsEditor from '../components/ResultsEditor';
import { Grid, Button, FormControl, FormControlLabel, Checkbox, Select, MenuItem } from '@material-ui/core';
import code from '../resources/code';
import languages from '../resources/languages';

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
    return ({
      language: 'java',
      source: {'java': code['java'], 'python': code['python'], 'c_cpp': code['c_cpp']},
      results: [ ],
      disabled: false,
      practice: false,
      autocomplete: true
    })
  }

  onChangeCode = (value) => {
    let currentSource = this.state.source;
    currentSource[this.state.language] = value;

    this.setState({
      ...this.state,
      source: currentSource
    })
  }

  onChangeLanguage = (event) => {
    this.setState({
      ...this.state,
      language: event.target.value
    })
  }

  onChangePractice = () => {
    this.setState({
      ...this.state,
      practice: !this.state.practice
    })
  }

  onChangeAutocomplete = () => {
    this.setState({
      ...this.state,
      autocomplete: !this.state.autocomplete
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
      code: this.state.source[this.state.language],
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
    }).catch(error => {
      this.setFinishedStatus()

      let currentResults = this.state.results
      currentResults.unshift('Code cannot be executed. Network connection to server cannot be established.\n')

      this.setState({
        ...this.state,
        results: currentResults
      })
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
      currentResults.unshift('[' + languages[this.state.language] + '] ' + 'Build successfully completed!\nStandard output:\n' + result['message'])
    } else {
      currentResults.unshift('[' + languages[this.state.language] + '] ' + 'Build failed!\nBuild errors:\n' + result['message'])
    }

    this.setState({
      ...this.state,
      results: currentResults
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
              autocomplete={this.state.autocomplete}
              language={this.state.practice === true ? 'plain_text' : this.state.language} 
              source={this.state.source[this.state.language]} 
              onChange={this.onChangeCode} />
          </Grid>
          <Grid item xs={6}>
            <ResultsEditor logs={this.getLogs()} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <FormControl style={{ textAlign: 'center', width: '20%', marginLeft: '1.5%', marginRight: '3.5%' }}>
              <Select
                labelId='select-language-label'
                id='select-language'
                value={this.state.language}
                onChange={this.onChangeLanguage}
                style={{ color: '#ffffff' }}
              >
                <MenuItem value='java'>{languages['java']}</MenuItem>
                <MenuItem value='python'>{languages['python']}</MenuItem>
                <MenuItem value='c_cpp'>{languages['c_cpp']}</MenuItem>
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
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.autocomplete}
                    onChange={this.onChangeAutocomplete}
                    value='autocomplete'
                    style={{ color: '#0269a4' }}
                  />
                }
                label="Autocomplete"
                style={{ marginRight: '2.5%' }}
            />
            <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.practice}
                    onChange={this.onChangePractice}
                    value='practice'
                    style={{ color: '#0269a4' }}
                  />
                }
                label="Practice Format"
                style={{ marginRight: '2.5%' }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;