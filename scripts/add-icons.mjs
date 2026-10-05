import {readFile,writeFile} from 'node:fs/promises';
const names={road:'road',shield:'shield-check',droplet:'droplet',search:'search',save:'device-floppy',eye:'eye',upload:'upload',photo:'photo',check:'circle-check',trash:'trash',refresh:'refresh',settings:'adjustments-horizontal',home:'home',facebook:'brand-facebook',instagram:'brand-instagram',tiktok:'brand-tiktok'};
const file=new URL('../public/icons/sprite.svg',import.meta.url);
let sprite=await readFile(file,'utf8');
const symbols=await Promise.all(Object.entries(names).filter(([id])=>!sprite.includes(`id="${id}"`)).map(async([id,name])=>{
  const url=`https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/${name}.svg`;
  const response=await fetch(url);if(!response.ok)throw new Error(`Icono no disponible: ${name}`);
  const svg=await response.text();const match=svg.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/);if(!match)throw new Error(`SVG inválido: ${name}`);const body=match[1];
  return `<!-- ${url} · Tabler Icons MIT -->\n<symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</symbol>`;
}));
sprite=sprite.replace('</svg>',symbols.join('\n')+'\n</svg>');await writeFile(file,sprite);
console.log(`${symbols.length} iconos oficiales añadidos.`);
