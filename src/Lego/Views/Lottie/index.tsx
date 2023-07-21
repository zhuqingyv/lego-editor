import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import './index.css';

const LottieView = (props: any) => {
  const { schemaValue = {}, children } = props;
  const { source, position = {}, playControl = {}} = schemaValue;
  const { top, left } = position;
  const { autoPlay, loop, showType } = playControl;

  const [state, setState] = useState(() => {
    fetch(source).then(async(res) => {
      const animationData = await res.json();
      setState({ animationData });
    });
    return {
      animationData: null
    };
  })
  const { animationData } = state as any;

  useEffect(() => {
    fetch(source).then(async(res) => {
      const animationData = await res.json();
      setState({ animationData });
    });
  }, [source, autoPlay, loop, showType]);

  if (!animationData) return null;

  return (
    <div className='lottie-container' style={{ top: `${top}px`, left: `${left}px` }}>
      <Lottie
        animationData={animationData}
        autoplay={autoPlay}
        loop={loop}
      />
      { children }
    </div>
  );
};

export default LottieView;