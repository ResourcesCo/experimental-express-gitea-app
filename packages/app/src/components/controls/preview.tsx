/// <reference path="./preview.d.ts" />

import React from 'react';
import ReactIs from 'react-is';
import { makeStyles } from "@material-ui/core/styles";
import unified from 'unified';
import markdown from 'remark-parse';
import slug from 'remark-slug';
import toc from 'remark-toc';
import gfm from 'remark-gfm';
import remark2rehype from 'remark-rehype';
import highlight from 'rehype-highlight';
import rehype2react from 'rehype-react';
import styles from './preview-highlight.module.scss';

var processor = unified()
  .use(markdown)
  .use(slug)
  .use(toc)
  .use(gfm)
  .use(remark2rehype)
  .use(highlight, {ignoreMissing: true})
  .use(rehype2react, {createElement: React.createElement});

interface EditorProps {
  value: string,
}

const useStyles = makeStyles({
  editor: {
    height: '100%',
    padding: 5,
  },
});

const Editor: React.FunctionComponent<EditorProps> = ({value}) => {
  const classes = useStyles();
  const result = processor.processSync(value).result;
  return (
    <div className={`${classes.editor} ${styles.highlight}`}>
      { ReactIs.isElement(result) ? result : null }
    </div>
  );
}

export default Editor;
