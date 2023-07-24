import { useState } from 'react';
import './style.css';

export enum TypeEnum {
  SUCCESS = 'success',
  LOADING = 'loading',
  FAIL = 'fail'
};

let timer:any = null;
let toastInstance: null | ((p: any) => any) = null;

const getIcon = (type: TypeEnum) => {
  switch(type) {
    case TypeEnum.FAIL: {
      return 'https://picasso-static.xiaohongshu.com/fe-platform/4d6ee5a0a7fbb4d4a27be50197c54d469552fe34.png';
    }
    case TypeEnum.LOADING: {
      return 'https://picasso-static.xiaohongshu.com/fe-platform/e29057c0d4da0d55a9d51f5efb84c028d8ab88e6.png';
    }
    case TypeEnum.SUCCESS:
    default: {
      return 'https://picasso-static.xiaohongshu.com/fe-platform/9877fc62c8c401e89307d09f93210932ca06b488.png'
    }
  };
};

const ToastContainer = () => {
  const [state, setState] = useState({
    visible: false,
    content: '',
    type: TypeEnum.SUCCESS
  });

  toastInstance = setState;

  const { type, visible, content } = state;

  if (!visible) return null;

  const icon = getIcon(type);

  return (
    <div className="toast-container">
      <div className='toast-content'>
        <img src={icon} className={type === TypeEnum.LOADING ? 'toast-content-loading-icon': ''} />
        { content }
      </div>
    </div>
  )
};

export default ToastContainer;

export const toast = (content: string = '', type: TypeEnum = TypeEnum.LOADING) => {
  if (toastInstance) {
    if (timer) clearTimeout(timer);

    toastInstance({
      visible: true,
      content,
      type
    });

    timer = setTimeout(() => {
      if (toastInstance) {
        toastInstance({
          visible: false,
          content: '',
          type: TypeEnum.SUCCESS
        });
      };
    }, 1000);
  };
}