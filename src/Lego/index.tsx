import { useEffect } from 'react';
import './InjectModel';
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
import ComponentEditor from './ComponentEditor';
import TemplateCreator from './TemplateCreator';
// @ts-ignore
import scriptLoader from '../ScriptLoader';
// @ts-ignore
import service from '@service';
// @ts-ignore
import { safeParse } from 'lib';

import './style.css';

const loadLib = async() => {
  return await Promise.all([
    scriptLoader('https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js'),
    scriptLoader('https://unpkg.com/babel-standalone@6/babel.min.js')
  ]);
};

const loadLibPromise = loadLib();

service('userInfo');

const [_, setState] = createSignal('app', {
  dsl: [],
  // 物料
  material: [],
  // 模版
  allTemplate: [],
  // 标记页面加载状态
  status: 0,
  // 后面做dev功能
  isDev: true,
  // 当前选中的组件
  currentComponent: null,
  // 用于复制粘贴
  copyComponent: null,
  // 当前选中的物料
  currentMaterial: null
}, 'key', false);

const Lego = () => {
  const { pageId } = useParams();

  useEffect(() => {
    // 获取组件
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

    // 获取页面信息
    service('pageInfo', pageId).then((res: any) => {
      const page = safeParse(res, null);
      if (page) {
        const { dsl, icon, id, name } = page;
        setState({ dsl, icon, id, name, status: 1 });
        toast('DSL 加载成功!', TypeEnum.SUCCESS);
      };
    });

    // 获取所有模版
    service('allTemplate')
      .then(async(templateList = []) => {
        const allTemplate = templateList.map(({ path, type, contentValue }) => {
          const value = JSON.parse(contentValue);
          const { dsl = '{}', id, name, icon } = value;
          return { id, name, path, dsl: JSON.parse(dsl), icon, type: 'template' };
        });

        setState({ allTemplate });
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
      <ComponentEditor />
      <TemplateCreator />
    </>
  );
};

export default Lego;
