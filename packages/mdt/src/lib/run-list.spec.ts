import { promises as fs } from 'fs';
import * as path from 'path';

import test from 'ava';
import doc from 'rehype-document';
import format from 'rehype-format';
import html from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import report from 'vfile-reporter';

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
  const markdownTree = await unified()
    .use(markdown)
    .parse(example);
  const htmlFragmentTree = await unified()
    .use(markdown)
    .use(remark2rehype)
    .use(format)
    .parse(example);
  const htmlDocumentTree = await unified()
    .use(markdown)
    .use(remark2rehype)
    .use(doc, { title: '👋🌍' })
    .use(format)
    .parse(example);
  const htmlFile = await unified()
    .use(markdown)
    .use(remark2rehype)
    .use(doc, { title: '👋🌍' })
    .use(format)
    .use(html)
    .process(example);
  console.log(report(htmlFile));
  console.log(String(htmlFile));
  t.truthy(markdownTree);
  t.truthy(htmlFragmentTree);
  t.truthy(htmlDocumentTree);
  t.deepEqual(runList(3), { input: 3 });
});
