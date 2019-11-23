import React, { Component } from 'react'
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';

class CodeEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorHeight: '90vh',
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
    this.props.onChange(value);
  }

  render() {
    return (
      <AceEditor
        name='coderpad'
        mode={this.props.language}
        theme='monokai'
        height={this.state.editorHeight}
        width={this.state.editorWidth}
        value={this.props.source}
        onChange={this.onChange}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          showLineNumbers: true,
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false
        }}
      />
    )
  }
}

export default CodeEditor;