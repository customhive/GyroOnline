// Bundles src/ into game.js and stamps it with the version shown on screen:
// the number from package.json plus the time of this build.
//   node tools/build.mjs [--watch]
import { build, context } from 'esbuild';
import fs from 'node:fs';

const watch = process.argv.includes('--watch');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const pad = (n) => String(n).padStart(2, '0');
const d = new Date();
const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const options = {
  entryPoints: ['src/main.js'], bundle: true, format: 'iife', target: 'es2020', outfile: 'game.js',
  minify: !watch, sourcemap: watch,
  define: { __VERSION__: JSON.stringify(pkg.version), __BUILD__: JSON.stringify(watch ? 'dev' : stamp) },
};
if (watch) { await (await context(options)).watch(); console.log('watching…'); }
else { await build(options); console.log(`built game.js  v${pkg.version} · ${stamp}`); }
