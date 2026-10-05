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
} catch {
  // Respaldo completo si el contenido no se puede leer.
}
export {siteContent};
