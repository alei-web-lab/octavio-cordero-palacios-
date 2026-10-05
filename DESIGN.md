---
name: Renovación 63
description: Cartel rural con fotografía local y lectura pública clara.
colors:
  paper: "#fffaf6"
  surface: "#fffdf8"
  ink: "#213328"
  muted: "#546052"
  accent: "#ff5d15"
  accent-dark: "#7a2d0a"
  accent-dark-fallback: "#b43c08"
  soft: "#fff0e6"
  line: "#deded4"
  button-text: "#15261d"
  white: "#fff"
  plan-ground: "#edf1eb"
  gallery-ground: "#20372e"
  gallery-muted: "#d6dfd6"
  contact-ground: "#f7efe8"
  faq-ground: "#f1f3ef"
  cms-paper: "#f4f5f2"
  cms-muted: "#59665e"
  cms-line: "#dce2dc"
typography:
  display:
    fontFamily: "Barlow Condensed, Manrope, sans-serif"
    fontSize: "clamp(3rem, 5.6vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-.015em"
  title:
    fontFamily: "Barlow Condensed, Manrope, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.01em"
  lead:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "-.015em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  cms-display:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.025em"
  cms-heading:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-.015em"
  cms-body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  button: "4px"
  field: "7px"
  control: "8px"
  search: "10px"
  card: "12px"
  viewer: "16px"
  panel: "18px"
  chapter: "64px 64px 0 0"
  chapter-mobile: "30px 30px 0 0"
  circle: "50%"
spacing:
  small: "8px"
  medium: "16px"
  block: "24px"
  panel: "36px"
  section-mobile: "64px"
  section-desktop: "104px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.button}"
    padding: "14px 21px"
  button-primary-hover:
    backgroundColor: "#ff742f"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "14px 21px"
  cms-button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "44px"
  cms-button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "44px"
  plan-search:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.search}"
    padding: "0 16px"
    height: "54px"
  plan-panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "36px"
  cms-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
  cms-block:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "28px"
---

# Design System: Renovación 63

## Overview

**Creative North Star: "Cartel rural con fotografía local"**

Se conserva la identidad confirmada: marca gestual naranja, titulares condensados y fotografías reales en marcos claros inclinados. Las seis referencias fijadas por el usuario aportan collage y escala; la corrección de fondos claros mantiene el naranja como acento. Esta actualización documenta la extensión implementada, sin sustituir la identidad ni afirmar un comp aprobado.

La consulta del plan y el editor usan orden de lectura convencional. La landing distingue seis superficies de contenido; el CMS emplea DM Sans, blancos y grises, campos agrupados y acciones explícitas. Contratos: `.impeccable/surface.md` y `.impeccable/cms-surface.md`. La puntuación final confirma cuatro correcciones resueltas con `ship`, limitada a ese lote; el `ship` anterior solo cubre su lote histórico.

**Key Characteristics:**

- Collage fotográfico angular y marca de pincel sobre base clara.
- Naranja de acento y tinta verde oscura.
- Titulares condensados; cuerpo de lectura en DM Sans local.
- Superficies por capítulo y componentes operativos ordenados.
- Movimiento con control, foco visible y alternativas estáticas.

## Colors

La paleta combina papel cálido, tinta vegetal y naranja; los valores normativos están en el frontmatter.

### Primary

- **Naranja de campaña:** acento confirmado por la muestra del usuario; botones, marcas de selección y trazos.
- **Naranja oscuro:** marca, iconos y foco en superficies claras. `applyContent` deriva `--accent-dark` multiplicando y redondeando cada canal RGB del acento editable por .48; el token registra el resultado del acento actual. El valor de respaldo CSS y la marca fija del CMS quedan identificados por separado.
- **Durazno suave:** énfasis puntual y fondos de controles.

### Secondary

- **Verde de galería:** fondo profundo que enmarca las fotografías con texto marfil y secundario claro.
- **Verde de plan:** base calmada bajo el buscador, las pestañas y el panel blanco.
- **Verde gris de preguntas:** diferencia el cierre informativo.

### Neutral

- **Papel y superficie marfil:** movimiento, hero, guía y pie; el hero conserva radiales durazno sutiles.
- **Blanco:** equipo, panel del plan y bloques del editor.
- **Tinta y texto secundario:** jerarquía de lectura y divisores discretos.
- **Base cálida de contacto:** capítulo de conversación con radial naranja de opacidad baja.
- **Papel, texto secundario y línea del CMS:** fondo gris claro, lectura operativa y límites de campos.

**The Accent Rule.** El naranja identifica acciones y marca; no rellena la página ni los capítulos.

## Typography

**Display Font:** Barlow Condensed 700/800, con Manrope y sans-serif de respaldo.  
**Body Font:** DM Sans, con sans-serif de respaldo.  
**Firma de cabecera:** Manrope 800.

La marca gráfica conserva la frase «Amor por Octavio Cordero Palacios». Su arte claro integra escritura gestual y bloque sans; no se reemplaza por una fuente de interfaz. Las fuentes se sirven localmente y preservan OFL.

### Hierarchy

- **Display:** titulares de sección condensados y en mayúsculas, con la escala fluida registrada. En móvil se ajustan a 3.2rem y a 2.85rem en el ancho menor; la galería tiene ajuste propio.
- **Title:** títulos y nombres condensados; el plan usa 38px en escritorio y 31px en móvil.
- **Lead:** introducción del movimiento, de 24px a 21px en móvil.
- **Body:** base de 16px; propuestas de 14–15px y medida habitual de hasta 65ch.
- **Label:** controles y navegación; peso medio y nombres explícitos.
- **CMS:** título de 30px, encabezados de 19px, cuerpo de 14px; el título móvil se adapta a 28/26px.

