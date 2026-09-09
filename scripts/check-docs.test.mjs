import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDocument, anchors } from './check-docs.mjs';

function check(source, others = {}) {
  const files = { '/repo/source.md': source, ...others };
  return checkDocument('/repo/source.md', path => files[path], path => Object.hasOwn(files, path));
}

test('valid relative paths, Chinese headings, encoded paths and duplicate headings', () => {
  const result = check('[a](target.md#中文标题) [b](target.md#中文标题-1) ![image](<my image.png>) [c](my%20image.png)', {
    '/repo/target.md': '# 中文标题\n# 中文标题', '/repo/my image.png': '',
  });
  assert.equal(result.checked, 4);
  assert.deepEqual(result.errors, []);
});

test('missing file and renamed heading fail with source locations', () => {
  const result = check('[a](missing.md)\n[b](target.md#old)', { '/repo/target.md': '# New' });
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0], /source.md:1: missing path/);
  assert.match(result.errors[1], /source.md:2: missing heading/);
});

test('same-document anchors and punctuation in headings', () => {
  assert.deepEqual(check('# `Code` / 中文\n[a](#code--中文)').errors, []);
  assert.deepEqual([...anchors('# Title\n# Title\n# Title-1')], ['title', 'title-1', 'title-1-1']);
});

test('ignore fenced code, inline code, comments and remote links', () => {
  const source = '````md\n```\n[a](missing.md)\n````\n~~~\n[b](missing.md)\n~~~\n`[c](missing.md)`\n<!-- [d](missing.md) -->\n[e](https://example.com)';
  assert.deepEqual(check(source), { checked: 0, errors: [] });
});

test('malformed percent encoding is a broken link, not a tool error', () => {
  assert.match(check('[a](bad%xx.md)').errors[0], /invalid URL encoding/);
});

test('filesystem errors propagate as tool errors', () => {
  assert.throws(() => checkDocument('/repo/source.md', () => { throw new Error('read denied'); }), /read denied/);
});
