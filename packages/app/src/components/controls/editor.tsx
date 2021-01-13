import { useState } from 'react';
import { throttle } from 'lodash';
import CodeEditor from './code-editor';
import Preview from './preview';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    display: 'flex',
  },
  editor: {
    width: '50%',
  },
  preview: {
    width: '50%',
  }
});

interface EditorProps {
}

const Editor: React.FunctionComponent<EditorProps> = ({}) => {
  const [value, setValue] = useState('');
  const classes = useStyles();

  const handleChange = throttle((getValue: () => string) => {
    setValue(getValue());
  }, 200)

  console.log({value});

  return (
    <div className={ classes.container }>
      <div className={ classes.editor }>
        <CodeEditor value="" onChange={handleChange} />
      </div>
      <div className={ classes.preview }>
        <Preview value={value} />
      </div>
    </div>
  );
}

export default Editor;