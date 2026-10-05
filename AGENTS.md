# Instrucciones del proyecto

## Publicación autorizada

El usuario confirmó el 5 de octubre de 2026 que publicó la página y pidió desplegar automáticamente los próximos cambios del proyecto.

- Sitio de producción: https://octavio-cordero-palacios.vercel.app/
- Repositorio: https://github.com/alei-web-lab/octavio-cordero-palacios-
- Rama de producción: `main`.
- Proyecto Vercel identificado por el estado de GitHub: `octavio-cordero-palacios-`, equipo `alei`.

Al terminar cambios solicitados por el usuario, comprobarlos, construir los recursos que correspondan, crear un commit y subirlo a `origin/main` para activar la integración Git de Vercel. Esta publicación está autorizada de forma continuada; no pedir nuevamente confirmación para cada despliegue. Respetar una instrucción posterior de conservar un cambio solo en local o como borrador.

Antes de publicar, revisar el estado de Git y los cambios remotos. No incluir modificaciones ajenas al trabajo actual, sobrescribir trabajo del usuario ni usar `push --force`. Si hay divergencia, conservar y reconciliar ambos historiales.

Después del push, comprobar el estado Vercel del commit exacto en GitHub o el despliegue en Vercel, y que la URL pública responda. No afirmar que se publicó si solo se confirmó el push; informar de un error o estado pendiente si aparece. Si el conector de Vercel carece de acceso al equipo, usar los estados de GitHub y el sitio público para verificar la integración existente.

## Construcción

- Raíz del proyecto: esta carpeta. Framework Vercel: `Other`; build: `npm run build`; salida: `dist`.
- El build raíz también se ejecuta con `node scripts/build.mjs` y utiliza los bundles preparados. No requiere dependencias para construir esta versión.
- Tras cambiar `ui/*.jsx`, reconstruir con `node scripts/build-ui.mjs` antes del build raíz; requiere las dependencias de desarrollo de `motion/`.
- Tras cambiar el Player o las composiciones Remotion, comprobar tipos y reconstruir `motion/scripts/build-player.mjs` antes del build raíz.
- Incluir en Git los bundles actualizados de `public/ui/`, `public/motion/` y los recursos de `motion/public/brand/`.
- Ejecutar comprobaciones apropiadas para el cambio; no repetir pruebas amplias sin un motivo nuevo.

## Contenido y CMS

Mantener las exclusiones de `.gitignore`: dependencias, `dist/`, variables de entorno, documentos originales privados, borradores, respaldos y evidencia local. No subir credenciales ni datos privados.

El CMS comparte el panel `/admin/` entre local y Vercel. En local usa `scripts/cms-api.mjs` y archivos privados en `/cms/`; aplicar modifica `public/content/site.json` y requiere commit/push. En Vercel usa `api/cms/[action].js` y `server/`, con correo/contraseña, sesión segura y variables privadas. Su publicación remota guarda un commit en `main` mediante un token de GitHub limitado al repositorio y activa la integración Git existente. No añadir Supabase: el usuario pidió prescindir de él.

Los borradores y respaldos remotos de `.cms-data/` se versionan solo cifrados; nunca incluir JSON privado sin cifrar. Conservar `CMS_SECRET` en el gestor de secretos y su copia local privada: cambiarla sin migración impide leer los borradores y respaldos anteriores. `.env.cms.local` y `/cms/acceso-online.txt` quedan excluidos del repositorio y del build. No imprimir sus valores. La activación remota requiere configurar las variables de producción; no afirmar que el CMS funciona en línea antes de verificar el inicio de sesión y su API.

Tras cambios del backend ejecutar `node scripts/test-cms-online.mjs`; tras cambios compartidos con el CMS local ejecutar también `node scripts/test-cms.mjs`. Las pruebas usan datos aislados sin publicar contenido real. Comprobar el login y la API del despliegue exacto además de la página pública.

Conservar la identidad Renovación 63, sus cuatro integrantes y las fotografías verificadas de Octavio Cordero Palacios. No reintroducir la fotografía de Busa. Mantener `preview: true` y `noindex, nofollow` mientras el contenido siga en preparación; no cambiar ese estado solamente por estar alojado en Vercel.
