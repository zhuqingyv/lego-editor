import { useState } from 'react';
import './style.css';

let timer:any = null;
let toastInstance: null | ((p: any) => any) = null;

const ToastContainer = () => {
  const [state, setState] = useState({
    visible: false,
    content: ''
  });

  toastInstance = setState;

  const { visible, content } = state;

  if (!visible) return null;

  return (
    <div className="toast-container">
      <div className='toast-content'>
        <img src="https://picasso-static.xiaohongshu.com/fe-platform/9877fc62c8c401e89307d09f93210932ca06b488.png" />
        { content }
      </div>
    </div>
  )
};

export default ToastContainer;

export const toast = (content: string = '') => {
  if (toastInstance) {
    if (timer) clearTimeout(timer);

    toastInstance({
      visible: true,
      content
    });

    timer = setTimeout(() => {
      if (toastInstance) {
        toastInstance({
          visible: false,
          content: ''
        });
      };
    }, 1500);
  };
}