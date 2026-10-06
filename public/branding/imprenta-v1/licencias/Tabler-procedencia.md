# Iconos de Tabler

Familia única: **Tabler Icons Outline**, con **38 símbolos locales**. [Repositorio oficial](https://github.com/tabler/tabler-icons). Licencia MIT en `LICENSE.txt`.

Las dos incorporaciones tienen procedencias distintas:

- Los **22 símbolos originales** están fijados al commit `a49ebdf8e13cc30794a5629c5b637e13ed5699d0`.
- Los **16 añadidos** se obtuvieron de la rama oficial `main` el **2026-10-04** mediante `scripts/add-icons.mjs`. El script y los comentarios del sprite conservan las URL consultadas. No se registró un SHA de esa rama en esta incorporación; no se les atribuye el commit anterior.

La geometría se conserva y el contenedor SVG se adapta a `symbol`, con `viewBox="0 0 24 24"`, `currentColor`, `fill="none"` y trazo base de 1.5. El CSS ajusta algunos tamaños y grosores por componente (incluido CMS y gráficos de tema).

## Integración

```html
<svg viewBox="0 0 24 24" aria-hidden="true">
  <use href="/icons/sprite.svg?v=2#arrow"></use>
</svg>
```

Sustituye `arrow` por el ID del símbolo. `ui/shared.jsx` utiliza la misma versión local `?v=2`. Los iconos son decorativos: la etiqueta accesible pertenece al botón, enlace o campo. No se hacen llamadas externas durante el uso del sitio.

## Símbolos originales: 22, commit fijado

| ID local | Icono Tabler | Fuente |
| --- | --- | --- |
| `landscape` | `mountain` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/mountain.svg) |
| `community` | `users-group` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/users-group.svg) |
| `leaf` | `leaf` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/leaf.svg) |
| `document` | `file-text` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/file-text.svg) |
| `profile` | `user` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/user.svg) |
| `pause` | `player-pause` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/player-pause.svg) |
| `play` | `player-play` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/player-play.svg) |
| `arrow` | `arrow-right` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/arrow-right.svg) |
| `mail` | `mail` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/mail.svg) |
| `phone` | `phone` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/phone.svg) |
| `arrow-up-right` | `arrow-up-right` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/arrow-up-right.svg) |
| `map-pin` | `map-pin` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/map-pin.svg) |
| `chevron-left` | `chevron-left` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/chevron-left.svg) |
| `chevron-right` | `chevron-right` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/chevron-right.svg) |
| `arrow-down` | `arrow-down` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/arrow-down.svg) |
| `info-circle` | `info-circle` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/info-circle.svg) |
| `printer` | `printer` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/printer.svg) |
| `arrow-up` | `arrow-up` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/arrow-up.svg) |
| `menu` | `menu-2` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/menu-2.svg) |
| `close` | `x` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/x.svg) |
| `plus` | `plus` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/plus.svg) |
| `minus` | `minus` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/a49ebdf8e13cc30794a5629c5b637e13ed5699d0/icons/outline/minus.svg) |

## Símbolos añadidos: 16, main consultado el 2026-10-04

Los enlaces siguientes identifican la fuente de la incorporación; `main` es una rama mutable.

| ID local | Icono Tabler | Fuente |
| --- | --- | --- |
| `road` | `road` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/road.svg) |
| `shield` | `shield-check` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/shield-check.svg) |
| `droplet` | `droplet` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/droplet.svg) |
| `search` | `search` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/search.svg) |
| `save` | `device-floppy` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/device-floppy.svg) |
| `eye` | `eye` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/eye.svg) |
| `upload` | `upload` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/upload.svg) |
| `photo` | `photo` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/photo.svg) |
| `check` | `circle-check` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/circle-check.svg) |
| `trash` | `trash` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/trash.svg) |
| `refresh` | `refresh` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/refresh.svg) |
| `settings` | `adjustments-horizontal` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/adjustments-horizontal.svg) |
| `home` | `home` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/home.svg) |
| `facebook` | `brand-facebook` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/brand-facebook.svg) |
| `instagram` | `brand-instagram` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/brand-instagram.svg) |
| `tiktok` | `brand-tiktok` | [SVG oficial](https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/brand-tiktok.svg) |
