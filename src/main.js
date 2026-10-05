import { siteContent as content } from './content.js';
import './navigation-motion.js';
import {applyContent} from './apply-content.js';

applyContent(content);

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const escape = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safeUrl = (value = '', local = false) => {
  if (local && /^\/(?!\/)/.test(value)) return escape(value);
  try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? escape(url.href) : ''; } catch { return ''; }
};
// Familia oficial Tabler Outline, servida localmente con licencia MIT.
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="/icons/sprite.svg?v=2#${escape(name)}" /></svg>`;
const disclosure = title => `<span>${escape(title)}</span><span class="disclosure-mark" aria-hidden="true">${icon('plus')}${icon('minus')}</span>`;
const initials = name => {
  const words = name.trim().split(/\s+/);
  return `${words[0][0]}${words[Math.max(0, words.length - 2)][0]}`;
};
document.addEventListener('keydown', () => { document.documentElement.dataset.input = 'keyboard'; }, { capture: true });
document.addEventListener('pointerdown', () => { document.documentElement.dataset.input = 'pointer'; }, { capture: true });

// Menú móvil: se cierra al navegar, al salir con Escape o al ampliar la ventana.
const menuButton = $('.menu-toggle');
const nav = $('#main-nav');
const closeMenu = () => { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menú'); nav.classList.remove('is-open'); };
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav.classList.toggle('is-open', open);
});
$$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 951px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Carrusel accesible: pausa explícita, pausa en foco/hover y gestos táctiles.
const photoSources = photo => /^\/images\/octavio-(casas|quebrada)\.webp$/.test(photo.src)
  ? `${photo.src.replace('.webp', '-480.webp')} 480w, ${photo.src} 840w` : safeUrl(photo.src,true);
const photos = content.photos;
const slidesRoot = $('#hero-slides');
const dotsRoot = $('#hero-dots');
const renderSlide = (photo, index) => `<figure class="hero-slide${index === 0 ? ' is-active' : ''}" role="group" aria-roledescription="diapositiva" aria-label="${index + 1} de ${photos.length}" aria-hidden="${index !== 0}"><img src="${safeUrl(photo.src, true)}" srcset="${photoSources(photo)}" sizes="(max-width: 680px) 90vw, 48vw" alt="${escape(photo.alt)}" width="1600" height="1067" ${index === 0 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async" /></figure>`;
if ($('img', slidesRoot)?.getAttribute('src') === photos[0]?.src) {
  slidesRoot.insertAdjacentHTML('beforeend', photos.slice(1).map((photo, index) => renderSlide(photo, index + 1)).join(''));
  $('.hero-slide', slidesRoot).setAttribute('aria-label', `1 de ${photos.length}`);
} else slidesRoot.innerHTML = photos.map(renderSlide).join('');
dotsRoot.innerHTML = photos.map((_, index) => `<button class="carousel-dot" aria-label="Ver fotografía ${index + 1}" aria-current="${index === 0}" data-slide="${index}"></button>`).join('');
const slides = $$('.hero-slide');
const dots = $$('.carousel-dot');
const heroMedia = $('.hero-media');
const pauseButton = $('#carousel-pause');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionAllowed = () => !reducedMotion.matches && !navigator.connection?.saveData && document.documentElement.dataset.input !== 'keyboard';
let hasInteracted = matchMedia('(min-width: 1024px)').matches;

let currentSlide = 0;
let paused = reducedMotion.matches || Boolean(navigator.connection?.saveData);
let hovered = false;
let timer;
const stopTimer = () => clearInterval(timer);
const displaySlide = (index, announce = false) => {
  currentSlide = (index + photos.length) % photos.length;
  slides.forEach((slide, i) => { slide.classList.toggle('is-active', i === currentSlide); slide.setAttribute('aria-hidden', String(i !== currentSlide)); });
  dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === currentSlide)));
  $('#hero-caption').textContent = photos[currentSlide].caption;
  if (announce) $('#carousel-announcement').textContent = `Fotografía ${currentSlide + 1} de ${photos.length}: ${photos[currentSlide].caption}`;
};
const startTimer = () => {
  stopTimer();
  if (hasInteracted && !paused && !hovered && !heroMedia.contains(document.activeElement) && !document.hidden && photos.length > 1) timer = setInterval(() => displaySlide(currentSlide + 1), 6500);
};
const renderPause = () => { pauseButton.innerHTML = icon(paused ? 'play' : 'pause'); pauseButton.setAttribute('aria-label', paused ? 'Reproducir carrusel' : 'Pausar carrusel'); pauseButton.setAttribute('aria-pressed', String(paused)); };
const manualSlide = (index) => { displaySlide(index, true); startTimer(); };
$('#carousel-prev').addEventListener('click', () => manualSlide(currentSlide - 1));
$('#carousel-next').addEventListener('click', () => manualSlide(currentSlide + 1));
dots.forEach(dot => dot.addEventListener('click', () => manualSlide(Number(dot.dataset.slide))));
pauseButton.addEventListener('click', () => { paused = !paused; renderPause(); startTimer(); });
heroMedia.addEventListener('mouseenter', () => { hovered = true; stopTimer(); });
heroMedia.addEventListener('mouseleave', () => { hovered = false; startTimer(); });
heroMedia.addEventListener('focusin', stopTimer);
heroMedia.addEventListener('focusout', () => setTimeout(startTimer, 0));
heroMedia.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); manualSlide(currentSlide + (event.key === 'ArrowRight' ? 1 : -1)); } });
let touchStart = null;
heroMedia.addEventListener('touchstart', event => { touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }, { passive: true });
heroMedia.addEventListener('touchend', event => {
  if (!touchStart) return;
  const deltaX = event.changedTouches[0].clientX - touchStart.x;
  const deltaY = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) manualSlide(currentSlide + (deltaX < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
document.addEventListener('visibilitychange', startTimer);
reducedMotion.addEventListener('change', event => { if (event.matches) { paused = true; renderPause(); stopTimer(); } });
displaySlide(0); renderPause(); startTimer();

// Presentación Remotion: carga al entrar en pantalla, con imagen estática de respaldo.
const motionHost = $('#campaign-motion');
const motionPoster = $('#motion-poster');
const motionToggle = $('#motion-toggle');
let motionPlayer;
let motionLoaded = false;
let motionLoading = false;
let motionPaused = false;
let motionInView = true;
const updateMotionButton = () => {
  motionToggle.innerHTML = `${icon(motionPaused ? 'play' : 'pause')}${motionPaused ? 'Reproducir animación' : 'Pausar animación'}`;
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
};
const syncMotion = () => {
  if (!motionPlayer) return;
  if (motionPaused || !motionInView || document.hidden || reducedMotion.matches) motionPlayer.pause();
  else motionPlayer.play();
};
const loadMotion = async () => {
  if (motionLoading || motionLoaded || reducedMotion.matches || navigator.connection?.saveData) return;
  motionLoading = true;
  try {
    const { mountCampaignMotion } = await import('/motion/player.js');
    motionPlayer = mountCampaignMotion(motionHost, {
      autoPlay: true, loop: true,
      wordmarkSrc: content.brand.wordmark,
      accentColor: content.brand.accent,
      onReady: () => {
        motionLoaded = true;
        motionToggle.disabled = false; motionToggle.removeAttribute('aria-busy');
        if (!reducedMotion.matches) { motionHost.classList.add('is-ready'); motionPoster.hidden = true; motionToggle.hidden = false; }
        updateMotionButton(); syncMotion();
      },
      onError: () => { motionHost.classList.remove('is-ready'); motionPoster.hidden = false; motionToggle.hidden = true; }
    });
  } catch {
    // La página y el lema permanecen disponibles aunque falle la animación.
    motionPoster.hidden = false;
    motionToggle.hidden = true;
  } finally { motionLoading = false; }
};
motionToggle.addEventListener('click', () => {
  if (!motionLoaded) { hasInteracted = true; motionPaused = false; queueMotion(); return; }
  motionPaused = !motionPaused; updateMotionButton(); syncMotion();
});
if (!hasInteracted && !reducedMotion.matches && !navigator.connection?.saveData) {
  motionToggle.hidden = false;
  motionToggle.innerHTML = `${icon('play')}Ver animación`;
}
let motionQueued = false;
const queueMotion = () => {
  if (!hasInteracted || motionQueued || motionLoaded || motionLoading || reducedMotion.matches || navigator.connection?.saveData) return;
  motionQueued = true;
  const idle = () => {
    const start = () => { motionQueued = false; if (motionInView && !document.hidden) loadMotion(); };
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 200);
  };
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
};
const beginExploration = () => {
  hasInteracted = true;
  if (motionInView) queueMotion();
  startTimer();
};
document.addEventListener('pointerdown', beginExploration, { once: true, passive: true });
document.addEventListener('wheel', beginExploration, { once: true, passive: true });
new IntersectionObserver(entries => {
  motionInView = entries[0].isIntersecting;
  if (motionInView) queueMotion();
  syncMotion();
}, { threshold: 0.05 }).observe($('.motion-stage'));
document.addEventListener('visibilitychange', () => { syncMotion(); if (!document.hidden && motionInView) queueMotion(); });
reducedMotion.addEventListener('change', event => {
  if (event.matches) { motionPlayer?.pause(); motionHost.classList.remove('is-ready'); motionPoster.hidden = false; motionToggle.hidden = true; }
  else if (motionLoaded) { motionHost.classList.add('is-ready'); motionPoster.hidden = true; motionToggle.hidden = false; syncMotion(); }
  else if (motionInView) queueMotion();
});

// Pestañas: roving tabindex y teclas de dirección según el patrón ARIA.
const plans = content.plan;
$('#plan-tabs').innerHTML = plans.map((plan, index) => `<button class="plan-tab" role="tab" id="tab-${escape(plan.id)}" aria-controls="panel-${escape(plan.id)}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${icon(plan.icon)}${escape(plan.title)}</button>`).join('');
$('#plan-panels').innerHTML = plans.map((plan, index) => `<div class="plan-panel" id="panel-${escape(plan.id)}" role="tabpanel" aria-labelledby="tab-${escape(plan.id)}" tabindex="0"${index !== 0 ? ' hidden' : ''}><div class="plan-intro">${icon(plan.icon)}<h3>${escape(plan.title)}</h3><p>${escape(plan.description)}</p>${content.preview && !content.planProvided ? '<span class="status-tag">Contenido por confirmar</span>' : ''}</div><div class="plan-details">${plan.items.map((item, i) => `<details${i === 0 ? ' open' : ''}><summary>${disclosure(item.title)}</summary><p>${escape(item.text)}</p></details>`).join('')}</div></div>`).join('');
const tabs = $$('.plan-tab');
const panels = $$('.plan-panel');
const activateTab = (index, focus = false, animate = false) => {
  panels.forEach(panel => panel.getAnimations().forEach(animation => animation.cancel()));
  tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(index === i)); tab.tabIndex = index === i ? 0 : -1; });
  panels.forEach((panel, i) => { panel.hidden = index !== i; });
  if (animate && motionAllowed()) panels[index].animate([{ opacity: .3, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 200, easing: getComputedStyle(document.documentElement).getPropertyValue('--ease').trim() });
  if (focus) { tabs[index].focus({ preventScroll: true }); tabs[index].scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' }); }
};
tabs.forEach((tab, index) => {
  tab.addEventListener('click', event => activateTab(index, false, event.detail > 0));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(next, true); }
  });
});
$('#print-plan').addEventListener('click', () => window.print());
if (content.officialPlanUrl && safeUrl(content.officialPlanUrl, true)) {
  const download = document.createElement('a'); download.className = 'button button-primary'; download.href = content.officialPlanUrl; download.textContent = content.planDownloadLabel || 'Consultar documento del plan';
  const actions = document.createElement('div'); actions.className = 'plan-actions'; const print = $('#print-plan'); print.replaceWith(actions); actions.append(download, print);
}
if (content.planProvided) {
  $('.plan-status').innerHTML = `<span class="status-tag">${escape(content.copy.planPeriod)}</span><span>${escape(content.copy.planNote)}</span>`;
  $('.plan-footnote').textContent = content.copy.planFootnote;
}

