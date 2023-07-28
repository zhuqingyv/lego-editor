import { useSignal } from 'react-use-signal';
import DragMoveContainer from '../base/DragMoveContainer';

const ComponentEditor = () => {
  const [isDev] = useSignal('app', 'isDev');

  if (!isDev) return null;
  return (
    <DragMoveContainer show={true} title="组件编辑">
      <div>666666</div>
    </DragMoveContainer>
  )
};

export default ComponentEditor;