import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';
import { makeStyles } from "@material-ui/core/styles";

interface CodeEditorProps {
  value: string,
  onChange: (getValue: () => string) => void,
}

const useStyles = makeStyles({
  editor: {
    fontSize: 14,
    fontFamily: 'monospace',
    '& .cm-s-material .cm-code': {},
  }
});

const CodeEditor: React.FunctionComponent<CodeEditorProps> = ({value, onChange}) => {
  const classes = useStyles();
  return (
    <CodeMirror
      className={classes.editor}
      value={value}
      options={{
        theme: 'material',
        lineWrapping: true,
        lineNumbers: true,
        mode: {
          name: 'gfm',
          tokenTypeOverrides: {
            code: 'code',
            list1: 'list',
            list2: 'list',
            list3: 'list',
          },
        },
      }}
      editorDidMount={editor => {
        const getValue = () => editor.getValue()
        editor.on('change', () => {
          onChange(getValue);
        });
      }}
    />
  )
}

export default CodeEditor;