import { createSignal, useSignal } from 'react-use-signal';
import { useEffect, useRef, useState } from 'react';
import './style.css';

const ratio = 0.7;

const { innerWidth, innerHeight } = window;

const [state, setState] = createSignal('componentEditor', {
  down: false,
  dx: (innerWidth * 0.3) / 2,
  dy: (innerHeight * 0.3) / 2,
  mx: 0,
  my: 0
}, 'componentEditor', false);

const onMouseDown = (event) => {
  const { clientX:mx, clientY:my } = event;
  state.down = true;
  state.mx = mx;
  state.my = my;
};

const onMouseMOve = (event) => {
  if (state.down) {
    const { clientX, clientY } = event;
    const x = clientX - state.mx;
    const y = clientY - state.my;
    setState({ dx: state.dx + x, dy: state.dy + y, mx: x, my: y });
  };
};
const onMouseUp = () => {
  state.down = false;
};

const ComponentEditorHeader = () => {
  const header = useRef();

  useEffect(() => {
    const { current } = header;

    if (current) {
      current.onmousedown = onMouseDown;
      document.addEventListener('mousemove', onMouseMOve);
      document.addEventListener('mouseup', onMouseUp);
    };
    return () => {
      document.removeEventListener('mousemove', onMouseMOve);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }, []);

  return (
    <div className='component-editor-header-container' ref={header}></div>
  )
};

const ComponentEditor = () => {
  const [state, setState] = useSignal('componentEditor');
  const { dx, dy } = state;
  const { innerWidth, innerHeight } = window;

  return (
    <div
      className='component-editor-container'
      style={{
        width: innerWidth * ratio,
        height: innerHeight * ratio,
        top: `${dy}px`,
        left: `${dx}px`
      }}>
      <ComponentEditorHeader />
    </div>
  );
};

export default ComponentEditor;