// Perfiles sin personas o testimonios ficticios.
$('#team-grid').innerHTML = content.members.map(member => `<article class="team-member"><div class="member-portrait">${member.photo ? `<img src="${safeUrl(member.photo, true)}" alt="${escape(member.name)}" width="400" height="500" loading="lazy" />` : `<div class="portrait-placeholder"><span class="member-initials" aria-hidden="true">${escape(initials(member.name))}</span><span>${escape(content.copy.portraitPending)}</span></div>`}<span class="member-role">${escape(member.role)}</span></div><div class="member-info"><h3>${escape(member.name)}</h3>${content.preview && !member.photo ? `<p>${escape(content.copy.profilePending)}</p>` : ''}<details><summary>${disclosure(content.copy.profileButton)}</summary><p>${escape(member.bio)}</p></details></div></article>`).join('');

// Galería nativa: deslizable sin una biblioteca adicional.
const gallery = $('#gallery-track');
gallery.innerHTML = photos.map((photo,index) => `<figure class="gallery-item"><button class="gallery-photo-button" data-open-photo="${index}" aria-label="Abrir fotografía: ${escape(photo.title)}"><img src="${safeUrl(photo.src, true)}" srcset="${photoSources(photo)}" sizes="(max-width: 680px) 83vw, 42vw" alt="${escape(photo.alt)}" width="840" height="1120" loading="lazy" decoding="async" /><span class="photo-open-mark">${icon('eye')}Ver fotografía</span></button><figcaption><h3>${escape(photo.title)}</h3><p>${escape(photo.caption)}</p></figcaption></figure>`).join('');
$('.gallery-footnote').childNodes[0].textContent = `${content.copy.galleryFootnote} `;
const scrollGallery = (direction) => {
  const step = $('.gallery-item', gallery).getBoundingClientRect().width + 24;
  gallery.scrollBy({ left: direction * step, behavior: motionAllowed() ? 'smooth' : 'instant' });
};
$('#gallery-prev').addEventListener('click', () => scrollGallery(-1));
$('#gallery-next').addEventListener('click', () => scrollGallery(1));
const updateGalleryButtons = () => { $('#gallery-prev').disabled = gallery.scrollLeft < 2; $('#gallery-next').disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 3; };
gallery.addEventListener('scroll', updateGalleryButtons, { passive: true });
new ResizeObserver(updateGalleryButtons).observe(gallery);
$('#photo-credits').innerHTML = photos.map(photo => `<p><strong>${escape(photo.title)}.</strong> ${escape(photo.author)} · ${escape(photo.license)}${safeUrl(photo.source) ? ` · <a href="${safeUrl(photo.source)}" target="_blank" rel="noopener noreferrer">Fuente de la fotografía</a>` : ''}${safeUrl(photo.licenseUrl) ? ` · <a href="${safeUrl(photo.licenseUrl)}" target="_blank" rel="noopener noreferrer">Licencia</a>` : ''}. ${escape(photo.creditNote || '')}</p>`).join('');
const wireDisclosure = (buttonId, panelId) => {
  $(buttonId).addEventListener('click', () => { const panel = $(panelId); panel.hidden = !panel.hidden; $(buttonId).setAttribute('aria-expanded', String(!panel.hidden)); });
};
wireDisclosure('#show-credits', '#photo-credits');
wireDisclosure('#privacy-toggle', '#privacy-details');