**The Reading Rule.** La tipografía condensada organiza titulares; DM Sans mantiene propuestas y campos legibles.

## Layout

El contenedor público alcanza 1280px y usa 88% del ancho en escritorio; en móvil deja 22px por lado, o 18px hasta 360px. El ritmo de secciones baja de 104px a 80px hasta 950px y 64px hasta 680px. `scrollbar-gutter: stable` reserva el ancho de desplazamiento.

La portada conserva frase/acciones a la izquierda y collage a la derecha; en móvil fotografía y cartel se superponen encima de las acciones. El plan presenta buscador, seis pestañas con desplazamiento horizontal contenido y panel de dos columnas; desde 680px el panel usa una columna. La galería dispone dos fotografías escalonadas en escritorio y carrusel horizontal en móvil. Los seis capítulos tienen superficies distintas: movimiento, plan, equipo, galería, contacto y preguntas.

La cabecera pública es sticky y el menú cambia hasta 950px. El CMS tiene cabecera fija de 82px, barra lateral de 232px y editor de hasta 1040px; a 1100px reduce la barra a 210px. Hasta 850px usa menú móvil, cabecera de 132px y campos en una columna. La vista previa es un panel lateral; en móvil ocupa hasta el ancho disponible.

## Elevation & Depth

Predominan capas tonales, bordes suaves y superposición real del collage. El formulario tiene sombra ambiental tenue; el visor modal y los paneles móviles del editor tienen sombras funcionales. No se añade sombra a cada bloque.

### Shadow Vocabulary

- **Formulario:** `0 18px 40px rgba(44,56,41,.055)`.
- **Visor:** `0 25px 90px #05180d55`, con fondo modal oscuro y desenfoque de 2px.
- **Panel móvil CMS:** `10px 12px 24px #21332814` para menú y `-10px 10px 30px #21332814` para vista previa.

**The Layer Rule.** Tonos y bordes distinguen bloques; las sombras apoyan el formulario y las superficies superpuestas.

## Shapes

Marcos fotográficos claros con inclinaciones de −2/4/5 grados sostienen el collage incumbente. Las secciones del plan, galería y contacto tienen esquinas superiores amplias, reducidas en móvil. El panel del plan tiene curvas de 18px, los bloques CMS de 12px y los campos CMS de 7px. Botones públicos mantienen 4px; controles del editor, 8px. Los campos de contacto públicos conservan esquinas rectas. Los controles circulares identifican carrusel y visor.

Los separadores de capítulo son pequeños trazos naranjas. Los recortes de imagen sirven al collage y al encuadre fotográfico; no definen una regla general de recorte para texto.

## Components

### Buttons

Acciones claras con texto e iconos SVG decorativos. El botón público principal tiene altura mínima de 52px; el editor 44px en escritorio y 48px en cabecera móvil. El primario cambia a naranja más claro al hover; el outline público invierte tinta/papel. Presión escala a .97/.98; el hover público desplaza 2px solo con puntero fino. Foco visible de 3px.

### Chips

El estado informativo usa durazno suave, tinta y peso alto. La selección de tema se presenta en la pestaña mediante color naranja oscuro y línea inferior; el subrayado expresa estado.

### Cards / Containers

Panel del plan blanco con borde verde tenue y padding de 36px, reducido en móvil. Bloques CMS blancos, borde gris y padding de 28px; agrupación por contenido. Retratos reales pendientes conservan espacios identificados, sin imágenes ficticias.

### Inputs / Fields

Buscador blanco de 54px con icono, botón para limpiar y foco por `focus-within`. Campos públicos de al menos 48px; CMS de 45px con etiquetas asociadas y notas de ayuda. Guardado en curso deshabilita campos y acciones para evitar cambios concurrentes. Mensajes distinguen éxito y error mediante texto y color.

### Navigation

Marca y menú público conservan identidad; progreso de lectura real en la base de cabecera. Pestañas del plan usan selección, foco itinerante y flechas/Home/End. La navegación del CMS marca sección actual y ofrece menú en móvil; la elección lleva al comienzo del editor. El índice permite llegar a cada sección.

### Visor y movimiento de marca

El visor es un `dialog` nativo con título, crédito, anterior/siguiente, cierre y Escape; restaura foco al cerrar. Las fotos mantienen autoría y licencia visible.

El Player de Remotion 4.0.530 conserva wordmark claro, fondo de superficie, cuatro trazos de esquina con `accentColor` y ciclo de 12s a 30fps. El movimiento depende del fotograma; no es una simulación CSS ni una exportación MP4. Revela aproximadamente 1.15s, mantiene lectura y retorna. El arte estático permanece durante carga o ante movimiento reducido, ahorro de datos o fallo. Móvil espera interacción/control; pausa manual, fuera de pantalla y pestaña oculta. El panel del plan usa entrada de 220ms por puntero, omitida para teclado y movimiento reducido; el CSS de detalles usa 180ms.

**The State Rule.** Movimiento y color explican selección, carga o lectura; controles y alternativas estáticas permanecen disponibles.

## Do's and Don'ts

### Do:

- **Do** conservar marca gestual, cartel rural y fotografía local con su procedencia.
- **Do** usar naranja como acento y las superficies registradas para capítulos y editor.
- **Do** mantener DM Sans para lectura, campos y acciones con nombres explícitos.
- **Do** conservar foco visible, teclado, pausa y alternativas estáticas.
- **Do** registrar el alcance real de capturas y revisión.

### Don't:

- **Don't** rellenar la página o las secciones de naranja.
- **Don't** introducir fotografías, retratos, biografías o destinos sociales ficticios.
- **Don't** confundir guardado/aplicación local con publicación o edición remota.
- **Don't** presentar métricas o un ship histórico como evidencia actual de toda la extensión.
