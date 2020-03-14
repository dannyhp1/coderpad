import React, { Component } from 'react';
import axios from 'axios';
import CodeEditor from './CodeEditor';
import ResultsEditor from './ResultsEditor';
import { Grid, Button, FormControl, FormControlLabel, Checkbox, Select, MenuItem } from '@material-ui/core';
import code from '../resources/code';
import languages from '../resources/languages';

// Backend servers to execute code.
const EXECUTE_CODE_DEV_POST_URL = 'http://localhost:5000/coderpad/execute'
const EXECUTE_CODE_PROD_POST_URL = 'https://aws.dannyhp.com/coderpad/execute'
const EXECUTE_CODE_POST_URL = EXECUTE_CODE_PROD_POST_URL

// Backend servers to save code.
const SAVE_CODE_DEV_POST_URL = 'http://localhost:5000/pastebin/save'
const SAVE_CODE_PROD_POST_URL = 'https://aws.dannyhp.com/pastebin/save'
const SAVE_CODE_POST_URL = SAVE_CODE_PROD_POST_URL

// Backend servers to load code.
const LOAD_CODE_DEV_GET_URL = 'http://localhost:5000/pastebin/load/%s'
const LOAD_CODE_PROD_GET_URL= 'https://aws.dannyhp.com/pastebin/load/%s'
const LOAD_CODE_GET_URL = LOAD_CODE_PROD_GET_URL

// Default settings on page loadup.
const SUPPORTED_LANGUAGES = ['java', 'python', 'c_cpp']
const DEFAULT_LANGUAGE = 'java'
const DEFAULT_AUTOCOMPLETE = false
const DEFAULT_PRACTICE = false
const DEFAULT_SETTINGS = {
  language: DEFAULT_LANGUAGE,
  source: {'java': code['java'], 'python': code['python'], 'c_cpp': code['c_cpp']},
  results: [ ],
  disabled: false,
  practice: DEFAULT_PRACTICE,
  autocomplete: DEFAULT_AUTOCOMPLETE
};

// Notification messages.
const EXECUTING_CODE_MESSAGE = 'Running your code...'
const EXECUTING_CODE_ERROR = 'Code cannot be executed. Network connection to server cannot be established.\n'

class CoderpadWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_SETTINGS;
    this.getInitialState();
  }

  /**
   * Attempts to fetch code from pastebin and load into coderpad.
   */
  getInitialState = () => {
    if (this.props.match.path === "/:id") {
      const paste_id = this.props.match.params.id;
      const get_url = LOAD_CODE_GET_URL.replace('%s', paste_id);

      axios.get(get_url)
        .then(response => {
          const status = response.data.status
          if(status === 'success') {
            const language = response.data.type;
            const code = response.data.text;
            if(SUPPORTED_LANGUAGES.includes(language)) {
              this.onChangeLanguage(language);
              this.onChangeCode(code);
            }
          }
        }).catch(error => {
          return;
        })
    }
  }

  /**
   * Changes the current source code.
   * @param string  value The source code as a string.
   */
  onChangeCode = (value) => {
    let currentSource = this.state.source;
    currentSource[this.state.language] = value;

    this.setState({
      ...this.state,
      source: currentSource
    });
  }

  /**
   * Changes the programming language.
   * @param value  The new value to set as the programming language.
   */
  onChangeLanguage = (value) => {
    this.setState({
      ...this.state,
      language: value
    });
  }

  /**
   * Changes the programming language.
   * @param event  The event of switching select box.
   */
  onChangeLanguageEvent = (event) => {
    this.onChangeLanguage(event.target.value);
  }

  /**
   * Enables/disables practice mode.
   */
  onChangePractice = () => {
    this.setState({
      ...this.state,
      practice: !this.state.practice
    });
  }

  /**
   * Enables/disables autocomplete.
   */
  onChangeAutocomplete = () => {
    this.setState({
      ...this.state,
      autocomplete: !this.state.autocomplete
    });
  }

  /**
   * Adds code executing message and disables run button.
   */
  setRunningStatus = () => {
    let currentResults = this.state.results;
    currentResults.unshift(EXECUTING_CODE_MESSAGE);

    this.setState({
      ...this.state,
      results: currentResults,
      disabled: true
    });
  }

  /**
   * Removes code executing message and reenables run button.
   */
  setFinishedStatus = () => {
    let currentResults = this.state.results;
    currentResults.shift();

    this.setState({
      ...this.state,
      results: currentResults,
      disabled: false
    });
  }

  /**
   * Makes request to backend server and parses code execution results.
   */
  executeCode = () => {
    this.setRunningStatus();

    axios.post(EXECUTE_CODE_POST_URL, {
      language: this.state.language,
      code: this.state.source[this.state.language],
    }).then(response => {
      const build = response['data']['build'];
      // const error = response['data']['error']
      const run = response['data']['run'];

      const result = { build: null, message: null };

      if (run !== 'None') {
        result['build'] = true;
        result['message'] = run;
      } else {
        result['build'] = false;
        result['message'] = build;
      }

      this.addToLog(result);
    }).catch(error => {
      this.setFinishedStatus();

      let currentResults = this.state.results;
      currentResults.unshift(EXECUTING_CODE_ERROR);

      this.setState({
        ...this.state,
        results: currentResults
      });
    })
  }

  /**
   * Clears all of the logs from the current state.
   */
  clearLogs = () => {
    this.setState({
      ...this.state,
      results: [ ]
    });
  }

  /**
   * Adds the result message to the log.
   * @param object  result  Results of POST request containing build status and running message.
   */
  addToLog = (result) => {
    // Before processing the new result, we must pop the message 'Running your code...' off and re-enable the button.
    this.setFinishedStatus();
    let currentResults = this.state.results;

    if (result['build'] === true) {
      currentResults.unshift('[' + languages[this.state.language] + '] Build successfully completed!\nStandard output:\n' + result['message']);
    } else {
      currentResults.unshift('[' + languages[this.state.language] + '] Build failed!\nBuild errors:\n' + result['message']);
    }

    this.setState({
      ...this.state,
      results: currentResults
    });
  }

  /**
   * Compiles the list of logs into a single string.
   */
  getLogs = () => {
    return this.state.results.join('\n\n');
  }

  /**
   * Saves the code snippet and copies link to clipboard.
   */
  saveCode = () => {
    return;
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
            <FormControl style={{ textAlign: 'center', width: '20%', marginLeft: '1.5%', marginRight: '2.5%' }}>
              <Select
                labelId='select-language-label'
                id='select-language'
                value={this.state.language}
                onChange={this.onChangeLanguageEvent}
                style={{ color: '#ffffff' }}
              >
                <MenuItem value='java'>{languages['java']}</MenuItem>
                <MenuItem value='python'>{languages['python']}</MenuItem>
                <MenuItem value='c_cpp'>{languages['c_cpp']}</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.autocomplete}
                    onChange={this.onChangeAutocomplete}
                    value='autocomplete'
                    style={{ color: '#0269a4' }}
                  />
                }
                label='Code Autocomplete'
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
                label='Practice Mode'
                style={{ marginRight: '2.5%' }}
            />
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Button variant='contained' color='primary' 
              onClick={this.saveCode} 
              style={{ background: '#0269a4', marginRight: '2.5%' }}>
              Save Code
            </Button>
            <Button variant='contained' color='primary' 
              onClick={this.clearLogs} 
              style={{ background: '#0269a4', marginRight: '2.5%' }}>
              Clear Logs
            </Button>
            <Button variant='contained' color='primary' 
              onClick={this.executeCode} 
              disabled={this.state.disabled} 
              style={{ background: '#0269a4', marginRight: '1.5%' }}>
              {this.state.disabled ? 'Running code...' : 'Run Code'}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default CoderpadWrapper;