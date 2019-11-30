import React, { Component } from 'react'
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-spellcheck';
import 'ace-builds/src-noconflict/ext-options';
import 'ace-builds/src-noconflict/ext-searchbox';

class CodeEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorHeight: '82.5vh',
      editorWidth: 'auto'
    }
    this.onResize = this.onResize.bind(this)
  }

  onResize = (w, h) => {
    this.setState({
      editorHeight: h,
      editorWidth: w
    })
  }

  onChange = (value) => {
    this.props.onChange(value)
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
          enableBasicAutocompletion: this.props.autocomplete,
          enableLiveAutocompletion: this.props.autocomplete
        }}
      />
    )
  }
}

export default CodeEditor;