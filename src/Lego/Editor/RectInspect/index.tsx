import { memo, useEffect, useRef, useState } from 'react';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import './style.css';

type Rect = {
  _rect: {
    [key: string]: any
  };
  register: (id: string, ref: any) => void;
  remove: (id: string, ref: any) => void;
  getRect: (id: string) => any;
}

const rect: Rect = {
  _rect: {},
  register(id: string, ref: any) {
    this._rect[id] = ref;
  },
  remove(id: string) {
    delete this._rect[id];
  },
  getRect(id) {
    return this._rect[id];
  }
};

const getStyle = () => {
  const element = document.querySelector('.editor-container');
  if (element) {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  };

  return { width: 0, height: 0 };
};

const drawRectangle = (params: {x: number, y: number, width: number, height: number, canvas: HTMLCanvasElement, borderColor: string, borderWidth: number, backgroundColor: string}) => {
  const { x, y, width, height, canvas, borderColor, backgroundColor, borderWidth } = params;
  // 获取 canvas 的上下文对象
  var ctx = canvas.getContext('2d');

  if (ctx) {
    ctx?.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // 设置边框颜色
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;

    // 绘制矩形的边框
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();

    // 设置矩形的背景色
    ctx.fillStyle = backgroundColor;

    // 填充矩形的内部区域
    ctx.fillRect(x, y, width, height);
  };
}

// editor-container
const RectInspect = () => {
  const [state, setState] = useSignal('app');
  const canvasRef = useRef(null);

  useEffect(() => {
    const rectRegister = (item: { id: string }, element: any) => {
      const { id } = item;
      rect.register(id, element);
      if (element) {
        element.onclick = (event: any) => {
          event.stopPropagation();
          setState({ currentComponent: item });
        };
      };
    };
    if (!state.rectRegister) setState({ rectRegister });
  }, []);

  const onUpdate = () => {
    const { currentComponent } = state;
    if (currentComponent) {
      const canvas = document.querySelector('.rect-inspect-canvas') as HTMLCanvasElement;
      if (canvas) {
        const { id } = currentComponent;
        const element = rect.getRect(id);
        if (element) {
          const { x, y, width, height } = element.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          drawRectangle({
            x: x - canvasRect.x,
            y: y - canvasRect.y,
            width,
            height,
            borderWidth: 0.5,
            borderColor: 'rgba(0,100,255,1)',
            backgroundColor: 'rgba(0,100,255,0.2)',
            canvas
          })
        };
      };
    };

    requestAnimationFrame(onUpdate);
  };

  useEffect(() => {
    onUpdate();
  }, []);

  const { width, height } = getStyle();

  return (
    <canvas className='rect-inspect-canvas' ref={canvasRef} width={width} height={height} />
  )
};

export default memo(RectInspect);