import React, { useState } from 'react'
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-pastel_on_dark';

function CodeEditor(props) {
  const [height, setHeight] = useState('80vh');
  const [width, setWidth] = useState('auto');

  // eslint-disable-next-line
  let onResize = (width, height) => {
    setHeight(height);
    setWidth(width);
  }

  const onChange = (value) => {
    props.onChange(value)
  }

  onResize = onResize.bind(this);

  return (
    <AceEditor
      name='coderpad'
      mode={props.language}
      theme='pastel_on_dark'
      height={height}
      width={width}
      value={props.code}
      onChange={onChange}
      showPrintMargin={false}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        showLineNumbers: true,
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
      }}
    />
  )
}

export default CodeEditor;