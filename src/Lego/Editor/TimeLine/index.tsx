// @ts-ignore
import { useSignal } from 'react-use-signal';

import './style.css';

const TimeLine = () => {
  const [currentComponent] = useSignal('app', 'currentComponent');
  const onClick = (event: any) => {
    event.stopPropagation();
  };
  console.log(currentComponent?.name)

  if (currentComponent?.name !== 'slider') return null;
  return (
    <div className="editor-timeline-container" onClick={onClick}>666</div>
  )
};

export default TimeLine;