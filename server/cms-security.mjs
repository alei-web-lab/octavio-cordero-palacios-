import {createCipheriv,createDecipheriv,createHash,hkdfSync,randomBytes,scrypt,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';

const derivePassword=promisify(scrypt);
export const sessionCookie='__Host-renovacion_cms';
export const sessionSeconds=8*60*60;
export function equal(a,b){const left=createHash('sha256').update(String(a)).digest(),right=createHash('sha256').update(String(b)).digest();return timingSafeEqual(left,right);}
export function configured(env){return Boolean(env.CMS_GITHUB_TOKEN&&env.CMS_ADMIN_EMAIL&&/^scrypt\$[A-Za-z0-9_-]{22,}\$[A-Za-z0-9_-]{80,}$/.test(env.CMS_PASSWORD_HASH||'')&&/^[A-Za-z0-9_-]{43}$/.test(env.CMS_SECRET||''));}
export async function passwordHash(password){const salt=randomBytes(24).toString('base64url'),key=await derivePassword(password,salt,64,{N:32768,r:8,p:1,maxmem:128*1024*1024});return `scrypt$${salt}$${key.toString('base64url')}`;}
export async function verifyPassword(password,encoded){const [,salt,key]=encoded.split('$');const candidate=await derivePassword(password,salt,64,{N:32768,r:8,p:1,maxmem:128*1024*1024});return equal(candidate.toString('base64url'),key);}
function keyFor(secret,purpose){return Buffer.from(hkdfSync('sha256',Buffer.from(secret,'base64url'),'renovacion-63',purpose,32));}
export function encrypt(value,secret,purpose){const nonce=randomBytes(12),cipher=createCipheriv('aes-256-gcm',keyFor(secret,purpose),nonce);cipher.setAAD(Buffer.from(purpose));const bytes=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return [nonce,cipher.getAuthTag(),bytes].map(part=>part.toString('base64url')).join('.');}
export function decrypt(value,secret,purpose){const parts=String(value).split('.');if(parts.length!==3)throw new Error('Formato cifrado inválido.');const [nonce,tag,bytes]=parts.map(part=>Buffer.from(part,'base64url'));if(nonce.length!==12||tag.length!==16)throw new Error('Formato cifrado inválido.');const cipher=createDecipheriv('aes-256-gcm',keyFor(secret,purpose),nonce);cipher.setAAD(Buffer.from(purpose));cipher.setAuthTag(tag);return JSON.parse(Buffer.concat([cipher.update(bytes),cipher.final()]).toString('utf8'));}
export function issueSession(env,now=Date.now()){const session={csrf:randomBytes(32).toString('hex'),expires:now+sessionSeconds*1000,passwordVersion:createHash('sha256').update(env.CMS_PASSWORD_HASH).digest('hex')};return {session,cookie:`${sessionCookie}=${encrypt(session,env.CMS_SECRET,'session')}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${sessionSeconds}`};}
export function getSession(request,env,now=Date.now()){try{const cookie=(request.headers.get('cookie')||'').split(';').map(part=>part.trim()).find(part=>part.startsWith(`${sessionCookie}=`));if(!cookie)return null;const session=decrypt(cookie.slice(sessionCookie.length+1),env.CMS_SECRET,'session');if(session.expires<=now||!equal(session.passwordVersion,createHash('sha256').update(env.CMS_PASSWORD_HASH).digest('hex'))||!/^[0-9a-f]{64}$/.test(session.csrf))return null;return session;}catch{return null;}}
export const expiredCookie=`${sessionCookie}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
