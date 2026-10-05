import {defaultContent} from './default-content.js';
export const sectionIds = ['movimiento','plan','equipo','parroquia','contacto','preguntas'];
export const iconNames = ['road','leaf','community','shield','droplet','document','landscape','profile','map-pin'];
const string = (value,max=5000) => typeof value === 'string' && value.length <= max;
const localImage = value => value === '' || typeof value==='string' && /^\/(?:images|brand|uploads)\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g)$/i.test(value) && !value.includes('..') && !/busa|azuay-paisaje/i.test(value);
const url = value => typeof value==='string' && (value === '' || /^\/(?!\/)[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..') || /^https:\/\/[^\s]+$/i.test(value));
const object = value => value && typeof value === 'object' && !Array.isArray(value);
export function validateContent(value) {
  const errors = [];
  if (!object(value)) return ['El archivo debe contener un objeto de contenido.'];
  if (typeof value.preview !== 'boolean') errors.push('El estado de vista previa no es válido.');
  if (!object(value.copy) || Object.keys(defaultContent.copy).some(key => !string(value.copy[key]))) errors.push('Completa los textos de todas las secciones (máximo 5.000 caracteres por campo).');
  if (!object(value.brand) || !string(value.brand.name,100) || !value.brand.name.trim() || !string(value.brand.number,4) || !/^\d{1,4}$/.test(value.brand.number) || !string(value.brand.label,100) || !string(value.brand.slogan,200) || !localImage(value.brand.wordmark) || !value.brand.wordmark || !/^#[0-9a-f]{6}$/i.test(value.brand.accent)) errors.push('Revisa el nombre, número, frase, arte y color de la marca.');
  if (!object(value.seo) || !string(value.seo.title,150) || !string(value.seo.description,500)) errors.push('Revisa el título y la descripción del sitio.');
  if (!Array.isArray(value.members) || value.members.length !== 4 || value.members.some(member => !object(member) || !string(member.name,150) || !member.name.trim() || !string(member.role,100) || !member.role.trim() || !string(member.bio,10000) || !localImage(member.photo))) errors.push('El equipo debe tener cuatro integrantes, con nombre, rol y una imagen local válida.');
  if (!Array.isArray(value.photos) || value.photos.length < 1 || value.photos.length > 12 || value.photos.some(photo => !object(photo) || !localImage(photo.src) || !photo.src || photo.location !== 'Octavio Cordero Palacios' || ['alt','title','caption','author','license','creditNote'].some(key=>!string(photo[key],1500)) || !photo.alt.trim() || !photo.title.trim() || !url(photo.source) || !url(photo.licenseUrl))) errors.push('Incluye de una a doce fotografías de Octavio Cordero Palacios, con descripción y rutas válidas.');
  if (!Array.isArray(value.plan) || value.plan.length !== 6 || value.plan.some((plan,index)=>!object(plan) || plan.id !== defaultContent.plan[index].id || !string(plan.title,150) || !plan.title.trim() || !string(plan.description,5000) || !iconNames.includes(plan.icon) || !Array.isArray(plan.items) || plan.items.length < 1 || plan.items.length > 30 || plan.items.some(item=>!object(item) || !string(item.title,200) || !item.title.trim() || !string(item.text,15000)))) errors.push('Mantén los seis temas del plan y al menos una propuesta válida en cada uno.');
  if (!Array.isArray(value.faqs) || value.faqs.length > 30 || value.faqs.some(faq=>!object(faq) || !string(faq.question,300) || !faq.question.trim() || !string(faq.answer,10000))) errors.push('Revisa las preguntas y respuestas.');
  if (!object(value.contact) || Object.keys(defaultContent.contact).some(key=>!string(value.contact[key],300))) errors.push('Revisa los campos de contacto.');
  else {
    if (value.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.contact.email)) errors.push('El correo de contacto no es válido.');
    if (value.contact.phone && !/^[+\d ()-]{6,30}$/.test(value.contact.phone)) errors.push('El teléfono de contacto no es válido.');
    if (value.contact.whatsapp && !/^\d{8,15}$/.test(value.contact.whatsapp)) errors.push('WhatsApp debe contener entre 8 y 15 dígitos, con código de país.');
    if (['facebook','instagram','tiktok'].some(key=>value.contact[key] && !/^https:\/\/[^\s]+$/i.test(value.contact[key]))) errors.push('Las redes sociales deben utilizar enlaces HTTPS.');
  }
  if (!url(value.officialPlanUrl) || !string(value.planDownloadLabel,200) || typeof value.planProvided !== 'boolean') errors.push('Revisa el enlace y el rótulo del documento del plan.');
  if (!Array.isArray(value.navigation) || value.navigation.length !== 5 || value.navigation.some((entry,index)=>!object(entry) || entry.id !== defaultContent.navigation[index].id || !string(entry.label,100))) errors.push('Revisa los rótulos del menú.');
  if (!Array.isArray(value.sections) || value.sections.length !== sectionIds.length || new Set(value.sections.map(section=>section.id)).size !== sectionIds.length || value.sections.some(section=>!sectionIds.includes(section.id) || typeof section.enabled !== 'boolean')) errors.push('Revisa el orden y la visibilidad de las secciones.');
  return errors;
}
export function cleanContent(value) {
  const pick = (entry,keys)=>Object.fromEntries(keys.map(key=>[key,entry[key]]));
  return {version:1,preview:value.preview,brand:pick(value.brand,['name','number','label','slogan','wordmark','accent']),seo:pick(value.seo,['title','description']),copy:pick(value.copy,Object.keys(defaultContent.copy)),contact:pick(value.contact,Object.keys(defaultContent.contact)),plannedSocials:['Facebook','Instagram','TikTok'],officialPlanUrl:value.officialPlanUrl,planProvided:value.planProvided,planDownloadLabel:value.planDownloadLabel,navigation:value.navigation.map(entry=>pick(entry,['id','label'])),sections:value.sections.map(entry=>pick(entry,['id','enabled'])),photos:value.photos.map(entry=>pick(entry,['src','alt','title','caption','author','source','license','licenseUrl','creditNote','location'])),members:value.members.map(entry=>({...pick(entry,['name','role','photo','bio']),confirmed:true})),plan:value.plan.map(entry=>({...pick(entry,['id','title','description','icon']),items:entry.items.map(item=>pick(item,['title','text']))})),faqs:value.faqs.map(entry=>pick(entry,['question','answer']))};
}
