import React, { useState } from 'react'
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-pastel_on_dark';

function CoderpadResults(props) {
  const [height, setHeight] = useState('80vh');
  const [width, setWidth] = useState('auto');

  // eslint-disable-next-line
  let onResize = (width, height) => {
    setHeight(height);
    setWidth(width);
  }

  onResize = onResize.bind(this);

  return (
    <AceEditor
      name='coderpad-results'
      theme='pastel_on_dark'
      height={height}
      width={width}
      value={props.logs}
      showGutter={false}
      editorProps={{ $blockScrolling: true }}
      showPrintMargin={false}
      cursorStart={0}
      showLineNumbers={false}
      readOnly={true}
      highlightActiveLine={false}
      setOptions={{
        showLineNumbers: false
      }}
    />
  )
}

export default CoderpadResults;