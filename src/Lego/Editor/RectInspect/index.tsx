import { memo, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
// import GIF from 'gif.js';
// import html2canvas from 'html2canvas';
// @ts-ignore
import { useSignal } from 'react-use-signal';
// @ts-ignore
import { toast, TypeEnum } from 'toast'
// import gifWorkerString from './gif.worker';
import './style.css';
import './html2canvas.js';
import html2canvas from 'html2canvas';

const asyncLoop = async (callback: any, count: number, delay: number, notFirst?: any) => {
  const promise = new Promise((resolve: any) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });

  if (!notFirst) {
    if (count) {
      callback();
      return new Promise(async (resolve) => {
        await asyncLoop(callback, count - 1, delay, resolve);
      });
    }
  } else {
    await promise.then(async () => {
      if (count) {
        callback();
        return await asyncLoop(callback, count - 1, delay, notFirst);
      } else {
        notFirst();
      }
    })
  };
};

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
  const element = document.querySelector('body');
  if (element) {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  };

  return { width: 0, height: 0 };
};

const drawRectangle = (params: { x: number, y: number, width: number, height: number, canvas: HTMLCanvasElement, borderColor: string, borderWidth: number, backgroundColor: string }) => {
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
  const isActive = useRef(true);

  useEffect(() => {
    const rectRegister = (item: { id: string }, element: any) => {
      const { id } = item;

      rect.register(id, element);
      if (element) {
        element.onmousedown = (event: any) => {
          event.stopPropagation();
          setState({ currentComponent: item });
        };
      };
    };
    if (!state.rectRegister) setState({ rectRegister });
  }, []);

  const onUpdate = () => {
    const { currentComponent } = state;
    const canvas = document.querySelector('.rect-inspect-canvas') as HTMLCanvasElement;
    if (canvas) {
      if (currentComponent) {
        const { id } = currentComponent;
        const element = rect.getRect(id);
        if (element) {
          const { x, y, width, height } = element.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          const ratio = 0.7;
          // drawRectangle({
          //   x: x * ratio - canvasRect.x / ratio,
          //   y: y * ratio - canvasRect.y / ratio,
          //   width: width * ratio,
          //   height: height * ratio,
          //   borderWidth: 0.5,
          //   borderColor: 'rgba(0,100,255,1)',
          //   backgroundColor: 'rgba(0,100,255,0.2)',
          //   canvas
          // });
          drawRectangle({
            x: x * ratio - canvasRect.x,
            y: y * ratio - canvasRect.y,
            width: width * ratio,
            height: height * ratio,
            borderWidth: 0.5,
            borderColor: 'rgba(0,100,255,0.8)',
            backgroundColor: 'rgba(0,100,255,0.1)',
            canvas
          })
        };
      } else {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      }
    };

    if (isActive.current) requestAnimationFrame(onUpdate);
  };

  const onScreenShot = async () => {
    const id = state?.currentComponent?.id;
    if (!id) return Promise.reject('currentComponent is undefined!');
    const element = rect.getRect(id);
    if (!element) return Promise.reject(`element is undefined by ${id}!`);
    toast('开始截取模版视图', TypeEnum.LOADING);
    const base64String = await htmlToImage.toPng(element);
    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor: null
    });
    toast('开始合并模版视图', TypeEnum.LOADING);

    return await new Promise((resolve) => {
      const container = document.createElement('div');
      const img = document.createElement('img');

      container.style.width = `${canvas.width}px`;
      container.style.height = `${canvas.height}px`;
      container.style.zIndex = '-1';

      img.style.width = canvas.style.width = container.style.width;
      img.style.height = canvas.style.height = container.style.height;

      container.style.position = img.style.position = canvas.style.position = 'absolute';
      img.style.top = canvas.style.top = '0px';
      img.style.top = canvas.style.top = '0px';

      container.appendChild(canvas);
      container.appendChild(img);

      const box = document.querySelector('#screenShot-container') || document.body;

      img.onload = async() => {
        toast('重新生成截图', TypeEnum.LOADING);
        box.appendChild(container);
        const base64Result = await htmlToImage.toPng(container);
        box.removeChild(container);
        resolve(base64Result);
        toast('截图成功', TypeEnum.SUCCESS);
      };

      img.src = base64String;
      img.crossOrigin
    });

  };

  useEffect(() => {
    onUpdate();
    setState({ onScreenShot });
    return () => {
      isActive.current = false;
    }
  }, []);

  const { width, height } = getStyle();

  return (
    <canvas className='rect-inspect-canvas' ref={canvasRef} width={width} height={height} />
  )
};

export default memo(RectInspect);