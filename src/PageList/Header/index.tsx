// @ts-ignore
import { useSignal } from 'react-use-signal';
// @ts-ignore
import service from '@service';

import './style.css';

const Button = ({ type, text, onClick }:any) => {
  const style = () => {
    switch(type) {
      case'danger': {
        return {
          backgroundColor: '#d0021b',
          color: 'white'
        }
      }
      default: {
        return {
          backgroundColor: '#4a90e2',
          color: 'white'
        }
      }
    }
  };
  return (
    <div className='header-button-container' onClick={onClick} style={style()}>{ text }</div>
  )
};

const HeaderView = () => {
  const [_, setState] = useSignal('pageList');
  const onAddPage = () => {
    service('createPage').then((res: any) => {
      setState(res);
    })
  };


  return (
    <div className='header-container'>
      <img src="https://picasso-static.xiaohongshu.com/fe-platform/a91e4d0f2e1701115bd59839b5b634cd4f3ea3cc.png" className='header-view-logo' />
      <Button text="新增页面" onClick={onAddPage} />
    </div>
  )
};

export default HeaderView;