import assert from 'node:assert/strict';
import {randomBytes,randomUUID} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import {createCmsHandler} from '../server/cms-handler.mjs';
import {createGithubStore} from '../server/github-store.mjs';
import {passwordHash,encrypt,decrypt,issueSession,getSession} from '../server/cms-security.mjs';
import {GithubFixture} from './cms-github-fixture.mjs';

const origin='https://cms.example',password=randomBytes(24).toString('base64url'),env={CMS_GITHUB_TOKEN:'test-only',CMS_ADMIN_EMAIL:'admin@example.test',CMS_PASSWORD_HASH:await passwordHash(password),CMS_SECRET:randomBytes(32).toString('base64url'),CMS_ORIGIN:origin},repo=new GithubFixture(),handler=createCmsHandler(env,repo.fetch);
let cookie='',csrf='';
async function call(action,{method='GET',body,auth=true,from=origin,token=csrf,raw}={}) {
  const response=await handler(new Request(`${origin}/api/cms/${action}`,{method,headers:{...(auth&&cookie?{Cookie:cookie}:{}),...(method!=='GET'?{Origin:from,'Content-Type':'application/json','X-CMS-Token':token}: {})},body:raw??(body?JSON.stringify(body):undefined)}));
  return {status:response.status,headers:response.headers,data:await response.json()};
}
assert.equal((await createCmsHandler({})(new Request(`${origin}/api/cms/state`))).status,503);
assert.equal((await call('state',{auth:false})).status,401);assert.equal(repo.requests.length,0,'Ninguna lectura del repositorio sin sesión');
assert.equal((await call('draft',{auth:false})).status,401);
assert.equal((await call('login',{method:'POST',body:{email:env.CMS_ADMIN_EMAIL,password:'wrong'}})).status,401);
const login=await call('login',{method:'POST',body:{email:env.CMS_ADMIN_EMAIL,password}});assert.equal(login.status,200);
const setCookie=login.headers.get('set-cookie');for(const flag of ['HttpOnly','Secure','SameSite=Strict','Path=/'])assert.ok(setCookie.includes(flag));assert.ok(!setCookie.includes('Domain='));cookie=setCookie.split(';')[0];
const sessionRequest=new Request(origin,{headers:{Cookie:cookie}});assert.ok(getSession(sessionRequest,env));assert.equal(getSession(sessionRequest,env,Date.now()+9*60*60*1000),null);
assert.equal(getSession(sessionRequest,{...env,CMS_PASSWORD_HASH:await passwordHash(password)}),null,'Rotar la contraseña revoca las sesiones');
const tampered=()=>new Request(origin,{headers:{Cookie:cookie.slice(0,-5)+'00000'}});assert.equal(getSession(tampered(),env),null);
let state=(await call('state')).data;csrf=state.csrfToken;
const draft=structuredClone(state.draft);draft.copy.heroDescription='Texto privado de prueba que no debe aparecer en la web.';
const payload=()=>({content:draft,revision:state.revision,draftRevision:state.draftRevision});
assert.equal((await call('draft',{method:'PUT',body:payload(),token:''})).status,403);
assert.equal((await call('draft',{method:'PUT',body:payload(),from:'https://external.example'})).status,403);
assert.equal((await call('draft',{method:'PUT',raw:'{invalid'})).status,400);
assert.equal((await call('draft',{method:'PUT',raw:'null'})).status,400);
const invalid=structuredClone(draft);invalid.members.pop();assert.equal((await call('publish',{method:'POST',body:{...payload(),content:invalid}})).status,422);
let saved=await call('draft',{method:'PUT',body:payload()});assert.equal(saved.status,200);state=saved.data;
assert.notEqual(JSON.parse(repo.read('public/content/site.json')).copy.heroDescription,draft.copy.heroDescription);
assert.ok(!repo.read('.cms-data/draft.enc').toString().includes(draft.copy.heroDescription));
assert.equal(decrypt(repo.read('.cms-data/draft.enc').toString(),env.CMS_SECRET,'draft').content.copy.heroDescription,draft.copy.heroDescription);
assert.equal((await createGithubStore(env,repo.fetch).state()).draft.copy.heroDescription,draft.copy.heroDescription,'Borrador duradero tras recrear servidor');
const stale=payload();draft.copy.heroDescription+=' Segundo guardado.';
repo.race=()=>repo.change('unrelated.txt',Buffer.from('cambio ajeno más reciente'));
saved=await call('draft',{method:'PUT',body:payload()});assert.equal(saved.status,200);state=saved.data;
assert.equal(repo.read('unrelated.txt').toString(),'cambio ajeno más reciente','La publicación conserva cambios concurrentes ajenos');
assert.equal((await call('publish',{method:'POST',body:stale})).status,409);
const previous=repo.read('public/content/site.json').toString(),published=await call('publish',{method:'POST',body:payload()});assert.equal(published.status,200);state=published.data;
assert.equal(JSON.parse(repo.read('public/content/site.json')).copy.heroDescription,draft.copy.heroDescription);
const backups=[...repo.files().keys()].filter(path=>path.startsWith('.cms-data/backups/'));assert.equal(backups.length,1);assert.deepEqual(decrypt(repo.read(backups[0]).toString(),env.CMS_SECRET,'backup').content,JSON.parse(previous));
assert.equal((await call(`deployment?sha=${state.commit}`)).data.state,'pending');repo.status='success';assert.equal((await call(`deployment?sha=${state.commit}`)).data.state,'success');
assert.equal((await call('deployment?sha=invalid')).status,422);
const store=createGithubStore(env,repo.fetch),session=getSession(sessionRequest,env),smallImage=await readFile(new URL('../public/images/octavio-casas-480.webp',import.meta.url));
// 8 MB y 12 MB: verificamos el transporte dividido y la integridad byte a byte.
for(const [kind,size,prefix] of [['image',8*1024*1024,smallImage],['document',12*1024*1024,Buffer.from('%PDF-1.7\n')]]) {
  const bytes=Buffer.alloc(size);prefix.copy(bytes);const count=Math.ceil(size/(2*1024*1024)),uploadId=randomUUID(),tickets=[];
  for(let index=0;index<count;index++)tickets.push((await store.uploadPart({kind,size,count,uploadId,index,data:bytes.subarray(index*2*1024*1024,(index+1)*2*1024*1024).toString('base64')},session)).ticket);
  await assert.rejects(()=>store.upload({tickets},{csrf:'other-session'}),error=>error.status===422);
  await assert.rejects(()=>store.upload({tickets:[...tickets].reverse()},session),error=>error.status===422);
  const uploaded=await store.upload({tickets},session);assert.deepEqual(repo.read(`public${uploaded.url}`),bytes);
}
const badTicket=(await store.uploadPart({kind:'image',size:5,count:1,uploadId:randomUUID(),index:0,data:Buffer.from('hello').toString('base64')},session)).ticket;
await assert.rejects(()=>store.upload({tickets:[badTicket]},session),error=>error.status===422);
const expired=decrypt(badTicket,env.CMS_SECRET,'upload-ticket');expired.expires=0;await assert.rejects(()=>store.upload({tickets:[encrypt(expired,env.CMS_SECRET,'upload-ticket')]},session),error=>error.status===422);
assert.equal((await call('upload-part',{method:'POST',body:{}})).status,422);
const logout=await call('logout',{method:'POST',body:{}});assert.equal(logout.status,200);assert.ok(logout.headers.get('set-cookie').includes('Max-Age=0'));
repo.denied=true;const denied=await call('state');assert.equal(denied.status,503);assert.ok(!JSON.stringify(denied.data).includes('sensitive provider details'));
// Credenciales y borradores privados nunca deben formar parte de la salida estática.
const output=await readdir(new URL('../dist/',import.meta.url));for(const forbidden of ['.env.cms.local','cms','.cms-data','server','api'])assert.ok(!output.includes(forbidden));
console.log('CMS en línea: acceso, sesión/CSRF, borradores cifrados, respaldo, publicación atómica, conflictos, despliegue y archivos 8/12 MB verificados sin servicios externos.');
