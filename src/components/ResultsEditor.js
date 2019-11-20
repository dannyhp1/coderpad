import React, { Component } from 'react'
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';

class ResultsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorHeight: 850,
      editorWidth: 'auto'
    }
    this.onResize = this.onResize.bind(this);
  }

  onResize = (w, h) => {
    this.setState({
      editorHeight: h,
      editorWidth: w
    })
  }

  onChange = (value) => {
    
  }

  render() {
    return (
      <AceEditor
        name='coderpad-results'
        theme='monokai'
        height={this.state.editorHeight}
        width={this.state.editorWidth}
        value={this.props.logs}
        editorProps={{ $blockScrolling: true }}
        cursorStart={0}
        showLineNumbers={false}
        readOnly={true}
        highlightActiveLine={false}
        setOptions={{
          showLineNumbers: false,
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false
        }}
      />
    )
  }
}

export default ResultsEditor;