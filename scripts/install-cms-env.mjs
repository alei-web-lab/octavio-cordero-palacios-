import {readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {configured} from '../server/cms-security.mjs';

const root=fileURLToPath(new URL('..',import.meta.url));
const settings=Object.fromEntries((await readFile(path.join(root,'.env.cms.local'),'utf8')).trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
if(!configured(settings))throw new Error('Completa CMS_GITHUB_TOKEN en .env.cms.local antes de configurar Vercel.');
const project=JSON.parse(await readFile(path.join(root,'.vercel','project.json'),'utf8'));
if(project.orgId!=='team_8cbW4QXkgZL0AyvB79AJJ0PQ'||project.projectName!=='octavio-cordero-palacios-')throw new Error('Vercel no está vinculado al proyecto esperado del equipo alei.');
const cli=path.resolve(process.argv[2]||path.join(root,'.cms-test-vercel-tools','node_modules','vercel','dist','vc.js'));
for(const name of ['CMS_GITHUB_TOKEN','CMS_ADMIN_EMAIL','CMS_PASSWORD_HASH','CMS_SECRET','CMS_ORIGIN']) {
  await new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[cli,'env','add',name,'production','--sensitive','--yes','--force','--scope','alei','--global-config',path.join(root,'cms','vercel-auth'),'--no-color'],{cwd:root,windowsHide:true,stdio:['pipe','ignore','pipe']});
    // Los valores entran por stdin: nunca aparecen en argumentos, logs o historial.
    child.stdin.on('error',()=>{});child.stdin.end(settings[name]+'\n');
    child.on('error',reject);child.stderr.resume();child.on('close',code=>code===0?resolve():reject(new Error(`No se pudo configurar ${name}. Revisa el acceso a Vercel.`)));
  });
  console.log(`${name}: configurada como secreto de producción.`);
}
console.log('Variables preparadas. El próximo despliegue de producción activará el acceso privado.');
