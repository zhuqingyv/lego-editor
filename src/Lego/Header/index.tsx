// @ts-ignore
import { useSignal } from 'react-use-signal';
import { Link } from 'react-router-dom';
import Switch from "react-switch";
import QRCode  from 'qrcode.react';
// @ts-ignore
import AddComponentButton from './AddComponentButton';
// @ts-ignore
import SaveButton from './SaveButton';

import './style.css';

const Preview = () => {
  const [state] = useSignal('app');
  const { id } = state;
  return (
    <div className='header-QR-container'>
      <div className='header-QR-button-container'>
        <img className='header-QR-button' src="https://picasso-static.xiaohongshu.com/fe-platform/aa2e0ae046093ea740259c10bd4bebd6257233fc.png" />
        <div className='header-QR'>
          <QRCode value={`xhsdiscover://rn/lancer-slim/box?id=${id}`} />
        </div>
      </div>
    </div>
  )
};

const DevChangeButton = () => {
  const [isDev, setState] = useSignal('app', 'isDev');
  const onChange = (boolean: boolean) => {
    setState(boolean);
  };
  return (
    <Switch
      checked={isDev}
      onChange={onChange}
      className='header-switch-dev'
      checkedIcon={<img className='header-dev-change-checkedIcon' src="https://picasso-static.xiaohongshu.com/fe-platform/99cf37d1b42c43b2a7ca4c3574fc151e8e4a8d15.png" />}
      uncheckedIcon={<img className='header-dev-change-checkedIcon' src="https://picasso-static.xiaohongshu.com/fe-platform/99cf37d1b42c43b2a7ca4c3574fc151e8e4a8d15.png" />}
    />
  )
};

const HeaderView = () => {
  return (
    <div className='header-container'>
      <Link to='../../' relative="path" reloadDocument style={{ zIndex: 3 }}>
        <img src="https://picasso-static.xiaohongshu.com/fe-platform/a91e4d0f2e1701115bd59839b5b634cd4f3ea3cc.png" className='header-view-logo' />
      </Link>
      <Preview />
      <AddComponentButton />
      <DevChangeButton />
      <SaveButton/>
    </div>
  );
};

export default HeaderView;