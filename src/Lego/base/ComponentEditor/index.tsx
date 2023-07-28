import { createSignal, useSignal } from 'react-use-signal';
import { useEffect, useRef, useState } from 'react';
import './style.css';

const ratio = 0.7;

const { innerWidth, innerHeight } = window;

export const [state, setState] = createSignal('componentEditor', {
  down: false,
  x: (innerWidth * 0.3) / 2,
  y: (innerHeight * 0.3) / 2,
  mx: 0,
  my: 0,
  show: false
}, 'componentEditor', false);

const onMouseDown = (event: any) => {
  event.preventDefault();
  const { clientX, clientY } = event;
  state.down = true;
  state.mx = clientX;
  state.my = clientY;
};

const onMouseMove = (event: any) => {
  if (state.down) {
    event.preventDefault();
    const { x, y, mx, my } = state;
    const { clientX, clientY } = event;
    const _x = clientX - mx;
    const _y = clientY - my;
    const X = x + _x;
    const Y = y + _y;
    setState({ x: X, y: Y, mx: clientX, my: clientY });
  };
};

const onMouseUp = (event: any) => {
  state.down = false;
  event.preventDefault();
};

const ComponentEditorHeader = () => {
  const header = useRef();

  useEffect(() => {
    const { current } = header;

    if (current) {
      current.onmousedown = onMouseDown;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }, []);

  return (
    <div className='component-editor-header-container' ref={header}></div>
  )
};

const ComponentEditor = () => {
  const [state, setState] = useSignal('componentEditor');
  const { show, x, y } = state;
  const { innerWidth, innerHeight } = window;

  if (!show) return null;

  return (
    <div
      className='component-editor-container'
      style={{
        width: innerWidth * ratio,
        height: innerHeight * ratio,
        top: `${y}px`,
        left: `${x}px`
      }}>
      <ComponentEditorHeader />
    </div>
  );
};

export default ComponentEditor;