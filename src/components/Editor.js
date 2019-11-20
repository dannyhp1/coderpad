import React, { Component } from 'react'
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';

const DEFAULT_CODE = {
  'java' : 
    `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello world!");
    }
}`,

  'python' :
    `print("Hello world!")`,
    
  'c_cpp' :
    `#include <iostream>
using namespace std;

int main()
{
    cout << "Hello world!" << end;
    return 0;
}`
}

class Editor extends Component {

  onChange = () => {

  }

  render() {
    return (
      <AceEditor
        name='coderpad'
        mode='java'
        theme='monokai'
        defaultValue={DEFAULT_CODE['java']}
        onChange={this.onChange}
        editorProps={{ $blockScrolling: true }}
      />
    )
  }
}

export default Editor;