import {configured,equal,verifyPassword,issueSession,getSession,expiredCookie} from './cms-security.mjs';
import {createGithubStore,fail,repository} from './github-store.mjs';

const loginLimits=new Map();
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vercel-CDN-Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',Vary:'Cookie'};
const json=(status,value,extra={})=>new Response(JSON.stringify(value),{status,headers:{...headers,...extra}});
const clientState=({published,...state})=>state;
async function input(request) {
  if(!request.headers.get('content-type')?.startsWith('application/json'))throw fail('Se requiere contenido JSON.',415);
  const limit=3*1024*1024;if(Number(request.headers.get('content-length'))>limit)throw fail('La solicitud supera el tamaño permitido.',413);
  const reader=request.body?.getReader();if(!reader)throw fail('La solicitud está vacía.',400);
  let size=0;const parts=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw fail('La solicitud supera el tamaño permitido.',413);}parts.push(value);}
  try {const value=JSON.parse(Buffer.concat(parts).toString('utf8'));if(!value||typeof value!=='object'||Array.isArray(value))throw new Error();return value;}
  catch{throw fail('El contenido JSON no es válido.',400);}
}
export function createCmsHandler(env=process.env,fetcher=fetch){
  return async request=>{
    const url=new URL(request.url),action=url.pathname.split('/').filter(Boolean).at(-1),method=request.method;
    if(!configured(env))return json(503,{mode:'online',configured:false,error:'El acceso privado todavía está en configuración.'});
    try{
      const origin=env.CMS_ORIGIN||'https://octavio-cordero-palacios.vercel.app';
      if(!['GET','HEAD'].includes(method)&&request.headers.get('origin')!==origin)throw fail('La solicitud de edición no procede del panel.',403);
      if(action==='login'&&method==='POST'){
        const ip=request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-forwarded-for')||'unknown',now=Date.now();let attempts=loginLimits.get(ip);if(!attempts||attempts.until<now)attempts={count:0,until:now+10*60*1000};if(attempts.count>=8)return json(429,{error:'Espera unos minutos antes de volver a intentar.'},{'Retry-After':String(Math.ceil((attempts.until-now)/1000))});attempts.count++;loginLimits.set(ip,attempts);
        if(loginLimits.size>1000){for(const [key,value] of loginLimits)if(value.until<now)loginLimits.delete(key);while(loginLimits.size>1000)loginLimits.delete(loginLimits.keys().next().value);}
        const data=await input(request);if(typeof data.email!=='string'||data.email.length>254||typeof data.password!=='string'||data.password.length>512)throw fail('Correo o contraseña incorrectos.',401);
        const valid=await verifyPassword(data.password,env.CMS_PASSWORD_HASH);if(!valid||!equal(data.email.trim().toLowerCase(),env.CMS_ADMIN_EMAIL.trim().toLowerCase()))throw fail('Correo o contraseña incorrectos.',401);
        loginLimits.delete(ip);const {cookie}=issueSession(env);return json(200,{mode:'online'},{'Set-Cookie':cookie});
      }
      const session=getSession(request,env);if(!session)return json(401,{mode:'online',error:'Inicia sesión para editar la página.'});
      if(!['GET','HEAD'].includes(method)&&!equal(request.headers.get('x-cms-token')||'',session.csrf))throw fail('La sesión de edición venció. Recarga el panel.',403);
      if(action==='logout'&&method==='POST')return json(200,{ok:true},{'Set-Cookie':expiredCookie});
      if(action==='media'&&method==='GET'){const name=url.searchParams.get('file');if(!/^[0-9a-f-]{36}\.(?:png|jpg|webp)$/i.test(name||''))throw fail('La imagen no es válida.',422);return new Response(null,{status:307,headers:{...headers,Location:`https://raw.githubusercontent.com/${repository}/main/public/uploads/${name}`}});}
      const store=createGithubStore(env,fetcher);
      if(action==='state'&&method==='GET')return json(200,{...clientState(await store.state()),csrfToken:session.csrf});
      if(action==='draft'&&method==='GET')return json(200,(await store.state()).draft);
      if(action==='export'&&method==='GET')return json(200,(await store.state()).draft,{'Content-Disposition':'attachment; filename="renovacion-63-contenido.json"'});
      if(action==='deployment'&&method==='GET')return json(200,await store.deployment(url.searchParams.get('sha')));
      if((action==='draft'&&method==='PUT')||(action==='publish'&&method==='POST'))return json(200,{...clientState(await store.save(await input(request),action==='publish')),csrfToken:session.csrf});
      if(action==='upload-part'&&method==='POST')return json(201,await store.uploadPart(await input(request),session));
      if(action==='upload'&&method==='POST')return json(201,await store.upload(await input(request),session));
      return json(405,{error:'Ruta o método de edición no disponible.'});
    }catch(error){return json(error.status||500,{error:error.status?error.message:'No se pudo completar la operación. Vuelve a intentarlo.'});}
  };
}
