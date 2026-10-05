import type {CSSProperties} from 'react';
import {
  AbsoluteFill,
  CanvasImage,
  Composition,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type CampaignMotionProps = {
  readonly wordmarkSrc: string;
  readonly backgroundColor: string;
  readonly onAssetError?: (error: Error) => void;
  readonly accentColor?: string;
};

/** La imagen oficial permanece completa; toda la animación depende del fotograma. */
export const CampaignMotion = ({
  wordmarkSrc,
  backgroundColor,
  onAssetError,
  accentColor = '#ff5d15',
}: CampaignMotionProps) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor, overflow: 'hidden'}}>
      <CanvasImage
        name="Identidad de la campaña"
        src={wordmarkSrc}
        width={width}
        height={height}
        fit="contain"
        premountFor={fps}
        pauseWhenLoading
        onError={onAssetError}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: interpolate(frame, [0, 0.75 * fps, 11.25 * fps, 12 * fps - 1], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          scale: interpolate(spring({
            frame,
            fps,
            config: {damping: 22, stiffness: 100, mass: 0.8, overshootClamping: true},
          }), [0, 1], [0.94, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          translate: `0 ${interpolate(frame, [0, 1.2 * fps, 9 * fps, 11.25 * fps, 12 * fps - 1], [26, 0, 0, 0, 26], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px`,
        } as CSSProperties}
      />
      {[{left:28,top:28,rotate:'0deg'},{right:28,top:28,rotate:'90deg'},{right:28,bottom:28,rotate:'180deg'},{left:28,bottom:28,rotate:'270deg'}].map((corner,index) => (
        <div key={index} aria-hidden="true" style={{position:'absolute',...corner,width:46,height:46,pointerEvents:'none',opacity:interpolate(frame,[.35*fps,.9*fps,2.6*fps,3.2*fps],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),scale:interpolate(frame,[.35*fps,1.1*fps],[.8,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)})} as CSSProperties}>
          <span style={{position:'absolute',left:0,top:0,width:46,height:4,backgroundColor:accentColor,clipPath:`inset(0 ${interpolate(frame,[.35*fps+index*2,.95*fps+index*2],[100,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}% 0 0)`}}/>
          <span style={{position:'absolute',left:0,top:0,width:4,height:46,backgroundColor:accentColor,clipPath:`inset(0 0 ${interpolate(frame,[.35*fps+index*2,.95*fps+index*2],[100,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}% 0)`}}/>
        </div>
      ))}
      <AbsoluteFill
        style={{
          backgroundColor,
          pointerEvents: 'none',
          clipPath: `inset(0 0 0 ${interpolate(frame, [0, 1.15 * fps, 11.25 * fps, 12 * fps - 1], [0, 100, 100, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const CampaignComposition = () => (
  <Composition
    id="CampaignIdentity"
    component={CampaignMotion}
    durationInFrames={360}
    fps={30}
    width={960}
    height={874}
    defaultProps={{
      wordmarkSrc: staticFile('brand/campaign-wordmark-light.webp'),
      backgroundColor: '#fffdf8',
    }}
  />
);
