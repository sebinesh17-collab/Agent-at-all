import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const files = walk(root).filter((file) => !file.includes(`${path.sep}node_modules${path.sep}`));
const agents = fs.readdirSync(path.join(root, 'worker/agents/catalog')).filter((name) =>
  fs.existsSync(path.join(root, 'worker/agents/catalog', name, 'agent.ts'))
);
const tools = fs.readdirSync(path.join(root, 'worker/tools/catalog')).filter((name) => name.endsWith('.ts'));

test('project contains at least 300 TypeScript source files', () => {
  const count = files.filter((file) => /\.tsx?$/.test(file)).length;
  assert.ok(count >= 300, `Expected 300+ source files, found ${count}`);
});

test('every built-in agent has a prompt and tool permissions', () => {
  assert.ok(agents.length >= 50);
  for (const id of agents) {
    const dir = path.join(root, 'worker/agents/catalog', id);
    for (const file of ['agent.ts', 'prompt.ts', 'tools.ts']) assert.ok(fs.existsSync(path.join(dir, file)), `${id} missing ${file}`);
  }
});

test('tool catalog has unique IDs and individually addressable modules', () => {
  assert.ok(tools.length >= 100);
  const ids = tools.map((file) => {
    const source = fs.readFileSync(path.join(root, 'worker/tools/catalog', file), 'utf8');
    return source.match(/id: '([^']+)'/)?.[1];
  });
  assert.ok(ids.every(Boolean));
  assert.equal(new Set(ids).size, ids.length);
});

test('all relative TypeScript imports resolve to project files', () => {
  const sourceFiles = files.filter((file) => /\.tsx?$/.test(file));
  for (const file of sourceFiles) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
      const target = path.resolve(path.dirname(file), match[1]);
      const candidates = ['.ts', '.tsx', '.js', '.json'].map((extension) => target + extension);
      assert.ok(candidates.some(fs.existsSync) || fs.existsSync(path.join(target, 'index.ts')), `${file} imports missing ${match[1]}`);
    }
  }
});
