import { memo, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import GIF from 'gif.js';
// import html2canvas from 'html2canvas';
// @ts-ignore
import { useSignal } from 'react-use-signal';
// @ts-ignore
import { toast, TypeEnum } from 'toast'
import gifWorkerString from './gif.worker';
import './style.css';
import './html2canvas.js';
import html2canvas from 'html2canvas';

function htmlToBase64(htmlElement: HTMLElement): string {
  // 创建一个空的SVG元素
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  // 设置SVG元素的宽度和高度
  svgElement.setAttribute('width', htmlElement.offsetWidth.toString());
  svgElement.setAttribute('height', htmlElement.offsetHeight.toString());

  // 将HTML视图的内容转换为SVG元素
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(htmlElement);
  svgElement.innerHTML = svgString;

  // 将SVG元素转换为Base64编码
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const encoder = new TextEncoder();
  const svgDataArray = encoder.encode(svgData);
  const base64Data = base64ArrayBuffer(svgDataArray);

  return base64Data;
}

function base64ArrayBuffer(arrayBuffer: Uint8Array): string {
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function convertToBase64(svgString: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(svgString);
  const charArray = Array.from(data).map(byte => String.fromCharCode(byte));
  const base64String = btoa(charArray.join(''));
  return `data:image/svg+xml;base64,${base64String}`;
}

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
  const element = document.querySelector('.editor-container');
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
    const rectRegister = (item: { id: string }, element: any, updater) => {
      const { id } = item;
      rect.register(id, element);
      if (element) {
        element.onclick = (event: any) => {
          event.stopPropagation();
          setState({ currentComponent: item });
        }
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
          drawRectangle({
            x: x * ratio - canvasRect.x,
            y: y * ratio - canvasRect.y,
            width: width * ratio,
            height: height * ratio,
            borderWidth: 0.5,
            borderColor: 'rgba(0,100,255,1)',
            backgroundColor: 'rgba(0,100,255,0.2)',
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