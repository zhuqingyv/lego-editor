// @ts-ignore
import { createSignal } from 'react-use-signal';
// @ts-ignore
import service from '@service';
import { toast, TypeEnum } from './Toast';
// @ts-ignore
import { creator } from 'creator';
import componentLoader from './base/ComponentLoader';
// @ts-ignore
import scriptLoader from '../ScriptLoader';
// @ts-ignore
import { safeParse } from 'lib';

const loadLib = async() => {
  return await Promise.all([
    scriptLoader('https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js'),
    scriptLoader('https://cdn.bootcdn.net/ajax/libs/babel-standalone/7.21.4/babel.min.js'),
  ]);
};

const transform = (array:any[] = []): any[] => {
  if (!array?.length) return [];

  return array.map((item) => {
    const { n, i, c, s, name, id, children = [], schemaValue } = item;
    return {
      name: n || name,
      id: i || id,
      children: transform(c || children),
      schemaValue: s || schemaValue,
    }
  });
}

const loadLibPromise = loadLib();

export const [state, setState] = createSignal('app', {
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
  currentMaterial: null,
  // 元素截图
  onScreenShot: null,

  api: {
    // 获取组件
    'components': async() => {
      // 数据处理
      const setData = (res: any) => {
        res.reverse().forEach((component: any) => {
          creator.create(componentLoader(component));
        });
        const material = creator.outputList();
        setState({ material });
      };

       // @ts-ignore
      if (!window?.Babel) await loadLibPromise;
      // 本地缓存
      const cache = localStorage.getItem('lego-components-cache');
      if (cache) setData(safeParse(cache, []));

      if (!cache) toast('开始加载组件库!', TypeEnum.LOADING);
      return service('components', ({ type, progress, all }: any) => {
        if (!cache) toast(`${type}: ${((progress / all) * 100).toFixed(1)}%`, TypeEnum.LOADING)
      }).then(async (res: any[]) => {
        const stringify = JSON.stringify(res);
        if (cache) {
          if (stringify !== cache) {
            setData(res);
            localStorage.setItem('lego-components-cache', stringify);
            toast('组件 更新成功!', TypeEnum.SUCCESS);
          } else {
            toast('组件未变更!', TypeEnum.SUCCESS);
          };
        } else {
          // 第一次加载组件
          localStorage.setItem('lego-components-cache', stringify);
          setData(res);
          toast('组件 加载成功!', TypeEnum.SUCCESS);
        };
      });
    },
    // 获取页面信息
    'pageInfo': async(pageId: string) => {
      return service('pageInfo', pageId).then((res: any) => {
        const page = safeParse(res, null);
        if (page) {
          const { dsl, icon, id, name } = page;
          const newDsl =  transform(dsl);

          setState({ dsl: newDsl, icon, id, name, status: 1 });
          toast('DSL 加载成功!', TypeEnum.SUCCESS);
        };
      });
    },
    // 获取所有模版
    'allTemplate': async() => {
      return service('allTemplate')
        .then((templateList = []) => {
          const allTemplate = templateList.map(({ path, contentValue }) => {
            const value = JSON.parse(contentValue);
            const { dsl = '[]', id, name, icon } = value;
            return { id, name, path, dsl: transform(JSON.parse(dsl)), icon, type: 'template' };
          });

          return setState({ allTemplate });
        });
    }
  }
}, 'key', false);