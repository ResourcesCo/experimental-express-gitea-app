/// <reference path="./editor.d.ts" />

import React from 'react';
import ReactIs from 'react-is';
import { makeStyles } from "@material-ui/core/styles";
import unified from 'unified';
import markdown from 'remark-parse';
import slug from 'remark-slug';
import toc from 'remark-toc';
import github from 'remark-github';
import remark2rehype from 'remark-rehype';
import highlight from 'rehype-highlight';
import rehype2react from 'rehype-react';

var processor = unified()
  .use(markdown)
  .use(slug)
  .use(toc)
  .use(github, {repository: 'rehypejs/rehype-react'})
  .use(remark2rehype)
  .use(highlight)
  .use(rehype2react, {createElement: React.createElement});
  
interface EditorProps {
}

const useStyles = makeStyles({
  editor: {
    backgroundColor: 'green',
  }
});

const Editor: React.FunctionComponent<EditorProps> = ({}) => {
  const classes = useStyles();
  const text = `# Markdown Example

text here`;
  const result = processor.processSync(text).result;
  return (
    <div className={classes.editor}>
      { ReactIs.isElement(result) ? result : null }
    </div>
  )
}

export default Editor;
