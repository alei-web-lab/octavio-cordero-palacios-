# Editar Renovación 63

El editor publicado está en [octavio-cordero-palacios.vercel.app/admin/](https://octavio-cordero-palacios.vercel.app/admin/). Requiere configurar una vez los secretos de producción descritos abajo. Después puedes entrar con el correo administrador y contraseña desde una computadora o celular. No utiliza Supabase ni otra base de datos.

Para trabajar en este equipo, inicia `npm run dev` o `node scripts/dev.mjs` y abre [el editor local](http://127.0.0.1:3000/admin/). La página se encuentra en [127.0.0.1:3000](http://127.0.0.1:3000/). Necesitas Node.js 20 o posterior; los bundles ya están preparados.

## Guardar y revisar

1. Selecciona una sección del índice o del menú. En celular, abre el menú de la cabecera.
2. Edita sus campos. Puedes cambiar textos, propuestas, nombres, roles, perfiles, fotografías, contactos, preguntas, identidad y orden de las secciones.
3. Pulsa **Guardar borrador** para conservar los cambios sin modificar la versión visible. En línea, el borrador se guarda cifrado en GitHub y se puede continuar desde otro dispositivo.
4. Abre **Vista previa**. Si hay cambios nuevos, el panel los guarda como borrador antes de abrirla; la versión visible conserva su contenido.
5. En línea, pulsa **Publicar**: guarda el contenido en `main`, conserva un respaldo cifrado y activa el despliegue de Vercel. El panel indica cuándo el despliegue del commit enviado termina. Puedes continuar editando durante la publicación. En local, el botón se llama **Aplicar al sitio local** y actualiza únicamente la copia de este equipo, con respaldo local.

Si otro panel cambia el contenido, el editor evita sobrescribirlo y solicita recargar. Exporta tus cambios antes de recargar si necesitas conservarlos. **Exportar copia** descarga los campos del panel en JSON; **Importar copia** los carga para que puedas revisarlos antes de guardarlos o publicarlos. La sesión dura 8 horas; si termina con cambios sin guardar, el panel conserva esos cambios en el editor para iniciar sesión de nuevo o exportarlos. No recargues la pestaña antes de recuperarlos.

## Fotografías y documentos

Las imágenes admitidas son JPG, PNG o WebP, de hasta 8 MB. El plan descargable admite PDF de hasta 12 MB. Los archivos se guardan en `public/uploads/` con un nombre nuevo. En línea, la carga se divide en partes para respetar el límite de cada solicitud de Vercel y se reconstruye sin alterar sus bytes. Los archivos cargados son públicos; subirlos todavía no cambia los campos de la página: guarda el borrador o publica después de subirlos. El despliegue de los archivos puede tardar; la vista previa de imágenes nuevas las obtiene directamente del repositorio a través de una ruta del panel.

La galería debe contener solo fotografías de **Octavio Cordero Palacios**. Confirma su ubicación y completa título, descripción accesible, autor, licencia y fuente cuando correspondan. Actualmente hay dos fotografías verificadas de la parroquia; la fotografía de Busa y sus variantes fueron eliminadas. Los retratos del equipo tienen espacios identificados hasta contar con fotos reales.

El plan contiene seis temas con IDs fijos (`vialidad`, `produccion`, `inclusion`, `seguridad`, `ambiente`, `gestion`) y el equipo cuatro integrantes. Puedes editar sus contenidos y agregar o eliminar propuestas dentro de cada tema. En **Marca y estructura** puedes modificar el acento naranja, la marca gráfica, el menú, los metadatos y la visibilidad u orden de las secciones. El texto impreso dentro de la marca cambia al reemplazar su imagen.

Facebook, Instagram y TikTok permanecen como canales previstos hasta introducir sus enlaces oficiales. Cada red pendiente mantiene su indicador aunque otro contacto ya esté configurado. El formulario público conserva la descripción editable y añade aparte la guía operativa; prepara un borrador en la aplicación de correo cuando hay un correo configurado. Esta web no recibe ni almacena consultas.

## Archivos y respaldos

| Archivo o carpeta | Uso |
| --- | --- |
| `public/content/site.json` | Contenido visible y incluido en el build estático. |
| `cms/draft.json` | Borrador guardado, privado; queda fuera del build y de las rutas estáticas. |
| `cms/backups/` | Versiones visibles anteriores a cada aplicación, en JSON. |
| `.cms-data/draft.enc` | Borrador remoto cifrado; solo el servidor autorizado puede abrirlo. |
| `.cms-data/backups/*.enc` | Respaldos remotos cifrados, anteriores a cada publicación. |
| `public/uploads/` | Fotografías y documentos públicos cargados en el editor. |

`src/content.js` carga y valida el JSON público o el borrador; `src/default-content.js` proporciona el respaldo si no puede leerse. Para edición habitual usa el CMS o `public/content/site.json`.

Para recuperar un respaldo, importa su JSON desde el panel, revisa el contenido y aplícalo. Exportar contenido no copia las imágenes: conserva también la carpeta del proyecto o `public/uploads/` al trasladar el sitio.

## Activación del CMS en línea, una sola vez

1. Conecta la cuenta de Vercel que contiene el proyecto `octavio-cordero-palacios-`, equipo `alei`. Si usas CLI: `vercel login` y después `vercel link --yes --team alei --project octavio-cordero-palacios-`. Vincula el proyecto existente, sin crear otro.
2. Prepara las credenciales privadas con `node scripts/configure-cms.mjs correo-administrador@example.com`. El comando crea `.env.cms.local` y `cms/acceso-online.txt`, excluidos del repositorio y del build. Si esos archivos ya existen, utiliza la configuración existente; el comando no la reemplaza. La contraseña está solo en `cms/acceso-online.txt`, no en el código público.
3. En la cuenta GitHub propietaria `alei-web-lab`, abre **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**. Nombre: `CMS Octavio`. Elige el propietario `alei-web-lab`, acceso **Only select repositories** y solo `octavio-cordero-palacios-`. Permisos: **Contents: Read and write**, **Commit statuses: Read-only** y **Metadata: Read-only** (incluido automáticamente). Elige una fecha de vencimiento y renueva el token antes de esa fecha. [Guía oficial de GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
4. Copia el token generado únicamente al valor de `CMS_GITHUB_TOKEN` en `.env.cms.local`. No lo envíes por chat, lo incluyas en Git ni lo copies en campos públicos del sitio.
5. En Vercel, entra en **Project → Settings → Environment Variables**. Configura los cinco valores de `.env.cms.local` para **Production**, como secretos, conservando sus valores literalmente (el hash contiene signos `$`). El helper `node scripts/install-cms-env.mjs` también puede configurarlos usando la CLI instalada temporalmente y el acceso vinculado al proyecto. Ese helper comprueba el equipo y proyecto y transmite los valores por stdin sin imprimirlos.
6. Crea un despliegue de producción nuevo después de configurar los valores: un push a `main` o **Redeploy** de la versión actual. Los secretos se aplican en el siguiente despliegue. Abre `/admin/`, entra con el correo y la contraseña del archivo privado y comprueba **Guardar borrador → Vista previa → Publicar**. Solo entonces queda confirmada la activación en línea.

| Variable privada | Uso |
| --- | --- |
| `CMS_GITHUB_TOKEN` | Token limitado al repositorio para guardar contenido/archivos y consultar estados de Vercel. |
| `CMS_ADMIN_EMAIL` | Correo autorizado para entrar al editor; no configura el correo público de contacto. |
| `CMS_PASSWORD_HASH` | Hash scrypt de la contraseña de acceso; la contraseña no se guarda en el repositorio. |
| `CMS_SECRET` | Clave para cifrar borradores, respaldos y sesiones. Guarda su copia privada; no la cambies sin migrar los datos cifrados. |
| `CMS_ORIGIN` | `https://octavio-cordero-palacios.vercel.app`, origen permitido de las escrituras. |

La función `api/cms/[action].js` usa `server/` y los módulos nativos de Node. Los secretos no llevan prefijos públicos y nunca llegan al navegador. La sesión es una cookie HttpOnly, Secure y SameSite Strict; las escrituras requieren también origen y token CSRF. Hay un límite básico de intentos por instancia para el acceso, además de la contraseña aleatoria; no es un contador distribuido. Si aún faltan secretos, la API rechaza las operaciones y el panel indica que el acceso está en configuración.

El sitio público se construye como antes desde `public/content/site.json`; Vercel despliega la función por separado de `dist/`. No existe escritura persistente en el disco efímero de Vercel. Los borradores y respaldos en GitHub se cifran con AES-256-GCM; los archivos de publicaciones anteriores se conservan en el historial Git. Para restaurar una versión publicada, exporta antes el borrador actual y recupera el JSON anterior desde GitHub; después impórtalo, revísalo y publícalo. Los respaldos `.enc` requieren la clave privada para recuperarse.

Los cambios del panel generan commits en `main`: antes de futuras modificaciones locales del código, sincroniza esos commits sin sobrescribirlos. La integración Git puede ejecutar un build al guardar un borrador o subir archivos; guardar un borrador conserva intacto el contenido público.

## Desarrollo

`npm run build` prepara `dist/` con los recursos ya compilados. Después de modificar `ui/*.jsx`, ejecuta `npm run build:ui` antes del build; ese comando usa React/React DOM 19.2.3 y esbuild 0.25.12 existentes en `motion/node_modules`. La animación Remotion tiene su propia comprobación de tipos y build. Consulta README para esos comandos. Servir o construir esta versión con sus bundles existentes no requiere instalación.

Las pruebas locales se ejecutan con `node scripts/test-cms.mjs`; el backend de Vercel se verifica con `node scripts/test-cms-online.mjs`. Usan datos aislados, sin contactar servicios externos ni sobrescribir el contenido real. El segundo verifica sesión/CSRF, cifrado, respaldo, publicación atómica, conflictos, preservación de cambios ajenos, estados del despliegue y archivos de 8/12 MB.
