import {createContext,useContext,useId,useState} from 'react';
import {uploadFile} from './cms-api.js';
export const CmsContext=createContext({online:false});
export function Icon({name,className='',...props}) {return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...props}><use href={`/icons/sprite.svg?v=2#${name}`}/></svg>;}
export function Field({label,value,onChange,multiline=false,hint,type='text',required=false}) {
  const id=useId();return <div className="cms-field"><label htmlFor={id}>{label}</label>{multiline?<textarea id={id} value={value??''} onChange={event=>onChange(event.target.value)} rows={value?.length>250?5:3} maxLength={15000} required={required} aria-describedby={hint?`${id}-hint`:undefined}/>:<input id={id} type={type} value={value??''} onChange={event=>onChange(event.target.value)} maxLength={5000} required={required} aria-describedby={hint?`${id}-hint`:undefined}/>} {hint&&<p className="field-hint" id={`${id}-hint`}>{hint}</p>}</div>;
}
export function Upload({label='Cambiar imagen',kind='image',csrf,onUploaded,disabled=false}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[progress,setProgress]=useState(0);const id=useId(),context=useContext(CmsContext);
  async function upload(event) {
    const file=event.target.files?.[0];event.target.value='';if(!file)return;
    const limit=kind==='document'?12:8;
    if(!file.size||file.size>limit*1024*1024){setError(`Selecciona un archivo de hasta ${limit} MB que no esté vacío.`);return;}
    setBusy(true);setError('');setProgress(0);context.onUploading?.(true);
    try {
      const result=await uploadFile(file,{kind,csrf,online:context.online,onProgress:setProgress});onUploaded(result.url);
    }catch(error){setError(error.message||'No se pudo leer el archivo.');if(error.status===401)context.onUnauthorized?.();}finally{setBusy(false);context.onUploading?.(false);}
  }
  return <div className="upload-control"><label className={`cms-button secondary upload-label ${disabled||busy?'is-disabled':''}`} htmlFor={id}><Icon name="upload"/>{busy?`Subiendo${progress?` · ${progress}%`:'…'}`:label}</label><input id={id} className="upload-input" type="file" accept={kind==='document'?'.pdf':'.jpg,.jpeg,.png,.webp'} disabled={busy||disabled||context.uploading} onChange={upload}/>{busy&&<span className="upload-status" role="status">Mantén el panel abierto hasta completar la carga.</span>}{error&&<p className="cms-error" role="alert">{error}</p>}</div>;
}
