import {useId,useState} from 'react';
export function Icon({name,className='',...props}) {return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...props}><use href={`/icons/sprite.svg?v=2#${name}`}/></svg>;}
export function Field({label,value,onChange,multiline=false,hint,type='text',required=false}) {
  const id=useId();return <div className="cms-field"><label htmlFor={id}>{label}</label>{multiline?<textarea id={id} value={value??''} onChange={event=>onChange(event.target.value)} rows={value?.length>250?5:3} maxLength={15000} required={required} aria-describedby={hint?`${id}-hint`:undefined}/>:<input id={id} type={type} value={value??''} onChange={event=>onChange(event.target.value)} maxLength={5000} required={required} aria-describedby={hint?`${id}-hint`:undefined}/>} {hint&&<p className="field-hint" id={`${id}-hint`}>{hint}</p>}</div>;
}
export function Upload({label='Cambiar imagen',kind='image',csrf,onUploaded,disabled=false}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('');const id=useId();
  async function upload(event) {
    const file=event.target.files?.[0];event.target.value='';if(!file)return;
    const limit=kind==='document'?12:8;
    if(file.size>limit*1024*1024){setError(`Selecciona un archivo de hasta ${limit} MB.`);return;}
    setBusy(true);setError('');
    try {
      const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=reject;reader.readAsDataURL(file);});
      const response=await fetch('/api/cms/upload',{method:'POST',headers:{'Content-Type':'application/json','X-CMS-Token':csrf},body:JSON.stringify({kind,data})});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'No se pudo subir el archivo.');onUploaded(result.url);
    }catch(error){setError(error.message||'No se pudo leer el archivo.');}finally{setBusy(false);}
  }
  return <div className="upload-control"><label className={`cms-button secondary upload-label ${disabled||busy?'is-disabled':''}`} htmlFor={id}><Icon name="upload"/>{busy?'Subiendo…':label}</label><input id={id} className="upload-input" type="file" accept={kind==='document'?'.pdf':'.jpg,.jpeg,.png,.webp'} disabled={busy||disabled} onChange={upload}/>{error&&<p className="cms-error" role="alert">{error}</p>}</div>;
}
