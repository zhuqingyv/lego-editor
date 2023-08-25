import { memo, useState } from 'react';
import {
  compressToBase64,
} from 'lz-string';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import copy from 'copy-to-clipboard';
import { Link } from 'react-router-dom';
import Switch from "react-switch";
import QRCodeView from 'qrcode.react';
import { toast, TypeEnum } from 'toast'
// @ts-ignore
// import AddComponentButton from './AddComponentButton';
// @ts-ignore
import SaveButton from './SaveButton';
import NameChange from './NameChange';
// @ts-ignore
import { zipDSL } from 'lib';

import './style.css';

const zipNoId = (dsl: any = []) => {
  return dsl.map((item: any) => {
    const { n, s, c } = item;
    const _c = zipNoId(c);
    return {
      n,
      s,
      c: _c?.length ? _c : undefined
    }
  })
};

// const zipNoObject = (dsl: any = []) => {
//   return dsl.reduce((pre, cur) => {
//     const { n, s, c } = cur;
//     const item = [n, s];
//     if (c?.length) item.push(zipNoObject(c));
//     pre.push(item);
//     return pre;
//   }, []);
// };

const Preview = memo(() => {
  const [show, setShow] = useState(true);
  const [id] = useSignal('app', 'id');
  const [dsl] = useSignal('app', 'dsl');
  const newZipNameDsl = zipDSL(dsl, true);
  const newZipNameIdDsl = zipNoId(newZipNameDsl);

  const baseRouter = 'xhsdiscover://rn/lancer-slim/lego';

  const stringZipId = compressToBase64(JSON.stringify({ id, dsl: newZipNameIdDsl }));

  const valueDSL = `${baseRouter}?id=${id}&dsl=${stringZipId}`;
  const value = valueDSL.length >= 2900 ? `${baseRouter}?id=${id}` : valueDSL;

  const onCopyLink = () => {
    if (copy(valueDSL)) {
      toast('复制链接成功', TypeEnum.SUCCESS);
    } else {
      toast('复制链接失败', TypeEnum.FAIL);
    };
  };

  if (!show) return null;

  return (
    <div className='header-QR-container'>
      <div className='header-QR-button-container'>
        <img onClick={onCopyLink} className='header-QR-button' src="https://picasso-static.xiaohongshu.com/fe-platform/aa2e0ae046093ea740259c10bd4bebd6257233fc.png" />
        <div className='header-QR'>
          <QRCodeView
            value={value}
            renderAs='canvas'
            size={200}
          />
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
      <NameChange />
      <Preview />
      {/* <AddComponentButton /> */}
      <DevChangeButton />
      <SaveButton />
    </div>
  );
});

export default HeaderView;