# Fuentes locales

Las familias se sirven desde el propio sitio para evitar solicitudes externas al cargar la página.

- `manrope-latin.woff2`: Manrope, normal, peso variable 400–800. Fuente oficial: https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSg.woff2
- `dm-sans-latin.woff2`: DM Sans, normal, peso variable 400–800. Fuente oficial: https://fonts.gstatic.com/s/dmsans/v17/rP2Hp2ywxg089UriCZOIHQ.woff2

Los subconjuntos Latin incluyen las letras acentuadas y la ñ utilizadas en español. Se obtuvieron mediante la hoja oficial de Google Fonts:

https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&family=DM+Sans:opsz,wght@9..40,400..800&display=swap

Las dos familias están bajo la SIL Open Font License 1.1. Las licencias completas se conservan en `Manrope-OFL.txt` y `DMSans-OFL.txt`, descargadas del repositorio oficial:

- https://github.com/google/fonts/tree/main/ofl/manrope
- https://github.com/google/fonts/tree/main/ofl/dmsans

Declarar ambas con `font-display: swap` y `font-weight: 400 800`.

## Barlow Condensed para titulares de cartel

- `barlow-condensed-latin-700.woff2`: Barlow Condensed, normal, peso 700. Fuente oficial: https://fonts.gstatic.com/s/barlowcondensed/v13/HTxwL3I-JCGChYJ8VI-L6OO_au7B46r2z3bWuQ.woff2
- `barlow-condensed-latin-800.woff2`: Barlow Condensed, normal, peso 800. Fuente oficial: https://fonts.gstatic.com/s/barlowcondensed/v13/HTxwL3I-JCGChYJ8VI-L6OO_au7B47b1z3bWuQ.woff2

Son archivos estáticos distintos. Declarar un `@font-face` por cada peso con `font-family: 'Barlow Condensed'`, `font-style: normal` y `font-display: swap`. Los subconjuntos Latin incluyen acentos y ñ del español.

Hoja oficial utilizada: https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap

Licencia SIL Open Font License 1.1 conservada en `BarlowCondensed-OFL.txt`. Repositorio oficial: https://github.com/google/fonts/tree/main/ofl/barlowcondensed
