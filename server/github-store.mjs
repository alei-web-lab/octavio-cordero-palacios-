import {randomUUID} from 'node:crypto';
import {encrypt,decrypt} from './cms-security.mjs';
import {validateContent,cleanContent} from '../src/content-schema.js';

export const repository='alei-web-lab/octavio-cordero-palacios-';
const publishedPath='public/content/site.json',draftPath='.cms-data/draft.enc';
export const fail=(message,status=500)=>Object.assign(new Error(message),{status});
export function validated(content){const errors=validateContent(content);if(errors.length)throw fail(errors.join(' '),422);return cleanContent(content);}
export function createGithubStore(env,fetcher=fetch){
  async function api(route,method='GET',body){
    const response=await fetcher(`https://api.github.com/repos/${repository}${route}`,{method,headers:{Authorization:`Bearer ${env.CMS_GITHUB_TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json','User-Agent':'Renovacion63-CMS'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
    if(!response.ok){if([401,403,404].includes(response.status))throw fail('No se pudo conectar el panel con su repositorio. Revisa el acceso de publicación.',503);throw fail('No se pudo guardar en el repositorio. Vuelve a intentarlo.',[409,422].includes(response.status)?409:502);}
    return response.status===204?null:response.json();
  }
  const blob=async sha=>{const item=await api(`/git/blobs/${sha}`);return Buffer.from(item.content.replace(/\s/g,''),'base64');};
  async function snapshot(){const ref=await api('/git/ref/heads/main'),commit=await api(`/git/commits/${ref.object.sha}`),tree=await api(`/git/trees/${commit.tree.sha}?recursive=1`);if(tree.truncated)throw fail('El repositorio es demasiado grande para esta configuración.');return {head:ref.object.sha,tree:commit.tree.sha,files:new Map(tree.tree.filter(item=>item.type==='blob').map(item=>[item.path,item.sha]))};}
  async function readState(snap){const liveSha=snap.files.get(publishedPath),draftSha=snap.files.get(draftPath);if(!liveSha)throw fail('No se encontró el contenido publicado.');const [liveBytes,draftBytes]=await Promise.all([blob(liveSha),draftSha?blob(draftSha):null]);let live,draft;try{live=validated(JSON.parse(liveBytes.toString('utf8')));draft=draftBytes?validated(decrypt(draftBytes.toString('utf8'),env.CMS_SECRET,'draft').content):live;}catch(error){if(error.status===422)throw error;throw fail('No se pudo abrir el borrador privado. Revisa la configuración del panel.');}return {published:live,draft,revision:liveSha,draftRevision:draftSha||liveSha,mode:'online'};}
  const createBlob=async bytes=>(await api('/git/blobs','POST',{content:Buffer.from(bytes).toString('base64'),encoding:'base64'})).sha;
  async function commitFiles(snap,files,message){const elements=await Promise.all(files.map(async item=>({path:item.path,mode:'100644',type:'blob',sha:item.sha||await createBlob(item.bytes)})));const tree=await api('/git/trees','POST',{base_tree:snap.tree,tree:elements}),commit=await api('/git/commits','POST',{message,tree:tree.sha,parents:[snap.head]});await api('/git/refs/heads/main','PATCH',{sha:commit.sha,force:false});return commit.sha;}
  async function state(){return readState(await snapshot());}
  async function save(input,publish){const content=validated(input.content);for(let attempt=0;attempt<3;attempt++){const snap=await snapshot(),previous=await readState(snap);if(input.revision!==previous.revision||input.draftRevision!==previous.draftRevision)throw fail('El contenido cambió en otro panel. Exporta tus cambios y recarga antes de guardar.',409);const files=[{path:draftPath,bytes:encrypt({content},env.CMS_SECRET,'draft')}];if(publish)files.push({path:publishedPath,bytes:JSON.stringify(content,null,2)+'\n'},{path:`.cms-data/backups/${Date.now()}-${randomUUID()}.enc`,bytes:encrypt({content:previous.published,at:new Date().toISOString()},env.CMS_SECRET,'backup')});try{const commit=await commitFiles(snap,files,publish?'CMS: publicar contenido del sitio':'CMS: guardar borrador privado');return {...await state(),commit,publishing:publish};}catch(error){if(error.status!==409||attempt===2)throw error;}}}
  async function uploadPart(input,session){
    const {uploadId,index,count,size,kind,data}=input,limit=kind==='document'?12*1024*1024:8*1024*1024;
    if(!/^[0-9a-f-]{36}$/.test(uploadId)||!Number.isInteger(index)||!Number.isInteger(count)||index<0||index>=count||count<1||count>6||!Number.isInteger(size)||size<1||size>limit||count!==Math.ceil(size/(2*1024*1024))||!['image','document'].includes(kind)||typeof data!=='string'||!/^[A-Za-z0-9+/]+={0,2}$/.test(data))throw fail('El archivo no es válido.',422);
    const bytes=Buffer.from(data,'base64'),expected=Math.min(2*1024*1024,size-index*2*1024*1024);if(bytes.length!==expected||bytes.toString('base64')!==data)throw fail('Una parte del archivo no es válida.',422);
    const sha=await createBlob(encrypt({data},env.CMS_SECRET,'upload-part'));
    return {ticket:encrypt({sha,uploadId,index,count,size,kind,session:session.csrf,expires:Date.now()+30*60*1000},env.CMS_SECRET,'upload-ticket')};
  }
  async function upload(input,session){
    if(!Array.isArray(input.tickets)||input.tickets.length<1||input.tickets.length>6)throw fail('El archivo no es válido.',422);
    let parts;try{parts=input.tickets.map(ticket=>decrypt(ticket,env.CMS_SECRET,'upload-ticket'));}catch{throw fail('La carga venció. Selecciona el archivo nuevamente.',422);}
    const first=parts[0];if(parts.some((part,index)=>part.index!==index||part.count!==parts.length||part.uploadId!==first.uploadId||part.size!==first.size||part.kind!==first.kind||part.session!==session.csrf||part.expires<Date.now()))throw fail('La carga venció o sus partes no coinciden.',422);
    const buffers=await Promise.all(parts.map(async part=>{const stored=decrypt((await blob(part.sha)).toString('utf8'),env.CMS_SECRET,'upload-part');return Buffer.from(stored.data,'base64');})),bytes=Buffer.concat(buffers);if(bytes.length!==first.size)throw fail('El archivo está incompleto.',422);
    let extension;if(first.kind==='document'&&bytes.subarray(0,5).toString()==='%PDF-')extension='pdf';else if(first.kind==='image'){if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))extension='png';else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)extension='jpg';else if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP')extension='webp';}if(!extension)throw fail('Selecciona una imagen JPG, PNG o WebP, o un PDF válido.',422);
    const filename=`${randomUUID()}.${extension}`,sha=await createBlob(bytes);for(let attempt=0;attempt<3;attempt++){try{const commit=await commitFiles(await snapshot(),[{path:`public/uploads/${filename}`,sha}],'CMS: añadir archivo público');return {url:`/uploads/${filename}`,commit};}catch(error){if(error.status!==409||attempt===2)throw error;}}
  }
  async function deployment(sha){if(!/^[0-9a-f]{40}$/.test(sha))throw fail('La versión no es válida.',422);const result=await api(`/commits/${sha}/status`),status=result.statuses.find(item=>item.context==='Vercel');return {state:status?.state||'pending',url:'https://octavio-cordero-palacios.vercel.app/'};}
  return {state,save,uploadPart,upload,deployment};
}