// Los canales permanecen sin inventar hasta que el propietario los configure.
const channels = content.contact;
const channelLinks = [];
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(channels.email);
if (validEmail) channelLinks.push(`<a href="mailto:${escape(channels.email)}">${icon('mail')}${escape(channels.email)}</a>`);
if (channels.phone && /^[+\d ()-]+$/.test(channels.phone)) channelLinks.push(`<a href="tel:${escape(channels.phone.replace(/[^+\d]/g, ''))}">${icon('phone')}${escape(channels.phone)}</a>`);
if (channels.whatsapp && /^\d{8,15}$/.test(channels.whatsapp)) channelLinks.push(`<a href="https://wa.me/${escape(channels.whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp ${icon('arrow')}</a>`);
for (const [key, label] of [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok']]) {
  if (safeUrl(channels[key])) channelLinks.push(`<a href="${safeUrl(channels[key])}" target="_blank" rel="noopener noreferrer">${icon(key)}${label} ${icon('arrow')}</a>`);
}
const pendingSocials = content.plannedSocials.filter(label => !safeUrl(channels[label.toLowerCase()]));
$('#contact-channels').innerHTML = channelLinks.join('') + (channelLinks.length ? '' : `<p>${escape(content.copy.contactPending)}</p>`) + (pendingSocials.length ? `<ul class="planned-socials" aria-label="Redes sociales previstas">${pendingSocials.map(label => `<li>${icon(label.toLowerCase())}<strong>${escape(label)}</strong><span>${escape(content.copy.socialPending)}</span></li>`).join('')}</ul>` : '');
const formChannelStatus = document.createElement('p');
formChannelStatus.className = 'form-channel-status';
formChannelStatus.textContent = validEmail ? 'Puedes abrir un borrador en tu aplicación de correo y revisarlo antes de enviarlo.' : 'El correo oficial aún no está configurado. El formulario no enviará tus datos.';
$('#form-description').insertAdjacentElement('afterend', formChannelStatus);
$('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!validEmail) { $('#form-status').textContent = 'El correo oficial aún no está configurado. No se enviaron ni guardaron tus datos.'; return; }
  const values = new FormData(event.currentTarget);
  const subject = `Consulta web: ${values.get('topic')}`;
  const body = `Nombre: ${values.get('name')}\nCorreo de respuesta: ${values.get('email')}\n\n${values.get('message')}`;
  window.location.href = `mailto:${channels.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $('#form-status').textContent = 'Se solicitó abrir un borrador de correo. Revísalo y envíalo desde tu aplicación. Si no se abre, utiliza el correo de contacto indicado.';
});

$('#faq-list').innerHTML = content.faqs.map(faq => `<details><summary>${disclosure(faq.question)}</summary><p>${escape(faq.answer)}</p></details>`).join('');
$('#copyright-year').textContent = new Date().getFullYear();
$('.footer-bottom>span:first-child').innerHTML = `© ${new Date().getFullYear()} ${escape(content.brand.name)}`;
if (!content.preview) { $('.preview-bar').hidden = true; $('.plan-status').hidden = true; $('.content-note').hidden = true; $('.section-side-note').hidden = true; $('.plan-footnote').hidden = true; $('.footer-bottom>span:nth-child(2)').hidden = true; }

// Sección activa de la navegación, sin rastreo o almacenamiento.
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) $$('a', nav).forEach(link => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -65% 0px' });
$$('main section[id]').forEach(section => activeObserver.observe(section));

// Transiciones de navegación: preservan las anclas y los atajos de teclado.
let sectionTransition;
let navigationIntent = 0;
$$('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  if (event.defaultPrevented || event.detail === 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !motionAllowed() || !document.startViewTransition) return;
  const anchor = link.getAttribute('href');
  const target = $(anchor);
  if (!target) return;
  event.preventDefault();
  const intent = ++navigationIntent;
  sectionTransition?.skipTransition();
  const arrive = () => {
    if (intent !== navigationIntent) return;
    closeMenu();
    if (location.hash !== anchor) history.pushState(null, '', anchor);
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };
  try {
    sectionTransition = document.startViewTransition(arrive);
    sectionTransition.ready.catch(() => {});
    sectionTransition.updateCallbackDone.catch(() => arrive());
    sectionTransition.finished.catch(() => {});
  } catch { arrive(); }
}));

// Descubrimiento único del equipo; la información queda visible sin JavaScript.
const portraits = $$('.member-portrait');
const portraitAnimations = [];
const discoveryObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    if (motionAllowed()) portraits.forEach((portrait, index) => {
      const tilt = index % 2 === 0 ? -2 : 2;
      portraitAnimations.push(portrait.animate([
        { opacity: .7, transform: `translateY(10px) rotate(${tilt}deg)` },
        { opacity: 1, transform: 'translateY(0) rotate(0deg)' }
      ], { duration: 260, delay: index * 45, easing: getComputedStyle(document.documentElement).getPropertyValue('--ease').trim() }));
    });
    discoveryObserver.unobserve(entry.target);
  }
}, { threshold: .12 });
discoveryObserver.observe($('#team-grid'));
reducedMotion.addEventListener('change', event => { if (event.matches) { sectionTransition?.skipTransition(); portraitAnimations.forEach(animation => animation.cancel()); panels.forEach(panel => panel.getAnimations().forEach(animation => animation.cancel())); } });

// Islas React: el resumen nativo sigue funcionando hasta que el módulo esté listo.
let reactPromise;
const mountReact = async () => {
  if (!reactPromise) reactPromise = import('/ui/site.js').then(({mountInteractiveSite})=>mountInteractiveSite(content)).catch(()=>{reactPromise=undefined;return null;});
  return reactPromise;
};
const reactObserver = new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){mountReact();reactObserver.disconnect();}},{rootMargin:'300px'});
['#movimiento','#plan','#parroquia'].forEach(selector=>reactObserver.observe($(selector)));
$$('[data-open-photo]').forEach(button=>button.addEventListener('pointerenter',mountReact,{once:true}));
$$('[data-open-photo]').forEach(button=>button.addEventListener('focus',mountReact,{once:true}));
$$('[data-open-photo]').forEach(button=>button.addEventListener('click',async()=>{const app=await mountReact();app?.openPhoto(Number(button.dataset.openPhoto));}));

// La línea de lectura representa el avance real por el contenido.
const progress=$('#reading-progress');let progressFrame;
const updateProgress=()=>{cancelAnimationFrame(progressFrame);progressFrame=requestAnimationFrame(()=>{const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?Math.min(1,scrollY/total):0})`;});};
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
