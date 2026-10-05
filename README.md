# Renovación 63

Sitio informativo del equipo aspirante al GAD parroquial de Octavio Cordero Palacios, Cuenca, Azuay. Conserva cartel rural y collage, con naranja `#ff5d15` como acento. Incluye seis temas del plan, búsqueda de propuestas, visor de fotografías y CMS local adaptable.

**Estado: vista local; cuatro correcciones revisadas con disposición `ship`.** La revisión inicial de interacción/CMS señaló cuatro hallazgos; la puntuación posterior los confirma resueltos. Esta disposición cubre ese lote, no toda la superficie. No hay despliegue ni CMS remoto. El `ship` anterior pertenece únicamente a tres reparaciones históricas de la versión previa.

| Integrante | Rol en el equipo aspirante |
| --- | --- |
| Sandra Jackeline Lema Chalco | Presidenta |
| Claudio Milton Chuqui | Vicepresidente |
| Delia Isabel Pineda Tenen | Tesorera |
| Sandra Estefania Puma Cantos | Secretaria |

## Ver y editar en local

Necesitas Node.js 20 o posterior. Los bundles React y el Player están preparados; no necesitas instalar paquetes para servir esta versión ni construir la salida estática.

```powershell
npm run dev
```

Abre [la página local](http://127.0.0.1:3000/) o [el CMS local](http://127.0.0.1:3000/admin/). También funciona `node scripts/dev.mjs`. El servidor escucha solo en `127.0.0.1`; detén el proceso con `Ctrl+C`.

Elige una sección del CMS, edita, guarda el borrador, revisa la vista previa y pulsa **Aplicar al sitio local**. Aplicar conserva un respaldo de la versión visible anterior. Vista previa guarda primero los cambios del panel si los hay. Puedes importar/exportar JSON y cargar archivos. La guía completa está en [CMS.md](CMS.md).

| Ruta | Función |
| --- | --- |
| `public/content/site.json` | Contenido visible, incluido en el build. |
| `cms/draft.json` | Borrador privado; no altera la página visible. |
| `cms/backups/` | Respaldos privados creados al aplicar cambios. |
| `public/uploads/` | Imágenes JPG/PNG/WebP hasta 8 MB y PDF hasta 12 MB. |
| `src/content.js` | Cargador del JSON público o borrador; valida y limpia el contenido. |
| `src/default-content.js` | Respaldo si el contenido no se puede cargar o validar. |

La API comprueba loopback, host, origen, token y revisión para evitar sobrescrituras desde otro panel. Estas protecciones locales no proporcionan cuentas ni autenticación remota. El usuario confirmó que querrá editar desde el celular cuando se publique: acceso privado, permisos y persistencia duradera en línea siguen pendientes. Un alojamiento estático de `dist/` muestra la página, pero no implementa la API ni el guardado del CMS.

## Contenido y recursos

Se conservan cuatro integrantes y seis IDs: `vialidad`, `produccion`, `inclusion`, `seguridad`, `ambiente` y `gestion`. Los temas son vías y conectividad, producción local, inclusión y cultura, seguridad y convivencia, ambiente y agua, y gestión y participación. Sus propuestas se editan en el CMS.

El lector completo está en `public/documents/plan-de-trabajo.html`, sin cédulas ni nóminas. El original privado `docs/plan-original.docx` queda fuera del servidor y del build. `officialPlanUrl` conserva `/documents/plan-de-trabajo.html`; admite una URL HTTPS o ruta permitida a otro documento aprobado. La impresión reúne los seis temas.

Solo hay **dos fotografías parroquiales**: casas y quebrada de Octavio Cordero Palacios, por Martín Vasco, CC BY 4.0. Sus WebP y variantes de 480px mantienen créditos en `public/images/ATTRIBUTION.md`. Busa y sus variantes se eliminaron. Retratos, biografías verificadas, contactos y perfiles oficiales de Facebook, Instagram y TikTok siguen pendientes.

La marca `public/brand/campaign-wordmark-light.webp` está integrada en página y Player: 1315 × 1196 píxeles, opaca. Conserva PNG y prompt. Image Gen aproxima los colores del arte; CSS contiene los valores exactos. Las fuentes Barlow Condensed, DM Sans y Manrope son locales, con licencias OFL. El sprite contiene 38 símbolos Tabler Outline; procedencia y MIT en `public/icons/README.md`.

El formulario público no guarda ni envía consultas. Con correo configurado prepara un borrador `mailto:` para que la persona lo revise y envíe. Su descripción editable se conserva y la guía operativa aparece aparte. Cada red pendiente mantiene su indicador aunque exista otro contacto. No hay analítica ni seguimiento de visitantes.

Mantén `preview: true` mientras el contenido esté en preparación. Ocultar avisos no completa ni valida campos. `index.html` conserva `noindex, nofollow`, ajuste independiente que se revisará al publicar.

## Código y construcción

Para conectar GitHub con Vercel se preparó `vercel.json`: framework **Other** (`null`), build `npm run build`, salida `dist` e instalación omitida porque los bundles actuales ya están generados. Usa la raíz del repositorio, no `motion/` ni `public/`. Este archivo configura el build; no crea un proyecto ni publica por sí mismo. [Referencia oficial](https://vercel.com/docs/project-configuration/vercel-json).

El `.gitignore` excluye `docs/`, `cms/`, `.impeccable/`, pruebas temporales, dependencias, `dist/` y archivos de entorno. El contenido visible de `public/content/site.json` y los recursos públicos sí se versionan. Tras editar en el CMS y aplicar al sitio local, hay que hacer commit y push a la rama de producción para que la integración Git de Vercel despliegue esos cambios. La API del CMS sigue siendo local.

La página combina HTML/CSS y módulos nativos con islas diferidas de React 19.2.3 para descubrimiento, búsqueda/pestañas y visor con `dialog` nativo. El CMS también usa React. Bundles en `public/ui/`; estilos públicos en `src/style.css` y `src/interactive.css`, y del editor en `public/admin/style.css`.

```powershell
npm run build
```

También funciona `node scripts/build.mjs`. Reemplaza únicamente `dist/` dentro del proyecto, copia `index.html` y `src/`, y coloca `public/` en la raíz de salida. No incluye borrador, respaldos, documentación privada ni código de API. No publica en internet.

Después de modificar `ui/*.jsx`:

```powershell
npm run build:ui
npm run build
```

La autoría JSX usa las dependencias existentes en `motion/node_modules`: React/React DOM 19.2.3 y esbuild 0.25.12. `scripts/build-ui.mjs` genera bundles y chunks ESM; el build raíz los copia, no recompila JSX.

El servidor valida rutas y ubicación real; los archivos inexistentes responden 404. HTML/CSS/JS usan `no-cache`, imágenes/fuentes `public, max-age=300`; ETag permite 304 sin cuerpo. Los archivos editables no se marcan como inmutables.

## Animación con Remotion

Player real de Remotion 4.0.530 dirigido por fotogramas: 12s a 30fps, revelación de la marca, cuatro trazos de esquina, pausa legible y retorno. `accentColor` conecta los trazos con el acento editable. Conserva el arte completo y la proporción del contenedor. No se exportó MP4.

Por debajo de 1024px, la marca estática aparece inmediatamente y Remotion/autoplay esperan puntero, rueda o **Ver animación**. En escritorio se prepara tras la carga y en tiempo ocioso con el hero visible. Se puede pausar; se pausa fuera de pantalla o con pestaña oculta. Movimiento reducido, ahorro de datos o fallo mantienen el arte estático.

Con las dependencias existentes:

```powershell
npm --prefix motion run typecheck
npm --prefix motion run build:player
npm --prefix motion run studio
```

Studio abre en [localhost:3001/CampaignIdentity](http://localhost:3001/CampaignIdentity). Edita `motion/src/Composition.tsx` y `motion/src/player.tsx`; `build:player` reconstruye `public/motion/player.js`. Después ejecuta el build raíz. Se conserva el aviso de licencia de Remotion; sus condiciones deben revisarse según la entidad antes de producción.

## Evidencia y límites

Build raíz, build React y typecheck/build Remotion pasaron. Las pruebas CMS aisladas comprobaron validación, origen/token —incluido token no ASCII—, persistencia, borrador separado, respaldos, conflictos y cargas permitidas. La prueba UI de borrador/vista previa/aplicación restauró el contenido original. La comprobación posterior de correo configurado conservó la descripción y las tres redes pendientes; el borrador se restauró y la versión pública no cambió. Visor comprobado con siguiente, Escape y foco restaurado; pestañas con flechas y búsqueda. Sin desbordamiento a 320/390/768/1440px. El progreso de lectura sigue el desplazamiento real.

Las ocho capturas actuales y sus alcances están en `.impeccable/review/interactive-brief.md`: sección del plan y documento superior del CMS, recapturados después de las correcciones de código. No prueban la portada intacta ni una página completa. `interactive-finish-verdict.md` registra los cuatro hallazgos resueltos con disposición `ship`, limitada a las correcciones puntuadas.

Lighthouse LIGHT 86/100/100/63 y LCP 4,2s son históricos anteriores a esta extensión. No se repitió Lighthouse; no mide React/CMS ni activación del Player actual. `finish-verdict.md` conserva un `ship` limitado a tres reparaciones anteriores. No hay comp aprobado ni QUALITY BAR de catálogo disponible. La semilla `74b6e23f`, recuperada tarde, permanece como recibo histórico en `direction-seed-receipt.md`.
