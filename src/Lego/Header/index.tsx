import { memo, useState } from 'react';
import {
  compressToBase64,
} from 'lz-string';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import { Link } from 'react-router-dom';
import Switch from "react-switch";
import QRCodeView from 'qrcode.react';
// @ts-ignore
import AddComponentButton from './AddComponentButton';
// @ts-ignore
import SaveButton from './SaveButton';
import QRCode from 'qrcode-generator';

import './style.css';

const Preview = memo(() => {
  const [show, setShow] = useState(true);
  const [id] = useSignal('app', 'id');
  const [dsl] = useSignal('app', 'dsl');

  // 压缩
  const stringZip = compressToBase64(JSON.stringify({ id, dsl }));

  if (!show) return null;

  return (
    <div className='header-QR-container'>
      <div className='header-QR-button-container'>
        <img className='header-QR-button' src="https://picasso-static.xiaohongshu.com/fe-platform/aa2e0ae046093ea740259c10bd4bebd6257233fc.png" />
        <div className='header-QR'>
          {/* <QRCodeView
            value={`xhsdiscover://rn/lancer-slim/box?id=${id}&dsl=${stringZip}`}
            renderAs='svg'
            size={200}
            onError={onError}
            max={100}
          /> */}
        </div>
      </div>
    </div>
  )
});

const DevChangeButton = memo(() => {
  const [isDev, setState] = useSignal('app', 'isDev');
  const onChange = async(boolean: boolean) => {
    await setState(boolean);
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
});

const HeaderView = memo(() => {
  return (
    <div className='header-container'>
      <Link to='../../' relative="path" reloadDocument style={{ zIndex: 3 }}>
        <img src="https://picasso-static.xiaohongshu.com/fe-platform/a91e4d0f2e1701115bd59839b5b634cd4f3ea3cc.png" className='header-view-logo' />
      </Link>
      <Preview />
      {/* <AddComponentButton /> */}
      <DevChangeButton />
      <SaveButton />
    </div>
  );
});

export default HeaderView;