import { cp, lstat, mkdir, readdir, realpath, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('..', import.meta.url)));
const output = path.resolve(root, 'dist');
const source = path.join(root, 'src');
const assets = path.join(root, 'public');

// La limpieza solo puede afectar a la carpeta dist de este proyecto.
if (path.dirname(output) !== root || path.basename(output) !== 'dist') {
  throw new Error('La carpeta de salida no está dentro del proyecto.');
}

const indexInfo = await stat(path.join(root, 'index.html'));
const sourceInfo = await stat(source);
const assetsInfo = await stat(assets);
if (!indexInfo.isFile() || !sourceInfo.isDirectory() || !assetsInfo.isDirectory()) {
  throw new Error('Se necesitan index.html y las carpetas src y public para construir el sitio.');
}

const assetNames = await readdir(assets);
if (assetNames.some(name => ['index.html', 'src'].includes(name.toLowerCase()))) {
  throw new Error('public no puede contener index.html ni una carpeta src.');
}

try {
  const outputInfo = await lstat(output);
  if (outputInfo.isSymbolicLink() || !outputInfo.isDirectory()) {
    throw new Error('dist debe ser una carpeta normal para poder reconstruirla.');
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'index.html'), path.join(output, 'index.html'));
await cp(source, path.join(output, 'src'), { recursive: true });
for (const name of assetNames) {
  await cp(path.join(assets, name), path.join(output, name), { recursive: true });
}

console.log(`Sitio construido en: ${output}`);
