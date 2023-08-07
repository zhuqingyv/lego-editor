import { useEffect, useRef, useState, useCallback } from 'react';
import './style.css';

const ratio = 0.7;

const { innerWidth, innerHeight } = window;

const mouseInfo = {
  down: false,
  x: (innerWidth * 0.3) / 2,
  y: (innerHeight * 0.3) / 2,
  mx: 0,
  my: 0,
};

const ComponentEditor = (props: any) => {
  const { show = false, children = null, title = '', onClose = () => null, onMounted = () => null } = props;
  const [state, setState] = useState(mouseInfo);

  const header = useRef() as any;
  const { x, y } = state;

  const onMouseDown = useCallback((event: any) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    mouseInfo.down = true;
    mouseInfo.mx = clientX;
    mouseInfo.my = clientY;
  }, [state]);
  
  const onMouseMove = (event: any) => {
    if (mouseInfo.down) {
      event.preventDefault();
      const { x, y, mx, my } = mouseInfo;
      const { clientX, clientY } = event;
      const _x = clientX - mx;
      const _y = clientY - my;
      mouseInfo.x = x + _x;
      mouseInfo.y = y + _y;
      mouseInfo.mx = clientX;
      mouseInfo.my = clientY;
      setState({ ...mouseInfo });
    };
  };
  
  const onMouseUp = (event: any) => {
    mouseInfo.down = false;
    event.preventDefault();
  };

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
  }, [header.current]);

  useEffect(() => {
    if (show) onMounted();
  }, [show]);

  if (!show) return null;

  return (
    <div
      className='drag-move-container'
      style={{
        width: innerWidth * ratio,
        height: innerHeight * ratio,
        top: `${y}px`,
        left: `${x}px`
      }}>
      <div className='drag-move-header-container' ref={header}>
        { !!(title) && <div className='drag-move-header-title'>{ title }</div> }
        <img src='https://picasso-static.xiaohongshu.com/fe-platform/631afc566794af19239d3169f6d6cab45f60114e.png' onClick={onClose} />
      </div>
      <div style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
        { children }
      </div>
    </div>
  );
};

export default ComponentEditor;