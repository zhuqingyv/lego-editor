import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
window.React = React;
// @ts-ignore
window.Lottie = Lottie;
import { useParams } from 'react-router-dom'
// @ts-ignore
import { createSignal, useSignal } from 'react-use-signal';

import ToastContainer from './Toast';
// @ts-ignore
import { HotKey } from './base/HotKey';
import HeaderView from './Header';
import Editor from './Editor/index';
import ComponentStore from './ComponentStore';
// @ts-ignore
import { creator } from 'creator';
import componentLoader from './base/ComponentLoader';
import Props from './Props';
import Tree from './Tree';
// @ts-ignore
import scriptLoader from '../ScriptLoader';
// @ts-ignore
import service from '@service';
// @ts-ignore
import { safeParse } from 'lib';
import './style.css';

const loadLib = async() => {
  await scriptLoader('https://unpkg.com/babel-standalone@6/babel.min.js');
};

const loadLibPromise = loadLib();

const [_, setState] = createSignal('app', {
  dsl: [],
  // 当前选中的组件
  currentComponent: null,
  // 物料
  material: [],
  // 标记页面加载状态
  status: 0,
  // 后面做dev功能
  isDev: false,
  // 用于复制粘贴
  copyComponent: null
}, 'key', false);

const Lego = () => {
  const { pageId } = useParams();

  useEffect(() => {
    service('pageInfo', pageId).then((res: any) => {
      const page = safeParse(res, null);
      if (page) {
        const { dsl, icon, id, name } = page;
        setState({ dsl, icon, id, name, status: 1 });
      };
    });
    service('components').then(async(res: any[]) => {
      // @ts-ignore
      if (!window?.Babel) await loadLibPromise;
      res.forEach((component:any) => {
        creator.create(componentLoader(component));
      });
      const material = creator.outputList();
      setState({ material });
    })
  }, [])

  return (
    <>
      <HeaderView />
      {
        <div className='container'>
          <ComponentStore>
            <Tree />
          </ComponentStore>
          <Editor />
          <Props />
        </div>
      }
      <HotKey />
      <ToastContainer />
      {/* <ComponentEditor /> */}
    </>
  );
};

export default Lego;