import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';
import { makeStyles } from "@material-ui/core/styles";

interface CodeEditorProps {
  value: string
}

const useStyles = makeStyles({
  editor: {
    fontSize: 14,
    fontFamily: 'monospace',
    '& .cm-s-material .cm-code': {
      fontWeight: 'bold',
    }
  }
});

const CodeEditor: React.FunctionComponent<CodeEditorProps> = ({value}) => {
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
    />
  )
}

export default CodeEditor;