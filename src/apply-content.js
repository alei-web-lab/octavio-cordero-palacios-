export function applyContent(content) {
  const labels={
    '.hero-description':'heroDescription','.hero-actions .button':'heroPrimary','.hero-actions .text-link':'heroSecondary','.location':'heroLocation',
    '.guide-inner>span':'guideIntro','.guide-inner a[href="#equipo"]':'guideTeam','.guide-inner a[href="#plan"]':'guidePlan','.guide-inner a[href="#contacto"]':'guideContact',
    '#movement-title':'movementTitle','.movement-copy .lead':'movementLead','.movement-copy>p:nth-of-type(2)':'movementBody','.content-note p':'movementNote','.movement-heading .text-link':'movementLink',
    '#plan-title':'planTitle','.plan-section .section-heading p':'planDescription','#print-plan':'planPrint','.plan-footnote':'planFootnote',
    '#team-title':'teamTitle','.team-section .section-heading p:first-of-type':'teamDescription','.section-side-note':'teamNote',
    '#gallery-title':'galleryTitle','.gallery-section .section-heading p':'galleryDescription','#show-credits':'creditsButton',
    '#contact-title':'contactTitle','.contact-copy>p:first-of-type':'contactDescription','.contact-form h3':'formTitle','#form-description':'formDescription',
    'label[for="contact-name"]':'nameLabel','label[for="contact-email"]':'emailLabel','label[for="contact-topic"]':'topicLabel','label[for="contact-message"]':'messageLabel','.form-privacy':'formPrivacy','.contact-form button[type="submit"]':'formButton',
    '#faq-title':'faqTitle','.footer-top>p':'footerText','.footer-top .text-link':'footerTop','.footer-bottom>span:nth-child(2)':'footerNote','#privacy-toggle':'privacyButton','#privacy-details p':'privacyText'
  };
  const replace=(node,text)=>{
    if(!node)return;
    const svg=node.querySelector(':scope>svg');
    node.textContent=text;if(svg)node.append(' ',svg);
  };
  for(const [selector,key] of Object.entries(labels))replace(document.querySelector(selector),content.copy[key]);
  document.title=content.seo.title;
  document.querySelector('meta[name="description"]').content=content.seo.description;
  document.querySelector('meta[name="theme-color"]').content=content.brand.accent;
  document.documentElement.style.setProperty('--accent',content.brand.accent);
  const channels=content.brand.accent.slice(1).match(/../g).map(value=>parseInt(value,16));
  const dark='#'+channels.map(value=>Math.round(value*.48).toString(16).padStart(2,'0')).join('');
  document.documentElement.style.setProperty('--accent-dark',dark);
  document.querySelectorAll('.brand-number').forEach(node=>{node.textContent=content.brand.number;});
  document.querySelectorAll('.brand-name').forEach(node=>{node.textContent=content.brand.label;});
  document.querySelector('.hero-stamp strong').textContent=content.brand.number;
  document.querySelector('#hero-title .sr-only').textContent=content.brand.slogan;
  document.querySelector('#motion-poster').src=content.brand.wordmark;
  content.navigation.forEach(entry=>{
    const node=document.querySelector(`#main-nav a[href="#${entry.id}"]`);replace(node,entry.label);
    node.hidden=!content.sections.find(section=>section.id===entry.id)?.enabled;
  });
  const main=document.querySelector('main');
  for(const section of content.sections){const node=document.getElementById(section.id);node.hidden=!section.enabled;main.append(node);}
  document.querySelectorAll('.hero-actions a,.guide-inner a,.movement-heading a').forEach(link=>{const id=link.getAttribute('href').slice(1);link.hidden=!content.sections.find(section=>section.id===id)?.enabled;});
  document.getElementById('discovery-react').hidden=!content.sections.find(section=>section.id==='plan')?.enabled;
  document.querySelector('.preview-description').textContent=`· ${content.copy.previewNote}`;
  const bar=document.querySelector('.preview-bar');bar.childNodes[1].textContent=` ${content.copy.preview} `;
  document.querySelector('.contact-location').lastElementChild.textContent=content.copy.contactRegion;
  const location=document.querySelector('.contact-location');const pin=location.querySelector('svg'),region=location.querySelector('span');location.replaceChildren(pin,document.createTextNode(` ${content.copy.contactLocation}`),document.createElement('br'),region);
  const inset=content.photos[1]||content.photos[0];const image=document.querySelector('.collage-inset img');image.src=inset.src;image.alt=inset.alt;
}
