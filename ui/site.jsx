import {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Icon} from './shared.jsx';
const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function ThemeGraphic({plan}) {
  return <div className="theme-graphic" aria-hidden="true"><span className="theme-orbit"/><span className="theme-orbit inner"/><span className="theme-symbol" key={plan.id}><Icon name={plan.icon}/></span><div className="theme-branches">{plan.items.map((_,index)=><span key={index} style={{'--branch-index':index}}/>)}</div></div>;
}
function PlanExplorer({content}) {
  const [active,setActive]=useState(0),[query,setQuery]=useState('');const panel=useRef(null),tabs=useRef([]);
  const plan=content.plan[active];const term=normalize(query.trim());
  const results=term?content.plan.flatMap((entry,index)=>entry.items.filter(item=>normalize(`${entry.title} ${item.title} ${item.text}`).includes(term)).map(item=>({planIndex:index,item}))):[];
  useEffect(()=>{const choose=event=>{const index=content.plan.findIndex(entry=>entry.id===event.detail);if(index>=0){setQuery('');setActive(index);}};window.addEventListener('choose-plan',choose);return()=>window.removeEventListener('choose-plan',choose);},[content.plan]);
  useEffect(()=>{
    const list=tabs.current[active]?.parentElement;if(!list)return;
    const keepVisible=()=>{const rect=list.getBoundingClientRect();if(rect.top>=0&&rect.bottom<=innerHeight)tabs.current[active]?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});};
    const resize=new ResizeObserver(keepVisible),arrival=new IntersectionObserver(keepVisible,{threshold:1});resize.observe(list);arrival.observe(list);
    return()=>{resize.disconnect();arrival.disconnect();};
  },[active,term]);
  function activate(index,keyboard=false) {
    setActive(index);
    if(keyboard) tabs.current[index]?.focus({preventScroll:true});
    else if(panel.current&&!matchMedia('(prefers-reduced-motion:reduce)').matches){panel.current.getAnimations().forEach(animation=>animation.cancel());panel.current.animate([{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.16,1,.3,1)'});}
  }
  return <div className="plan-explorer"><div className="plan-search"><Icon name="search"/><label className="sr-only" htmlFor="plan-search-input">{content.copy.planSearch}</label><input id="plan-search-input" type="search" placeholder={`${content.copy.planSearch}…`} value={query} onChange={event=>setQuery(event.target.value)} autoComplete="off" maxLength={100}/>{query&&<button aria-label="Limpiar búsqueda" onClick={()=>setQuery('')}><Icon name="close"/></button>}</div>
    {term?<div className="plan-search-results"><p role="status">{results.length?`${results.length} ${results.length===1?'coincidencia':'coincidencias'}`:'No encontramos propuestas con ese texto. Prueba con «agua», «caminos» o «cultura».'}</p>{results.map(({planIndex,item},index)=><article key={`${planIndex}-${index}`}><span>{content.plan[planIndex].title}</span><h3>{item.title}</h3><p>{item.text}</p><button className="text-link" onClick={()=>{setQuery('');activate(planIndex);}}>Ver este tema <Icon name="arrow-up-right"/></button></article>)}</div>:<>
    <div className="plan-tabs" role="tablist" aria-label="Temas del plan de trabajo">{content.plan.map((entry,index)=><button ref={node=>{tabs.current[index]=node;}} key={entry.id} id={`tab-${entry.id}`} className="plan-tab" role="tab" aria-controls={`panel-${entry.id}`} aria-selected={active===index} tabIndex={active===index?0:-1} onClick={event=>activate(index,event.detail===0)} onKeyDown={event=>{let next;if(event.key==='ArrowRight')next=(index+1)%content.plan.length;if(event.key==='ArrowLeft')next=(index+content.plan.length-1)%content.plan.length;if(event.key==='Home')next=0;if(event.key==='End')next=content.plan.length-1;if(next!==undefined){event.preventDefault();activate(next,true);tabs.current[next]?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}}}><Icon name={entry.icon}/>{entry.title}</button>)}</div>
    <div ref={panel} className="plan-panel" id={`panel-${plan.id}`} role="tabpanel" aria-labelledby={`tab-${plan.id}`}><div className="plan-intro"><ThemeGraphic plan={plan}/><h3>{plan.title}</h3><p>{plan.description}</p><span className="proposal-count">{plan.items.length} propuestas en este tema</span></div><div className="plan-details">{plan.items.map((item,index)=><details key={`${plan.id}-${index}`} open={index===0?true:undefined}><summary><span>{item.title}</span><span className="disclosure-mark"><Icon name="plus"/><Icon name="minus"/></span></summary><p>{item.text}</p></details>)}</div></div>
    </>}
    <div className="print-all-plans">{content.plan.map(entry=><section key={entry.id}><h3>{entry.title}</h3><p>{entry.description}</p>{entry.items.map((item,index)=><div key={index}><h4>{item.title}</h4><p>{item.text}</p></div>)}</section>)}</div>
  </div>;
}
function Discovery({content}) {return <div className="discovery"><div><h3>{content.copy.discoveryTitle}</h3><p>{content.copy.discoveryText}</p></div><div className="discovery-links">{content.plan.map(plan=><a key={plan.id} href="#plan" onClick={()=>window.dispatchEvent(new CustomEvent('choose-plan',{detail:plan.id}))}><Icon name={plan.icon}/><span>{plan.title}</span><Icon name="arrow-up-right"/></a>)}</div></div>;}
function PhotoViewer({photos,index,onClose,onChange}) {
  const dialog=useRef(null);const photo=photos[index];
  useEffect(()=>{if(photo&&!dialog.current.open)dialog.current.showModal();},[photo]);
  if(!photo)return null;
  return <dialog ref={dialog} className="photo-viewer" aria-labelledby="photo-viewer-title" onClose={onClose} onClick={event=>{if(event.target===event.currentTarget)dialog.current.close();}} onKeyDown={event=>{if(event.key==='ArrowRight')onChange((index+1)%photos.length);if(event.key==='ArrowLeft')onChange((index+photos.length-1)%photos.length);}}><div className="viewer-toolbar"><span>{index+1} / {photos.length}</span><button className="viewer-close" aria-label="Cerrar fotografía" onClick={()=>dialog.current.close()}><Icon name="close"/></button></div><figure><img src={photo.src} alt={photo.alt}/><figcaption><div><h3 id="photo-viewer-title">{photo.title}</h3><p>{photo.caption}</p><p className="viewer-credit">{photo.author} · {photo.license}</p></div><div className="viewer-controls"><button aria-label="Fotografía anterior en el visor" onClick={()=>onChange((index+photos.length-1)%photos.length)}><Icon name="chevron-left"/></button><button aria-label="Fotografía siguiente en el visor" onClick={()=>onChange((index+1)%photos.length)}><Icon name="chevron-right"/></button></div></figcaption></figure></dialog>;
}
export function mountInteractiveSite(content) {
  createRoot(document.getElementById('plan-react')).render(<PlanExplorer content={content}/>);
  createRoot(document.getElementById('discovery-react')).render(<Discovery content={content}/>);
  const root=createRoot(document.getElementById('photo-viewer-root'));let current=-1;
  const render=index=>{current=index;root.render(<PhotoViewer photos={content.photos} index={index} onClose={()=>render(-1)} onChange={render}/>);};render(current);
  return {openPhoto:render};
}
