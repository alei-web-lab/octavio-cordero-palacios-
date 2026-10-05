import http from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {createCmsApi} from './cms-api.mjs';

const root = await realpath(fileURLToPath(new URL('..', import.meta.url)));
const publicRoot = path.join(root, 'public');
const port = 3000;
const handleCms = createCmsApi(root,port);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
};
const shortCacheExtensions = new Set([
  '.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.ico',
  '.woff', '.woff2', '.ttf', '.otf',
]);

function isInside(base, candidate) {
  const relative = path.relative(base, candidate);
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function reply(request, response, status, message) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(request.method === 'HEAD' ? undefined : message);
}

const server = http.createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  let pathname;
  try {
    pathname = decodeURIComponent((request.url || '/').split('?')[0]);
  } catch {
    reply(request, response, 400, 'Ruta no válida.');
    return;
  }

  if (!pathname.startsWith('/') || pathname.includes('\\') || pathname.includes('\0') || pathname.split('/').some(segment => segment === '.' || segment === '..')) {
    reply(request, response, 400, 'Ruta no válida.');
    return;
  }

  let allowedRoot;
  if (await handleCms(request,response,pathname)) return;
  if (!['GET','HEAD'].includes(request.method)) {response.setHeader('Allow','GET, HEAD');reply(request,response,405,'Método no permitido.');return;}
  if (pathname === '/admin' || pathname === '/admin/') pathname = '/admin/index.html';
  let candidate;
  if (pathname === '/' || pathname === '/index.html') {
    allowedRoot = root;
    candidate = path.join(root, 'index.html');
  } else if (pathname.startsWith('/src/')) {
    allowedRoot = path.join(root, 'src');
    candidate = path.resolve(root, `.${pathname}`);
  } else {
    allowedRoot = publicRoot;
    candidate = path.resolve(publicRoot, `.${pathname}`);
  }

  if (!isInside(allowedRoot, candidate)) {
    reply(request, response, 400, 'Ruta no válida.');
    return;
  }

  try {
    const [resolvedRoot, resolvedFile] = await Promise.all([realpath(allowedRoot), realpath(candidate)]);
    if ((resolvedRoot !== root && !isInside(root, resolvedRoot)) || !isInside(resolvedRoot, resolvedFile)) {
      reply(request, response, 403, 'Acceso no permitido.');
      return;
    }
    const info = await stat(resolvedFile);
    if (!info.isFile()) {
      reply(request, response, 404, 'Archivo no encontrado.');
      return;
    }
    const extension = path.extname(resolvedFile).toLowerCase();
    const etag = `W/"${info.size.toString(16)}-${info.mtimeMs.toString(16)}"`;
    response.setHeader('ETag', etag);
    response.setHeader('Cache-Control', shortCacheExtensions.has(extension)
      ? 'public, max-age=300'
      : 'no-cache');

    // GET y HEAD comparan If-None-Match con validación débil, también en listas.
    const ifNoneMatch = request.headers['if-none-match'];
    const unchanged = typeof ifNoneMatch === 'string' && ifNoneMatch.split(',').some(value => {
      const candidateTag = value.trim();
      return candidateTag === '*' || candidateTag.replace(/^W\//, '') === etag.slice(2);
    });
    if (unchanged) {
      response.writeHead(304);
      response.end();
      return;
    }
    response.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'Content-Length': info.size,
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    const stream = createReadStream(resolvedFile);
    stream.on('error', () => response.destroy());
    stream.pipe(response);
  } catch (error) {
    if (['ENOENT', 'ENOTDIR'].includes(error.code)) {
      reply(request, response, 404, 'Archivo no encontrado.');
    } else {
      console.error('No se pudo servir un archivo:', error.message);
      reply(request, response, 500, 'No se pudo abrir el archivo.');
    }
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `El puerto ${port} está ocupado. Cierra el servidor anterior y vuelve a intentarlo.`
    : `No se pudo iniciar el servidor: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Vista local: http://127.0.0.1:${port}`);
  console.log('Para detener el servidor, presiona Ctrl+C.');
});
