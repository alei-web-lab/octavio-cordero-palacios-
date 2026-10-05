import {Player, type CallbackListener, type PlayerRef} from '@remotion/player';
import {createRef} from 'react';
import {flushSync} from 'react-dom';
import {createRoot} from 'react-dom/client';
import {CampaignMotion} from './Composition';

export type MountCampaignMotionOptions = {
  readonly autoPlay?: boolean;
  readonly loop?: boolean;
  readonly wordmarkSrc?: string;
  readonly backgroundColor?: string;
  readonly accentColor?: string;
  readonly onReady?: () => void;
  readonly onError?: (error: Error) => void;
};

/** Monta un Player sin interfaz superpuesta. El sitio conserva su poster hasta ready. */
export const mountCampaignMotion = (
  element: HTMLElement,
  options: MountCampaignMotionOptions = {},
) => {
  const {autoPlay = true, loop = true, wordmarkSrc = '/brand/campaign-wordmark-light.webp', backgroundColor = '#fffdf8'} = options;
  const root = createRoot(element);
  const player = createRef<PlayerRef>();
  let disposed = false;
  let settled = false;
  let failed = false;
  let resolveReady: () => void = () => {};
  let rejectReady: (error: Error) => void = () => {};
  const ready = new Promise<void>((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });
  // Un consumidor puede elegir únicamente onReady/onError; no dejamos rechazos sin manejar.
  void ready.catch(() => {});

  const onError = (error: Error) => {
    if (disposed || failed) return;
    failed = true;
    settled = true;
    clearTimeout(deadline);
    player.current?.pause();
    rejectReady(error);
    options.onError?.(error);
  };
  const onReady = () => {
    if (disposed || settled) return;
    settled = true;
    clearTimeout(deadline);
    resolveReady();
    options.onReady?.();
  };
  const deadline = setTimeout(() => onError(new Error('No se pudo preparar la animación de Remotion.')), 15000);
  const handleError: CallbackListener<'error'> = (event) => onError(event.detail.error);
  const handleResume: CallbackListener<'resume'> = () => onReady();

  flushSync(() => root.render(
    <Player
      ref={player}
      component={CampaignMotion}
      inputProps={{wordmarkSrc, backgroundColor, accentColor: options.accentColor, onAssetError: onError}}
      durationInFrames={360}
      fps={30}
      compositionWidth={960}
      compositionHeight={874}
      style={{width: '100%', height: '100%', backgroundColor}}
      autoPlay={autoPlay}
      loop={loop}
      initialFrame={autoPlay ? 0 : 60}
      controls={false}
      clickToPlay={false}
      allowFullscreen={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      initiallyMuted
      numberOfSharedAudioTags={0}
      showVolumeControls={false}
      browserMediaControlsBehavior={{mode: 'prevent-media-session'}}
      bufferStateDelayInMilliseconds={0}
      errorFallback={() => null}
    />,
  ));
  player.current?.addEventListener('error', handleError);
  player.current?.addEventListener('resume', handleResume);

  return {
    ready,
    readyPromise: ready,
    pause: () => player.current?.pause(),
    showStill: () => {
      player.current?.pause();
      // Opción explícita para un fotograma inmóvil y completamente legible.
      player.current?.seekTo(60);
    },
    play: () => player.current?.play(),
    dispose: () => {
      if (disposed) return;
      disposed = true;
      clearTimeout(deadline);
      player.current?.removeEventListener('error', handleError);
      player.current?.removeEventListener('resume', handleResume);
      player.current?.pause();
      root.unmount();
      if (!settled) rejectReady(new Error('Animación desmontada.'));
    },
  };
};
