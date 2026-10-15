import {useEffect, useState, type CSSProperties} from 'react';
import {AbsoluteFill, cancelRender, Composition, continueRender, delayRender, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type CampaignOutroProps = {
  readonly photoSrc: string;
};

/** La foto permanece inmóvil y completa. Solo se animan las letras en el cielo. */
export const CampaignOutro = ({photoSrc}: CampaignOutroProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const easing = Easing.bezier(0.16, 1, 0.3, 1);
  const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp', easing} as const;
  const [fontHandle] = useState(()=>delayRender('Cargar letra manuscrita de pincel'));
  useEffect(()=>{
    document.fonts.load('146px "Kaushan Script"').then(loaded=>{
      if(!loaded.length)throw new Error('La letra manuscrita no se ha cargado');
      continueRender(fontHandle);
    }).catch(cancelRender);
  },[fontHandle]);
  const lettering:CSSProperties={fontFamily:'"Kaushan Script", cursive',fontWeight:400,textAlign:'center',whiteSpace:'nowrap',lineHeight:1.05,margin:0,WebkitTextStroke:'2px #fffaf6',paintOrder:'stroke fill'};
  return <AbsoluteFill style={{backgroundColor:'#213328', overflow:'hidden'}}>
    <style>{`@font-face{font-family:'Kaushan Script';src:url('${staticFile('fonts/kaushan-script-regular.ttf')}') format('truetype');font-weight:400;font-style:normal;font-display:block}`}</style>
    <Img src={photoSrc} alt="Fotografía original de los cinco integrantes al atardecer" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain'}}/>
    <div aria-label="Amor por" style={{position:'absolute',left:90,top:119,width:900,height:205,overflow:'hidden',opacity:interpolate(frame,[.1*fps,.7*fps],[0,1],clamp),translate:`0 ${interpolate(frame,[.1*fps,.8*fps],[18,0],clamp)}px`,clipPath:`inset(0 ${interpolate(frame,[.1*fps,.85*fps],[100,0],clamp)}% 0 0)`} as CSSProperties}>
      <p style={{...lettering,fontSize:172,color:'#ff5d15'}}>Amor por</p>
    </div>
    <div aria-label="Octavio Cordero" style={{position:'absolute',left:90,top:315,width:900,opacity:interpolate(frame,[.45*fps,.95*fps],[0,1],clamp),translate:`0 ${interpolate(frame,[.45*fps,1.05*fps],[14,0],clamp)}px`} as CSSProperties}>
      <p style={{...lettering,fontSize:126,color:'#213328'}}>Octavio Cordero</p>
    </div>
    <div aria-label="Palacios" style={{position:'absolute',left:90,top:461,width:900,opacity:interpolate(frame,[.7*fps,1.15*fps],[0,1],clamp),translate:`0 ${interpolate(frame,[.7*fps,1.25*fps],[14,0],clamp)}px`} as CSSProperties}>
      <p style={{...lettering,fontSize:146,color:'#213328'}}>Palacios</p>
    </div>
  </AbsoluteFill>;
};

export const CampaignOutroComposition = () => <Composition
  id="AmorPorOctavioOutro"
  component={CampaignOutro}
  durationInFrames={120}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    photoSrc:staticFile('brand/equipo-cierre-original-20261015.jpg'),
  }}
/>;
