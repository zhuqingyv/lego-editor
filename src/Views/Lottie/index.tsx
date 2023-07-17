import { useState } from 'react';
import Lottie from 'lottie-react';
import './index.css';

const Mask = (props) => {
  const { children, schemaValue = {} } = props;
  const { source, position = {} } = schemaValue;
  const { top, left } = position;

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

  if (!animationData) return null;

  return (
    <div className='lottie-container' style={{ top: `${top}px`, left: `${left}px` }}>
      <Lottie
        animationData={animationData}
      />
    </div>
  );
};

export default Mask;