# Editar Renovación 63

Inicia el proyecto con `npm run dev` y abre [el editor local](http://127.0.0.1:3000/admin/). La página se encuentra en [127.0.0.1:3000](http://127.0.0.1:3000/). Necesitas Node.js 20 o posterior. Los componentes React ya están preparados; no necesitas instalar paquetes para usar esta versión.

## Guardar y revisar

1. Selecciona una sección del índice o del menú. En celular, abre el menú de la cabecera.
2. Edita sus campos. Puedes cambiar textos, propuestas, nombres, roles, perfiles, fotografías, contactos, preguntas, identidad y orden de las secciones.
3. Pulsa **Guardar borrador** para conservar los cambios en este equipo sin modificar la versión visible.
4. Abre **Vista previa**. Si hay cambios nuevos, el panel los guarda como borrador antes de abrirla; la versión visible conserva su contenido.
5. Pulsa **Aplicar al sitio local** cuando estés conforme. Actualiza la página de este equipo y guarda un respaldo de la versión visible anterior. Recarga la página pública para ver los cambios.

Guardar y aplicar no publican en internet. Si otro panel cambia el contenido, el editor evita sobrescribirlo y solicita recargar. Exporta tus cambios antes de recargar si necesitas conservarlos. **Exportar copia** descarga los campos del panel en JSON; **Importar copia** los carga para que puedas revisarlos antes de guardarlos o aplicarlos.

## Fotografías y documentos

Las imágenes admitidas son JPG, PNG o WebP, de hasta 8 MB. El plan descargable admite PDF de hasta 12 MB. Los archivos se guardan en `public/uploads/` con un nombre nuevo. Subir un archivo todavía no cambia la página: guarda el borrador o aplica los cambios después de subirlo.

La galería debe contener solo fotografías de **Octavio Cordero Palacios**. Confirma su ubicación y completa título, descripción accesible, autor, licencia y fuente cuando correspondan. Actualmente hay dos fotografías verificadas de la parroquia; la fotografía de Busa y sus variantes fueron eliminadas. Los retratos del equipo tienen espacios identificados hasta contar con fotos reales.

El plan contiene seis temas con IDs fijos (`vialidad`, `produccion`, `inclusion`, `seguridad`, `ambiente`, `gestion`) y el equipo cuatro integrantes. Puedes editar sus contenidos y agregar o eliminar propuestas dentro de cada tema. En **Marca y estructura** puedes modificar el acento naranja, la marca gráfica, el menú, los metadatos y la visibilidad u orden de las secciones. El texto impreso dentro de la marca cambia al reemplazar su imagen.

Facebook, Instagram y TikTok permanecen como canales previstos hasta introducir sus enlaces oficiales. Cada red pendiente mantiene su indicador aunque otro contacto ya esté configurado. El formulario público conserva la descripción editable y añade aparte la guía operativa; prepara un borrador en la aplicación de correo cuando hay un correo configurado. Esta web no recibe ni almacena consultas.

## Archivos y respaldos

| Archivo o carpeta | Uso |
| --- | --- |
| `public/content/site.json` | Contenido visible y incluido en el build estático. |
| `cms/draft.json` | Borrador guardado, privado; queda fuera del build y de las rutas estáticas. |
| `cms/backups/` | Versiones visibles anteriores a cada aplicación, en JSON. |
| `public/uploads/` | Fotografías y documentos públicos cargados en el editor. |

`src/content.js` carga y valida el JSON público o el borrador; `src/default-content.js` proporciona el respaldo si no puede leerse. Para edición habitual usa el CMS o `public/content/site.json`.

Para recuperar un respaldo, importa su JSON desde el panel, revisa el contenido y aplícalo. Exportar contenido no copia las imágenes: conserva también la carpeta del proyecto o `public/uploads/` al trasladar el sitio.

## Acceso desde celular cuando se publique

El diseño del editor ya se adapta a celulares. Su API actual está disponible **solo en este equipo**, en `127.0.0.1`; no tiene inicio de sesión remoto ni almacenamiento en la nube. El alojamiento estático de `dist/` muestra la página, pero no proporciona las rutas de guardado del CMS.

En la etapa de publicación se conectará un acceso privado con autenticación, permisos y almacenamiento duradero de contenido y archivos. Esa conexión es necesaria para que puedas editar desde tu celular y conservar los cambios en el sitio publicado. No debes exponer directamente este servidor local como solución de CMS remoto.

## Desarrollo

`npm run build` prepara `dist/` con los recursos ya compilados. Después de modificar `ui/*.jsx`, ejecuta `npm run build:ui` antes del build; ese comando usa React/React DOM 19.2.3 y esbuild 0.25.12 existentes en `motion/node_modules`. La animación Remotion tiene su propia comprobación de tipos y build. Consulta README para esos comandos. Servir o construir esta versión con sus bundles existentes no requiere instalación.

Las pruebas de persistencia y validación del CMS se ejecutan con `node scripts/test-cms.mjs`. Usan una carpeta aislada y no sobrescriben el contenido real del proyecto.
