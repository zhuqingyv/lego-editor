// @ts-nocheck
import { useRef } from 'react';
import './style.css';
import { useSignal } from 'react-use-signal';
import { events } from 'events';
import { EVENTS } from 'const';

const NameChange = () => {
  const [name, setName] = useSignal('app', 'name');
  const timer: any = useRef(null);

  const onChange = async({ target }: any) => {
    const { innerText:value } = target;
    await setName(value);

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async() => {
      events.emit(EVENTS.SAVE);
    }, 1000);
  };

  return (
    <div className='name-change-container'>
      <div className='name-change-input' contentEditable onBlur={onChange} key="name-change-input">{ name }</div>
      <img className='name-change-icon' src="https://picasso-static.xiaohongshu.com/fe-platform/e132cf4b8648a796c8a65bd82355ae69d99e5dbd.png" />
    </div>
  )
};

export default NameChange;