import React, { useState, useEffect } from 'react';
import { store as Notification } from 'react-notifications-component';
import copy from 'copy-to-clipboard';
import axios from 'axios';
import CoderpadEditor from './CoderpadEditor';
import CoderpadResults from './CoderpadResults';
import configuration from '../../constants/coderpad/configuration';
import templates from '../../constants/coderpad/templates';
import messages from '../../constants/coderpad/messages';
import { Grid, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

function CoderpadWrapper(props) {
  const [coderpadServerHealthStatus, setCoderpadServerHealthStatus] = useState('unhealthy');
  const [pastebinServerHealthStatus, setPastebinServerHealthStatus] = useState('unhealthy');
  const [isExecuting, setIsExecuting] = useState(false);
  // eslint-disable-next-line
  const [isUploading, setIsUploading] = useState(false);
  const [practiceMode, setPracticeMode] = useState(configuration.PRACTICE_MODE);
  const [sourcePython, setSourcePython] = useState(templates['python']);
  const [sourceJava, setSourceJava] = useState(templates['java']);
  const [sourceCpp, setSourceCpp] = useState(templates['c_cpp']);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [logs, setLogs] = useState([]);
  const [codeLoaded, setCodeLoaded] = useState(false);

  useEffect(() => {
    // Ping the server to wake it up to allow execution.
    pingCoderpadServer();
    pingPastebinServer();

    // If the URL has a specific id, attempt to retrieve the code snippet.
    if (props.match.path === '/coderpad/:id') {
      const pasteId = props.match.params.id;
      const getUrl = configuration.GET_CODE_ENDPOINT.replace('%s', pasteId);
  
      axios.get(getUrl)
        .then(response => {
          const data = response.data;
          
          if (data.status === 'error') {
            // If no paste is associated with this id.
            addNotification('No code paste found!', 'Default template has been loaded.', 'danger');
            props.history.push('/coderpad');
            return;
          }

          if (data.id === String(pasteId)) {
            const language = data.language;
            const code = data.text;
            if(['java', 'python', 'cpp'].includes(language)) {
              setSourceLanguage(language);
              if (language === 'python') setSourcePython(code);
              if (language === 'java') setSourceJava(code);
              if (language === 'cpp') setSourceCpp(code);
              addNotification('Code paste successfully loaded!', '👀', 'success');
              setCodeLoaded(true);
            }
          }
        }).catch(error => {
          return;
        })
    } else {
      setSourceLanguage(configuration.DEFAULT_LANGUAGE);
    }
    // eslint-disable-next-line
  }, []);

  const pingCoderpadServer = async () => {
    axios.get(configuration.CODERPAD_PING_ENDPOINT)
      .then(response => {
        if(response['data']['status'] === 'healthy') {
          setCoderpadServerHealthStatus(response['data']['status']);
        }
    });
  };

  const pingPastebinServer = async () => {
    axios.get(configuration.PASTEBIN_PING_ENDPOINT)
      .then(response => {
        if(response['data']['status'] === 'healthy') {
          setPastebinServerHealthStatus(response['data']['status']);
        }
    });
  };

  const editCurrentCode = (value) => {
    // Note: python is the only supported language right now.
    if (sourceLanguage === 'python') setSourcePython(value);
    else if (sourceLanguage === 'java') setSourceJava(value);
    else if (sourceLanguage === 'c_cpp') setSourceCpp(value);
  };

  const getCurrentCode = () => {
    // Note: python is the only supported language right now.
    if (sourceLanguage === 'python') return sourcePython;
    else if (sourceLanguage === 'java') return sourceJava;
    else if (sourceLanguage === 'c_cpp') return sourceCpp;
  };

  const addExecutingMessage = () => {
    setLogs([messages['EXECUTING_CODE']].concat(logs));
  };

  const addToLogs = (result) => {
    let resultOutput = '[Python3] Code has been executed.\nStandard output:\n' + result['output'];
    setLogs([resultOutput].concat(logs));
  };

  const addErrorToLogs = () => {
    setLogs([messages['EXECUTION_ERROR']].concat(logs));
  };

  const getLogs = () => {
    return logs.join('\n\n');
  }

  const executeCode = () => {
    setIsExecuting(true);
    addExecutingMessage();

    axios.post(configuration.EXECUTE_ENDPOINT, {
      language: sourceLanguage,
      code: getCurrentCode(),
    }).then(response => {
      const result = { output: response['data']['std_output'], success: response['data']['success'] }
      setIsExecuting(false);
      addToLogs(result);
    }).catch(error => {
      addErrorToLogs();
      setIsExecuting(false);
    })
  };

  const uploadCode = () => {
    if (sourcePython === '') {
      alert('You cannot upload an empty paste.');
      return;
    } else if (sourcePython === templates['python']) {
      alert('You cannot upload the default template!');
      return
    }

    setIsUploading(true);

    axios.post(configuration.UPLOAD_CODE_ENDPOINT, {
      author: 'Coderpad Monkey',
      // Default language is python.
      text: sourcePython,
      language: sourceLanguage,
      type: 'coderpad',
    }).then(response => {
      return response.data.id;
    }).then((codeId) => {
      copyToClipboard(codeId);
      setIsUploading(false);
      props.history.push('/coderpad/' + codeId);
    });
  }

  const copyToClipboard = (codeId) => {
    const post_url = window.location.origin + '/coderpad/' + codeId;
    copy(post_url)
    addNotification('Link copied to clipboard!', 'Share it with your friends!', 'success');
  };

  const redirectToNewCoderpad = () => {
    props.history.push('/coderpad');
  };

  const addNotification = (title, message, type) => {
    Notification.addNotification({
      title: title,
      message: message,
      type: type,
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'bounceIn'],
      animationOut: ['animated', 'zoomOut'],
      dismiss: {
        duration: 3000,
        onScreen: false
      }
    });
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          <CoderpadEditor
            language={practiceMode ? 'plain_text' : sourceLanguage}
            onChange={editCurrentCode}
            code={getCurrentCode()}
          />
        </Grid>
        <Grid item xs={6}>
          <CoderpadResults
            logs={getLogs()}
          />
        </Grid>
      </Grid>
      <Grid container className={css(styles.menu)}>
        <Grid item xs={6}>
          <FormControlLabel
              control={
                <Checkbox
                  checked={practiceMode}
                  onChange={() => setPracticeMode(!practiceMode)}
                  value='practice'
                  className={css(styles.checkbox)}
                />
              }
              label='Practice Mode'
              className={css(styles.practiceForm)}
          />
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          {codeLoaded 
            ?
              <Button variant='contained' color='primary' 
                onClick={() => redirectToNewCoderpad()}
                className={css(styles.button)}
              >
                Generate New Pad
              </Button>
            :
              <Button variant='contained' color='primary' 
                onClick={() => uploadCode()}
                disabled={isUploading || pastebinServerHealthStatus === 'unhealthy'}
                className={css(styles.button)}
              >
                {pastebinServerHealthStatus === 'unhealthy' ? 'Connecting to server...' : isUploading ? 'Uploading your code...' : 'Save Code' }
              </Button>
          }
          <Button variant='contained' color='primary' 
            onClick={() => setLogs([])}
            className={css(styles.button)}
          >
            Clear Logs
          </Button>
          <Button variant='contained' color='primary'
            onClick={executeCode}
            disabled={isExecuting || coderpadServerHealthStatus === 'unhealthy'}
            className={css(styles.submitButton)}
          >
            {/* Pinging the server before allowing execution. */}
            {coderpadServerHealthStatus === 'unhealthy' ? 'Connecting to server...' : isExecuting ? messages['EXECUTING_CODE'] : 'Run Code'}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

const styles = StyleSheet.create({
  menu: {
    paddingTop: '1.5%',
    height: '12vh',
    backgroundColor: '#2B2828',
    color: '#ffffff',
  },
  checkbox: {
    color: '#0269a4',
  },
  practiceForm: {
    marginTop: '1%',
    marginLeft: '1.5%',
  },
  button: {
    marginTop: '1%',
    marginRight: '2.5%',
    background: '#0269a4',
    maxHeight: '50px',
  },
  submitButton: {
    marginTop: '1%',
    marginRight: '2.5%',
    background: '#2D804F',
    maxHeight: '50px',
  },
});

export default CoderpadWrapper;
