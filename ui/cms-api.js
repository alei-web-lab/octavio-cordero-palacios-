export async function cmsRequest(action,{method='GET',body,csrf,signal}={}) {
  let response;
  try {
    response=await fetch(`/api/cms/${action}`,{method,credentials:'same-origin',cache:'no-store',signal,headers:{...(body?{'Content-Type':'application/json'}:{}),...(csrf?{'X-CMS-Token':csrf}:{})},body:body?JSON.stringify(body):undefined});
  } catch(error) {
    if(error.name==='AbortError')throw error;
    throw new Error('No hay conexión con el panel. Tus cambios siguen en el editor.');
  }
  const result=await response.json().catch(()=>({error:'El servidor no pudo completar la operación. Vuelve a intentarlo.'}));
  if(!response.ok)throw Object.assign(new Error(result.error||'No se pudo completar la operación.'),{status:response.status});
  return result;
}

export function previewMedia(url,online) {
  return online&&/^\/uploads\/[0-9a-f-]{36}\.(?:png|jpg|webp)$/i.test(url||'')?`/api/cms/media?file=${encodeURIComponent(url.split('/').at(-1))}`:url;
}

// La caché del estado de publicación es opcional; nunca bloquea el guardado.
export const publicationCache={
  get(){try{return sessionStorage.getItem('cms-publish');}catch{return null;}},
  set(commit){try{sessionStorage.setItem('cms-publish',commit);}catch{}},
  remove(){try{sessionStorage.removeItem('cms-publish');}catch{}}
};

const readBase64=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('No se pudo leer el archivo.'));reader.readAsDataURL(blob);});
export async function uploadFile(file,{kind,csrf,online,onProgress}) {
  if(!online)return cmsRequest('upload',{method:'POST',csrf,body:{kind,data:await readBase64(file)}});
  const chunkSize=2*1024*1024,count=Math.ceil(file.size/chunkSize),uploadId=crypto.randomUUID(),tickets=[];
  for(let index=0;index<count;index++) {
    const data=await readBase64(file.slice(index*chunkSize,(index+1)*chunkSize));
    const part=await cmsRequest('upload-part',{method:'POST',csrf,body:{kind,uploadId,index,count,size:file.size,data}});
    tickets.push(part.ticket);onProgress?.(Math.round((index+1)/(count+1)*100));
  }
  const result=await cmsRequest('upload',{method:'POST',csrf,body:{tickets}});onProgress?.(100);return result;
}
