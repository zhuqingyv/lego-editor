import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
window.React = React;
// @ts-ignore
window.Lottie = Lottie;
import { useParams } from 'react-router-dom'
// @ts-ignore
import { createSignal } from 'react-use-signal';

import ToastContainer, { toast, TypeEnum } from './Toast';
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
  await Promise.all([scriptLoader('https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js'), scriptLoader('https://unpkg.com/babel-standalone@6/babel.min.js')]);
  'https://fe-video-qc.xhscdn.com/fe-platform/eb9bf60aa58eefb395eadef40f3a66520f57080e.zip?attname=你大爷的.zip'
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
    service('components', ({ type, progress, all }: any) => {
      toast(`${type}: ${((progress / all) * 100).toFixed(1)}%`, TypeEnum.LOADING)
    }).then(async(res: any[]) => {
      toast('开始加载基础库!', TypeEnum.LOADING);
      // @ts-ignore
      if (!window?.Babel) await loadLibPromise;
      res.reverse().forEach((component:any) => {
        creator.create(componentLoader(component));
      });
      const material = creator.outputList();
      setState({ material });
      toast('组件 加载成功!', TypeEnum.SUCCESS);
    });
    service('pageInfo', pageId).then((res: any) => {
      const page = safeParse(res, null);
      if (page) {
        const { dsl, icon, id, name } = page;
        setState({ dsl, icon, id, name, status: 1 });
        toast('DSL 加载成功!', TypeEnum.SUCCESS);
      };
    });
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
