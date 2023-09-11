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
  const [_] = useSignal('pageList');
  const onAddPage = async() => {
    await service('createPage');
    window.location.reload();
  };


  return (
    <div className='header-container'>
      <img style={{ objectFit: 'contain' }} src="https://picasso-static.xiaohongshu.com/fe-platform/290df008fbd751248c04662111efa2de508c4bd4.png" className='header-view-logo' />
      <Button text="新增页面" onClick={onAddPage} />
    </div>
  )
};

export default HeaderView;