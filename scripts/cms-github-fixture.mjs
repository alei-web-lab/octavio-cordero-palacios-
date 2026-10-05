import {createHash} from 'node:crypto';
import {defaultContent} from '../src/default-content.js';

// Repositorio aislado en memoria: ninguna prueba contacta GitHub ni publica contenido.
export class GithubFixture {
  blobs=new Map();trees=new Map();commits=new Map();requests=[];head=null;race=null;status='pending';denied=false;
  constructor(){const content=this.blob(Buffer.from(JSON.stringify(defaultContent))),tree=this.tree(new Map([['public/content/site.json',content],['unrelated.txt',this.blob(Buffer.from('preservar'))]]));this.head=this.commit(tree,[]);}
  digest(type,bytes){return createHash('sha1').update(`${type} ${bytes.length}\0`).update(bytes).digest('hex');}
  blob(bytes){const sha=this.digest('blob',bytes);this.blobs.set(sha,bytes);return sha;}
  tree(files){const sha=this.digest('tree',Buffer.from(JSON.stringify([...files])));this.trees.set(sha,files);return sha;}
  commit(tree,parents){const sha=this.digest('commit',Buffer.from(JSON.stringify({tree,parents})));this.commits.set(sha,{sha,tree:{sha:tree},parents});return sha;}
  files(){return this.trees.get(this.commits.get(this.head).tree.sha);}
  read(path){return this.blobs.get(this.files().get(path));}
  change(path,bytes){const files=new Map(this.files());files.set(path,this.blob(bytes));this.head=this.commit(this.tree(files),[this.head]);}
  fetch=async(url,options={})=>{
    const route=new URL(url).pathname.replace('/repos/alei-web-lab/octavio-cordero-palacios-',''),method=options.method||'GET',body=options.body?JSON.parse(options.body):null;
    this.requests.push({route,method,body});
    const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
    if(this.denied)return reply({message:'sensitive provider details'},403);
    if(route==='/git/ref/heads/main')return reply({object:{sha:this.head}});
    if(route.startsWith('/git/commits/')&&method==='GET')return reply(this.commits.get(route.split('/').at(-1)));
    if(route.startsWith('/git/trees/')&&method==='GET')return reply({tree:[...this.trees.get(route.split('/').at(-1))].map(([path,sha])=>({path,sha,type:'blob'})),truncated:false});
    if(route.startsWith('/git/blobs/')&&method==='GET')return reply({content:this.blobs.get(route.split('/').at(-1)).toString('base64')});
    if(route==='/git/blobs'&&method==='POST')return reply({sha:this.blob(Buffer.from(body.content,'base64'))},201);
    if(route==='/git/trees'&&method==='POST'){const files=new Map(this.trees.get(body.base_tree));body.tree.forEach(item=>files.set(item.path,item.sha));return reply({sha:this.tree(files)},201);}
    if(route==='/git/commits'&&method==='POST')return reply({sha:this.commit(body.tree,body.parents)},201);
    if(route==='/git/refs/heads/main'&&method==='PATCH'){
      if(body.force!==false)throw new Error('La prueba prohíbe force push.');
      if(this.race){const race=this.race;this.race=null;race();}
      if(this.commits.get(body.sha).parents[0]!==this.head)return reply({message:'Reference update conflict'},422);
      this.head=body.sha;return reply({object:{sha:this.head}});
    }
    if(/^\/commits\/[0-9a-f]{40}\/status$/.test(route))return reply({statuses:[{context:'Vercel',state:this.status}]});
    throw new Error(`Ruta no prevista en la prueba: ${method} ${route}`);
  };
}
