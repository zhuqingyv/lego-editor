import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
// @ts-ignore
import { safeParse } from 'lib';
import './style.css';

const ratio = 0.7;

const { innerWidth, innerHeight } = window;

// 修改位置
const mouseInfo = {
  down: false,
  x: (innerWidth * 0.3) / 2,
  y: (innerHeight * 0.3) / 2,
  mx: 0,
  my: 0,
  init() {
    const cache = localStorage.getItem('ComponentEditor-mouseInfo');
    if (cache) {
      return Object.assign(this, safeParse(cache, this));
    };
    return this;
  },
  update() {
    localStorage.setItem('ComponentEditor-mouseInfo', JSON.stringify(this))
  }
};

// 修改宽度
const mouseWidthInfo = {
  down: false,
  x: (innerWidth * 0.3) / 2,
  y: (innerHeight * 0.3) / 2,
  mx: 0,
  my: 0,
  width: 0,
  init() {
    const cache = localStorage.getItem('ComponentEditor-mouseWidthInfo');
    if (cache) {
      return Object.assign(this, safeParse(cache, this));
    };
    return this;
  },
  update() {
    localStorage.setItem('ComponentEditor-mouseWidthInfo', JSON.stringify(this))
  }
};

const DragMoveContainer = (props: any) => {
  const { show = false, children = null, title = '', onClose, onMounted = () => null, id: key } = props;
  const mouseInfo = useMemo(() => {
    const _key = key || (Math.random() * Date.now()).toString(16);
    const mouseInfo = {
      key: _key,
      down: false,
      x: (innerWidth * 0.3) / 2,
      y: (innerHeight * 0.3) / 2,
      mx: 0,
      my: 0,
      init() {
        const storage = key ? localStorage : sessionStorage;
        const storeName = key ? `ComponentEditor-mouseInfo-${key}`: 'ComponentEditor-mouseInfo';
        const cache = storage.getItem(storeName);
        if (cache) {
          return Object.assign(this, safeParse(cache, this));
        };
        return this;
      },
      update() {
        const storage = key ? localStorage : sessionStorage;
        const storeName = key ? `ComponentEditor-mouseInfo-${key}` : 'ComponentEditor-mouseInfo';
        storage.setItem(storeName, JSON.stringify(this))
      }
    };
    return mouseInfo;
  }, []);

  const mouseWidthInfo = useMemo(() => {
    const _key = key || (Math.random() * Date.now()).toString(16);
    const mouseWidthInfo = {
      down: false,
      key: _key,
      x: (innerWidth * 0.3) / 2,
      y: (innerHeight * 0.3) / 2,
      mx: 0,
      my: 0,
      width: innerWidth * 0.3,
      init() {
        const storage = key ? localStorage : sessionStorage;
        const storeName = key ? `ComponentEditor-mouseWidthInfo-${key}` : 'ComponentEditor-mouseWidthInfo';
        const cache = storage.getItem(storeName);
        if (cache) {
          return Object.assign(this, safeParse(cache, this));
        };
        return this;
      },
      update() {
        const storage = key ? localStorage : sessionStorage;
        const storeName = key ? `ComponentEditor-mouseWidthInfo-${key}` : 'ComponentEditor-mouseWidthInfo';
        storage.setItem(storeName, JSON.stringify(this))
      }
    };
    return mouseWidthInfo;
  }, [])
  const [state, setState] = useState(() => mouseInfo.init());
  const [widthState] = useState(() => {
    mouseWidthInfo.width = innerWidth * ratio;
    return mouseWidthInfo.init();
  });

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
    // 用于移动
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

    // 用于宽度变更
    if (mouseWidthInfo.down) {
      event.preventDefault();
      const { mx, width } = mouseWidthInfo;
      const { clientX } = event;
      const _x = clientX - mx;
      mouseWidthInfo.width = width + _x;
      mouseWidthInfo.mx = clientX;
      setState({ ...mouseInfo });
    };
  };
  
  const onMouseUp = (event: any) => {
    mouseInfo.down = false;
    mouseWidthInfo.down = false;
    mouseInfo.update();
    mouseWidthInfo.update();
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

  const onMouseDownWidthChange = (event: any) => {
    event.preventDefault();
    const { clientX } = event;
    mouseWidthInfo.down = true;
    mouseWidthInfo.mx = clientX;
  };

  if (!show) return null;

  return (
    <div
      className='drag-move-container'
      style={{
        width: widthState.width,
        height: innerHeight * ratio,
        top: `${y}px`,
        left: `${x}px`
      }}>
      <div className='drag-move-header-container' ref={header}>
        { !!(title) && <div className='drag-move-header-title'>{ title }</div> }
        { (!!onClose) && <img src='https://picasso-static.xiaohongshu.com/fe-platform/631afc566794af19239d3169f6d6cab45f60114e.png' onClick={onClose} /> }
      </div>
      <div className='drag-move-container-content-box' style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
        { children }
      </div>

      {/* 尺寸变更 */}
      <div className='drag-move-container-right' onMouseDown={onMouseDownWidthChange}></div>
    </div>
  );
};

export default DragMoveContainer;