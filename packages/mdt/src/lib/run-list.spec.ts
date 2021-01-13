import { promises as fs } from 'fs';
import * as path from 'path';

import test from 'ava';
import doc from 'rehype-document';
import format from 'rehype-format';
import html from 'rehype-stringify';
import remarkStringify from 'remark-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';

import { runList } from './run-list';

const { readFile } = fs;

test('run request', async (t) => {
  const example = await readFile(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'test',
      'integration',
      'httpbin',
      'request.md'
    )
  );
  const markdownFile = await unified()
    .use(markdown)
    .use(runList)
    .use(remarkStringify, {listItemIndent: 'one'})
    .process(example);
  console.log(String(markdownFile));
  const htmlFile = await unified()
    .use(markdown)
    .use(remark2rehype)
    .use(doc, { title: '👋🌍' })
    .use(format)
    .use(html)
    .process(example);
  t.truthy(markdownFile);
  t.truthy(htmlFile);
});
