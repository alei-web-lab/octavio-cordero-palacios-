import {randomBytes} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {passwordHash} from '../server/cms-security.mjs';

const root=fileURLToPath(new URL('..',import.meta.url)),email=process.argv[2];
if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Indica el correo administrador como argumento.');
const target=path.join(root,'.env.cms.local');
try{await readFile(target);throw new Error('La configuración privada ya existe. No se reemplazará automáticamente.');}catch(error){if(error.code!=='ENOENT')throw error;}
const password=randomBytes(24).toString('base64url'),secret=randomBytes(32).toString('base64url'),hash=await passwordHash(password);
await writeFile(target,`CMS_GITHUB_TOKEN=\nCMS_ADMIN_EMAIL=${email}\nCMS_PASSWORD_HASH=${hash}\nCMS_SECRET=${secret}\nCMS_ORIGIN=https://octavio-cordero-palacios.vercel.app\n`,{flag:'wx',mode:0o600});
await mkdir(path.join(root,'cms'),{recursive:true});
await writeFile(path.join(root,'cms','acceso-online.txt'),`Acceso privado al CMS\n\nDirección: https://octavio-cordero-palacios.vercel.app/admin/\nCorreo: ${email}\nContraseña: ${password}\n\nEsta contraseña funcionará después de configurar las variables privadas en Vercel.\nConserva este archivo en privado; queda excluido de Git y del sitio publicado.\n`,{flag:'wx',mode:0o600});
console.log('Configuración privada creada en .env.cms.local. El acceso está en cms/acceso-online.txt; no se imprimieron las credenciales.');
