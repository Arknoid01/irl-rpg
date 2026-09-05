// Garde-fou D11 (docs/DECISIONS.md) : irl-rpg est 100 % on-device, pour
// toujours. Ce test échoue si un appel réseau apparaît dans www/js — le
// verrou « zéro cloud » n'est pas qu'une ligne de doc, il est vérifié en CI.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'www', 'js');

const FORBIDDEN = [
  { name: 'fetch(', rx: /\bfetch\s*\(/ },
  { name: 'XMLHttpRequest', rx: /XMLHttpRequest/ },
  { name: 'WebSocket(', rx: /\bWebSocket\s*\(/ },
  { name: 'navigator.sendBeacon', rx: /navigator\.sendBeacon/ },
];

function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir)) {
    const p = path.join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out = out.concat(walk(p));
    else if (entry.endsWith('.js')) out.push(p);
  }
  return out;
}

test('zéro appel réseau dans www/js (D11 — confidentialité verrouillée)', () => {
  const files = walk(ROOT);
  assert.ok(files.length > 10, 'sanity: www/js doit contenir du code');
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    for (const { name, rx } of FORBIDDEN) {
      assert.ok(!rx.test(src), `appel réseau interdit (${name}) détecté dans ${path.relative(ROOT, file)}`);
    }
  }
});
