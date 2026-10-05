import {defaultContent} from './default-content.js';
import {validateContent,cleanContent} from './content-schema.js';
let siteContent = defaultContent;
try {
  const draft = new URLSearchParams(location.search).get('editor-preview') === '1';
  const response = await fetch(draft ? '/api/cms/draft' : '/content/site.json', {cache:'no-cache'});
  if (!response.ok) throw new Error('Contenido no disponible');
  const candidate = await response.json();
  if (validateContent(candidate).length) throw new Error('Contenido no válido');
  siteContent = cleanContent(candidate);
  if(draft&&new URLSearchParams(location.search).get('cms-online')==='1') {
    const media=url=>/^\/uploads\/[0-9a-f-]{36}\.(png|jpg|webp)$/i.test(url||'')?`/api/cms/media?file=${encodeURIComponent(url.split('/').at(-1))}`:url;
    siteContent.brand.wordmark=media(siteContent.brand.wordmark);
    siteContent.members.forEach(member=>{member.photo=media(member.photo);});
    siteContent.photos.forEach(photo=>{photo.src=media(photo.src);});
  }
} catch {
  // Respaldo público, acompañado de un aviso si falló una vista previa privada.
  if(new URLSearchParams(location.search).get('editor-preview')==='1') {
    const notice=document.createElement('div');notice.className='editor-preview-alert';notice.setAttribute('role','alert');
    notice.textContent='No pudimos cargar el borrador privado. Esta vista muestra el contenido de respaldo. ';
    const link=document.createElement('a');link.href='/admin/';link.textContent='Volver al panel';notice.append(link);document.body.prepend(notice);
  }
}
export {siteContent};
