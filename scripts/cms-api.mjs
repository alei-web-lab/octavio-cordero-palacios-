import {readFile,writeFile,mkdir,rename,realpath,lstat} from 'node:fs/promises';
import {randomBytes,randomUUID,createHash,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {validateContent,cleanContent} from '../src/content-schema.js';
export function createCmsApi(root,port) {
  const store=path.join(root,'cms'),liveFile=path.join(root,'public','content','site.json'),draftFile=path.join(store,'draft.json');
  const csrf=randomBytes(32).toString('hex');let queue=Promise.resolve();
  const revision=content=>createHash('sha256').update(JSON.stringify(content)).digest('hex');
  const json=(response,status,body)=>{response.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});response.end(JSON.stringify(body));};
  const read=async file=>JSON.parse(await readFile(file,'utf8'));
  const directory=async target=>{await mkdir(target,{recursive:true});if(await realpath(target)!==target || !(await lstat(target)).isDirectory()) throw new Error('Carpeta de contenido no válida.');};
  const atomic=async(file,content)=>{
    await directory(path.dirname(file));
    try {if((await lstat(file)).isSymbolicLink()) throw new Error('No se puede escribir sobre un enlace.');} catch(error) {if(error.code!=='ENOENT') throw error;}
    const temporary=path.join(path.dirname(file),`.cms-${randomUUID()}.tmp`);await writeFile(temporary,JSON.stringify(content,null,2)+'\n',{flag:'wx'});await rename(temporary,file);
  };
  const state=async()=>{const published=await read(liveFile);let draft;try{draft=await read(draftFile);}catch(error){if(error.code!=='ENOENT')throw error;draft=published;}return {published,draft,revision:revision(published),draftRevision:revision(draft),csrfToken:csrf,mode:'local'};};
  const body=async(request,limit=2*1024*1024)=>{
    if(!request.headers['content-type']?.startsWith('application/json'))throw Object.assign(new Error('Se requiere contenido JSON.'),{status:415});
    let size=0;const parts=[];for await(const part of request){size+=part.length;if(size>limit)throw Object.assign(new Error('El archivo supera el tamaño permitido.'),{status:413});parts.push(part);}
    try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw Object.assign(new Error('El contenido JSON no es válido.'),{status:400});}
  };
  const valid=content=>{const errors=validateContent(content);if(errors.length)throw Object.assign(new Error(errors.join(' ')),{status:422});return cleanContent(content);};
  const conflict=()=>Object.assign(new Error('El contenido cambió en otro panel. Recarga antes de guardar para evitar sobrescribirlo.'),{status:409});
  return async(request,response,pathname)=>{
    if(!pathname.startsWith('/api/cms/'))return false;
    const hosts=[`127.0.0.1:${port}`,`localhost:${port}`];
    if(!hosts.includes(request.headers.host)||!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(request.socket.remoteAddress)||request.headers['sec-fetch-site']==='cross-site'){json(response,403,{error:'El panel solo está disponible en este equipo.'});return true;}
    if(!['GET','HEAD'].includes(request.method)){
      const token=String(request.headers['x-cms-token']||'');
      if(request.headers.origin!==`http://${request.headers.host}`||!/^[0-9a-f]{64}$/.test(token)||!timingSafeEqual(Buffer.from(token),Buffer.from(csrf))){json(response,403,{error:'La sesión de edición venció. Recarga el panel.'});return true;}
    }
    try {
      if(pathname==='/api/cms/state'&&request.method==='GET')json(response,200,await state());
      else if(pathname==='/api/cms/draft'&&request.method==='GET')json(response,200,(await state()).draft);
      else if(pathname==='/api/cms/export'&&request.method==='GET'){response.setHeader('Content-Disposition','attachment; filename="renovacion-63-contenido.json"');json(response,200,(await state()).draft);}
      else if(['/api/cms/draft','/api/cms/publish'].includes(pathname)&&request.method===(pathname.endsWith('draft')?'PUT':'POST')){
        const input=await body(request),content=valid(input.content);
        const task=queue.then(async()=>{const previous=await state();if(input.revision!==previous.revision||input.draftRevision!==previous.draftRevision)throw conflict();if(pathname.endsWith('publish')){const backups=path.join(store,'backups');await directory(backups);await atomic(path.join(backups,`${Date.now()}-${randomUUID()}.json`),previous.published);await atomic(liveFile,content);}await atomic(draftFile,content);return state();});queue=task.catch(()=>{});json(response,200,await task);
      }else if(pathname==='/api/cms/upload'&&request.method==='POST'){
        const input=await body(request,18*1024*1024);
        if(typeof input.data!=='string'||!/^[A-Za-z0-9+/]+={0,2}$/.test(input.data))throw Object.assign(new Error('El archivo no es válido.'),{status:422});
        const bytes=Buffer.from(input.data,'base64'),limit=input.kind==='document'?12*1024*1024:8*1024*1024;
        if(!bytes.length||bytes.length>limit)throw Object.assign(new Error(`El archivo supera ${limit/1024/1024} MB.`),{status:413});
        let extension;if(input.kind==='document'&&bytes.subarray(0,5).toString()==='%PDF-')extension='pdf';
        else if(input.kind!=='document'){if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))extension='png';else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)extension='jpg';else if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP')extension='webp';}
        if(!extension)throw Object.assign(new Error(input.kind==='document'?'Selecciona un PDF válido.':'Selecciona una imagen JPG, PNG o WebP válida.'),{status:422});
        const uploads=path.join(root,'public','uploads');await directory(uploads);const filename=`${randomUUID()}.${extension}`;await writeFile(path.join(uploads,filename),bytes,{flag:'wx'});json(response,201,{url:`/uploads/${filename}`});
      }else json(response,405,{error:'Ruta o método de edición no disponible.'});
    }catch(error){json(response,error.status||500,{error:error.status?error.message:'No se pudo guardar el contenido. Revisa los permisos del proyecto y vuelve a intentarlo.'});}
    return true;
  };
}
