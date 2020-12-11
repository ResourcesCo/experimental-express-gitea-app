import test from 'ava';
import doc from 'rehype-document';
import format from 'rehype-format';
import html from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import unified from 'unified';
import report from 'vfile-reporter';

import { runList } from './run-list';

test('run request', (t) => {
  unified()
    .use(markdown)
    .use(remark2rehype)
    .use(doc, { title: '👋🌍' })
    .use(format)
    .use(html)
    .process('# Hello world!', function (err, file) {
      console.error(report(err || file));
      console.log(String(file));
    });
  t.deepEqual(runList(3), { input: 3 });
});
