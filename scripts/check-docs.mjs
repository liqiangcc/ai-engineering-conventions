import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Only inspect prose, not examples inside fenced blocks or HTML comments.
export function prose(source) {
  let fence;
  return source.replace(/<!--[\s\S]*?-->/g, match => match.replace(/[^\n]/g, ' '))
    .split('\n').map(line => {
      const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (fence) {
        if (marker && marker[1][0] === fence[0] &&
            marker[1].length >= fence.length && !marker[2].trim()) fence = undefined;
        return '';
      }
      if (marker) { fence = marker[1]; return ''; }
      return line;
    }).join('\n');
}

export function anchors(source) {
  const ids = new Set();
  for (const line of prose(source).split('\n')) {
    const heading = line.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const base = heading[1].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '').replace(/ /g, '-');
    let id = base;
    for (let suffix = 1; ids.has(id); suffix++) id = `${base}-${suffix}`;
    ids.add(id);
  }
  return ids;
}

export function checkDocument(file, read = path => readFileSync(path, 'utf8'), exists = existsSync) {
  const errors = [];
  let checked = 0;
  const source = prose(read(file));
  for (const [index, raw] of source.split('\n').entries()) {
    const line = raw.replace(/(`+)([^`]|(?!\1)`)*?\1/g, '');
    const links = line.matchAll(/!?\[[^\]]*\]\(\s*(?:<([^>\n]+)>|([^\s()]*(?:\([^()]*\)[^\s()]*)*))\s*(?:"[^"]*"|'[^']*')?\s*\)/g);
    for (const match of links) {
      const destination = match[1] ?? match[2];
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(destination)) continue;
      checked++;
      try {
        const hash = destination.indexOf('#');
        const path = hash < 0 ? destination : destination.slice(0, hash);
        const fragment = hash < 0 ? '' : decodeURIComponent(destination.slice(hash + 1));
        const target = path ? resolve(dirname(file), decodeURIComponent(path)) : file;
        if (!exists(target)) errors.push(`${file}:${index + 1}: missing path: ${destination}`);
        else if (fragment && extname(target).toLowerCase() === '.md' && !anchors(read(target)).has(fragment)) {
          errors.push(`${file}:${index + 1}: missing heading: ${destination}`);
        }
      } catch (error) {
        if (!(error instanceof URIError)) throw error;
        errors.push(`${file}:${index + 1}: invalid URL encoding: ${destination}`);
      }
    }
  }
  return { checked, errors };
}

export function checkRepository(root) {
  const files = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    { cwd: root, encoding: 'utf8' }).split('\0')
    .filter(file => file.endsWith('.md') && existsSync(resolve(root, file)));
  if (!files.length) { console.log('[NOT_VERIFIED] docs - no Markdown files'); return 4; }
  let checked = 0;
  const errors = [];
  for (const file of new Set(files)) {
    const target = resolve(root, file);
    const result = checkDocument(target);
    checked += result.checked;
    errors.push(...result.errors);
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    console.error(`[FAIL] docs - ${errors.length} broken links`);
    return 1;
  }
  console.log(`[PASS] docs - ${checked} relative links checked`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = checkRepository(resolve(dirname(fileURLToPath(import.meta.url)), '..')); }
  catch (error) { console.error(`[ENVIRONMENT_ERROR] docs - ${error.message}`); process.exitCode = 2; }
}
