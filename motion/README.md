# Animación de la identidad

Subproyecto local de Remotion 4.0.530 para Renovación 63. `CampaignIdentity` anima la imagen «Se siente AMOR POR OCTAVIO CORDERO PALACIOS» sin modificar sus letras ni añadir mensajes. La composición usa una base casi blanca `#fffdf8` y concentra el naranja en las letras.

## Preparar y revisar

Desde `motion/`, con Node.js y pnpm disponibles:

```powershell
pnpm install
pnpm run build:player
pnpm run typecheck
pnpm run studio
```

El navegador recibe la animación mediante `../public/motion/player.js`. Usa el recurso optimizado `/brand/campaign-wordmark-light.webp` de 106.752 bytes, compartido con la imagen estática de respaldo. `build:player` copia ese WebP existente de `../public/brand/` a `motion/public/brand/` para que Studio use el mismo recurso. Esa copia se puede regenerar y se excluye de Git.

Studio queda en `http://localhost:3001/CampaignIdentity`; el sitio principal usa el puerto 3000. Abrir Studio permite revisar fotogramas y ajustar la composición. Este flujo crea una vista previa editable y el reproductor web; no publica la página ni exporta un MP4.

## Fuentes editables

- `src/Composition.tsx`: animación con `useCurrentFrame`, `spring` e `interpolate`, y registro de la composición.
- `src/player.tsx`: integración del Player con el sitio.
- `scripts/build-player.mjs`: compila un módulo ESM autocontenido, sin CDN en producción.

La composición dura 12 segundos, tiene 30 fotogramas por segundo y mide 960 × 874 px. La entrada dura aproximadamente 1,15 segundos, mantiene el texto completo visible y termina con una transición suave al inicio. Se escala con el contenedor de la página.

## Integración

```javascript
const {mountCampaignMotion} = await import('/motion/player.js');
const animation = mountCampaignMotion(container, {
  autoPlay: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  loop: true,
  onError: () => showStaticPoster(),
});
await animation.ready;
hideStaticPoster();
```

`ready` y `readyPromise` son la misma promesa. Se resuelven cuando Remotion termina de preparar y dibujar la imagen; también se puede pasar `onReady`. El sitio debe mantener su imagen estática hasta ese momento y recuperarla ante un error.

`pause()` conserva el fotograma actual; `play()` reanuda la reproducción desde allí y `dispose()` libera el Player. `showStill()` detiene la animación en el fotograma 60 para mostrar el texto completo cuando se necesite una vista inmóvil. No hay audio, controles superpuestos ni pantalla completa. La página controla pausa, visibilidad y movimiento reducido con su imagen estática de respaldo.

Los paquetes Remotion se fijan a la misma versión. La configuración de pnpm permite únicamente el script de instalación de esbuild; la web principal mantiene sus propias dependencias y comandos.

Documentación oficial: [Player](https://www.remotion.dev/docs/player/player), [Studio](https://www.remotion.dev/docs/cli/studio).
