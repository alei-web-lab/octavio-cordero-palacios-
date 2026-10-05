// Paso breve entre el resumen y el documento; los enlaces conservan su destino real.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const documentRoutes = new Set(['/', '/documents/plan-de-trabajo.html']);
let sequence = 0;
let departure;

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.detail === 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced.matches || navigator.connection?.saveData) return;
  const link = event.target.closest('a[href]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin !== location.origin || destination.pathname === location.pathname || !documentRoutes.has(destination.pathname)) return;
  const page = document.querySelector('main');
  if (!page?.animate) return;

  event.preventDefault();
  const intent = ++sequence;
  departure?.cancel();
  const arrive = () => { if (intent === sequence) location.assign(destination.href); };
  departure = page.animate(
    [{opacity: 1, transform: 'translateY(0)'}, {opacity: .45, transform: 'translateY(-4px)'}],
    {duration: 120, easing: getComputedStyle(document.documentElement).getPropertyValue('--ease').trim(), fill: 'forwards'},
  );
  departure.finished.then(arrive, arrive);
});

// Restaurar la vista completa al regresar desde la caché de navegación.
window.addEventListener('pageshow', () => { ++sequence; departure?.cancel(); departure = undefined; });
reduced.addEventListener('change', () => { if (reduced.matches) departure?.cancel(); });
