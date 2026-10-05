# Renovación 63

<!-- impeccable:product-schema 1 -->

**Página y CMS activos en [Vercel](https://octavio-cordero-palacios.vercel.app/), con editor adaptable en `/admin/` y backend GitHub + Vercel sin Supabase.** El 5 de octubre de 2026 se configuraron los secretos y se verificaron inicio de sesión, guardado/vista previa, publicación y cierre de sesión en producción, manteniendo los valores públicos. Las páginas responden 200 y la API anónima 401. La revisión visual `ship` anterior se limita al lote histórico de cuatro reparaciones y no certifica esta conexión nueva. Los cambios solicitados se comprueban y suben a `main` para activar el despliegue automático autorizado.

## Platform

web

## Stack

HTML, CSS y módulos JavaScript nativos con islas diferidas de React 19.2.3 para descubrimiento, búsqueda/pestañas y visor fotográfico con `dialog` nativo. CMS React con API Node local. Bundles precompilados en `public/ui/` y Player Remotion 4.0.530 en `public/motion/player.js`. Servir o construir esta versión no requiere instalar paquetes. La autoría `ui/*.jsx` usa React y esbuild 0.25.12 existentes en `motion/node_modules`, mediante `npm run build:ui`; Remotion mantiene autoría y tipos en `motion/`.

Servidor local en `127.0.0.1:3000`. `npm run build` genera archivos estáticos en `dist/`; Vercel despliega por separado `api/cms/[action].js` con los módulos nativos de `server/`. La persistencia remota usa el repositorio existente y variables privadas de producción, sin dependencias raíz ni otra base de datos.

## Users

Público general que consulta información del movimiento, equipo y plan en Octavio Cordero Palacios, Cuenca, Azuay. Prioridad a teléfonos. El equipo necesita un editor ordenado; el usuario confirmó que también querrá entrar desde el celular cuando se publique.

## Product Purpose

Presentar Renovación 63, sus cuatro integrantes, el plan facilitado y los canales oficiales, y permitir mantener esa información mediante un CMS.

## Capabilities and Constraints

Sitio adaptable, carrusel con pausa, índice de seis temas, búsqueda de propuestas, pestañas con teclado, detalles, impresión del plan completo y lector público. Visor modal con anterior/siguiente, Escape y foco restaurado. Progreso real de lectura, foco visible y alternativas estáticas al movimiento.

CMS en `/admin/` para portada, movimiento, plan, equipo, parroquia, contacto, preguntas y marca/estructura. Permite guardar borrador, revisar, aplicar al sitio local, importar/exportar JSON, cargar archivos y ordenar/mostrar secciones. Visible en `public/content/site.json`; borrador privado en `cms/draft.json` y respaldos privados en `cms/backups/`. Cargas públicas en `public/uploads/`: JPG/PNG/WebP hasta 8 MB o PDF hasta 12 MB. Loopback, host, origen, token y revisión protegen las operaciones locales; no proporcionan inicio de sesión ni permisos remotos.

En línea, el mismo editor incorpora correo/contraseña, sesión de 8 horas, guardado privado, vista previa y publicación mediante commits en `main`. Los borradores y respaldos se cifran con AES-256-GCM en `.cms-data/`; el contenido público y los archivos se versionan en `public/`. Las escrituras requieren origen, CSRF y revisión vigente. El panel informa el estado Vercel del commit enviado y conserva cambios sin guardar si vence la sesión. La configuración y clave privada quedan fuera de Git y de `dist/`.

`src/content.js` valida el contenido, con `src/default-content.js` como respaldo. La vista previa obtiene el borrador autenticado y muestra un aviso si no puede cargarlo. Las imágenes recién subidas se resuelven a través del panel antes de que termine el despliegue de recursos. El editor se adapta a celular; se verificaron login, borrador, vista previa, publicación simulada y cierre de sesión, con anchos 320, 390, 768 y 1440px. Las pruebas del backend cubren acceso/CSRF, cifrado, respaldo, conflictos, conservación de cambios ajenos y cargas 8/12 MB sin servicios externos. Estas pruebas aisladas no sustituyen la activación y comprobación del acceso de producción.

Se conservan cuatro integrantes y seis IDs de plan: `vialidad`, `produccion`, `inclusion`, `seguridad`, `ambiente` y `gestion`. El lector `public/documents/plan-de-trabajo.html` omite cédulas y nóminas; el original `docs/plan-original.docx` queda privado.

Retratos, biografías verificadas y contactos siguen pendientes. Facebook, Instagram y TikTok son canales previstos; cada red pendiente conserva su indicador aunque otro contacto esté configurado. El formulario mantiene la descripción editable y añade aparte una guía operativa. Con correo configurado abre un borrador `mailto:` que la persona debe enviar. La página pública no recibe ni almacena consultas ni usa analítica o rastreo.

Mantener `preview: true` mientras el contenido esté en preparación. `noindex, nofollow` en `index.html` es independiente de los avisos; ambos se revisarán al publicar información aprobada.

## Brand Commitments

Renovación 63 y «Amor por Octavio Cordero Palacios» son nombre y frase confirmados. La muestra del usuario fija `#ff5d15` como acento en letras, controles y marcas gráficas. Cartel rural y collage angular conservan las seis referencias de `.impeccable/surface.md`. El hero mantiene base clara y radiales durazno sutiles. La extensión distingue movimiento marfil, plan verde claro, equipo blanco, galería verde profundo, contacto cálido y FAQ verde grisáceo. El CMS usa orden convencional blanco/gris con DM Sans. DESIGN.md documenta la implementación vigente.

La escritura de pincel de «Se siente» y bloque sans «AMOR POR» vienen de «amor por cuenca.jpeg». `public/brand/campaign-wordmark-light.webp`, opaco y de 1315 × 1196 píxeles, está en página y Player, con PNG y prompt conservados. Image Gen aproxima el color del arte; CSS contiene los valores exactos. Barlow Condensed 700/800, DM Sans y Manrope son locales con OFL.

Remotion real, dirigido por fotogramas, con cuatro trazos de esquina y `accentColor` editable: 12s a 30fps. Conserva imagen estática durante carga, movimiento reducido, ahorro de datos o fallo. Móvil espera interacción/control; escritorio prepara el Player con hero visible tras carga/tiempo ocioso. Pausa fuera de pantalla y con pestaña oculta. No se exportó MP4; el aviso de licencia se conserva sin aceptar condiciones por el usuario.

Semilla `74b6e23f`, índice 5, pool `c3b204a1eed6`: recuperada tarde tras la implementación inicial, motor 0.1.5, fuente API. `direction-seed-receipt.md` conserva el recibo histórico. La extensión preserva la identidad; no hay tirada nueva, comp aprobado ni QUALITY BAR disponible de catálogo.

## Evidence on Hand

Nombres y roles facilitados por el usuario:

- Sandra Jackeline Lema Chalco: presidenta.
- Claudio Milton Chuqui: vicepresidente.
- Delia Isabel Pineda Tenen: tesorera.
- Sandra Estefania Puma Cantos: secretaria.

Dos fotografías verificadas de la parroquia: casas y quebrada por Martín Vasco, CC BY 4.0; Busa y variantes eliminados. Originales WebP y variantes de 480px en `public/images/ATTRIBUTION.md`. Marca con PNG/prompt. Sprite Tabler Outline: 38 símbolos, 22 fijados al commit anterior y 16 obtenidos de `main` oficial el 2026-10-04; procedencias separadas y MIT en el README de iconos.

Build raíz, build React y typecheck/build Remotion pasaron. Pruebas CMS aisladas incluyeron token no ASCII; flujo UI de borrador/vista previa/aplicación restauró el contenido original. La comprobación posterior de descripción del formulario y tres redes pendientes quedó en `contact-fix-proof.json`; el borrador se restauró y el contenido público no cambió. Visor, flechas de pestañas y búsqueda comprobados. Página/CMS sin desbordamiento a 320/390/768/1440px.

Ocho capturas actuales después de correcciones de código, sin composición ni recorte, en `.impeccable/review/`:

| Archivo | Viewport solicitado | Alcance |
| --- | --- | --- |
| interactive-desktop.jpg | 1440 × 1000 | Plan: encabezado completo, búsqueda, seis temas y comienzo del panel. |
| interactive-mobile.jpg | 390 × 844 | Plan: encabezado completo, pestañas horizontales y comienzo del panel. |
| interactive-small320.jpg | 320 × 844 | Plan: encabezado completo, documento, búsqueda, pestañas y comienzo del panel. |
| interactive-tablet768.jpg | 768 × 1024 | Plan: encabezado completo, documento, búsqueda, pestañas y panel. |
| cms-desktop.jpg | 1440 × 1000 | CMS superior: cabecera, navegación e índice. |
| cms-mobile.jpg | 390 × 844 | CMS superior: cabecera y principio del índice. |
| cms-small320.jpg | 320 × 844 | CMS superior estrecho. |
| cms-tablet768.jpg | 768 × 1024 | CMS superior en tableta. |

Todos son viewports, no fullPage; no documentan la portada intacta. El ancho DOM coincidió con lo solicitado; la exportación CUA produjo rasters ligeramente menores: 1425 × 990, 375 × 811, 305 × 804 y 753 × 1004 respectivamente, para ambos grupos. No se recortaron ni redimensionaron después de exportar. `interactive-brief.md` define el paquete y `interactive-finish-verdict.md` registra los cuatro hallazgos resueltos con `ship`, limitado al lote puntuado. El único detector usó motor cacheado 0.1.5; se contrastó con código/juicio independiente sin repetirlo ni convertir falsos positivos en reglas.

Lighthouse LIGHT 86/100/100/63, LCP 4,2s y TBT 64ms son históricos anteriores a esta extensión; no se repitió la medición y no mide el estado actual, activación del Player, INP de campo o alojamiento definitivo. `finish-verdict.md` conserva `ship` solo para tres reparaciones anteriores. Las comprobaciones actuales no equivalen a certificación general de rendimiento, accesibilidad o toda la superficie.

## Product Principles

Información clara y comprobable para público general, con prioridad móvil y lectura cómoda. Mantener la identidad confirmada, distinguir lo pendiente y facilitar edición/revisión. Presentar los roles como equipo aspirante sin atribuir funciones institucionales actuales. Documentar implementación y límites con precisión. El CMS remoto requiere secretos de producción y verificación del acceso real; conservar una copia segura de su clave de cifrado.
