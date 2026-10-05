import {build} from 'esbuild';
import {copyFile, mkdir, stat} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const browserOutput = resolve(project, '../public/motion/player.js');
const studioBrand = resolve(project, 'public/brand/campaign-wordmark-light.webp');

await mkdir(dirname(browserOutput), {recursive: true});
await mkdir(dirname(studioBrand), {recursive: true});
await copyFile(resolve(project, '../public/brand/campaign-wordmark-light.webp'), studioBrand);

await build({
  entryPoints: [resolve(project, 'src/player.tsx')],
  outfile: browserOutput,
  bundle: true,
  minify: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  define: {'process.env.NODE_ENV': '"production"'},
  legalComments: 'eof',
});

console.log(`Player listo: ${browserOutput} (${(await stat(browserOutput)).size} bytes)`);
