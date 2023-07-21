import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
// @ts-ignore
import { createSignal, useSignal } from 'react-use-signal';
import { ToastContainer } from 'react-toast';
import './Views';
import './HotKey';
import HeaderView from './Header';
import Editor from './Editor/index';
import ComponentStore from './ComponentStore';
// @ts-ignore
import ComponentEditor from './ComponentEditor';
import Props from './Props';
import Tree from './Tree';
import asyncJsxBuilder from './AsyncJsxBuilder';
import AsyncCssBuilder from './AsyncCssBuilder';
// @ts-ignore
import scriptLoader from '../ScriptLoader';
// @ts-ignore
import service from '@service';
// @ts-ignore
import { safeParse } from 'lib';
import './style.css';

const loadLib = async() => {
  await scriptLoader('https://unpkg.com/react@18/umd/react.production.min.js');
  await scriptLoader('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
  await scriptLoader('https://unpkg.com/babel-standalone@6/babel.min.js');
};

const loadLibPromise = loadLib();

createSignal('app', {
  currentComponent: null,
  dsl: [],
  material: [],
  status: 0,
  isDev: true
}, 'key', false);

const Lego = () => {
  const { pageId } = useParams();
  const [state, setState] = useSignal('app');

  useEffect(() => {
    service('pageInfo', pageId).then((res: any) => {
      const page = safeParse(res, null);
      if (page) {
        const { dsl, icon, id, name, status } = page;
        setState({ dsl, icon, id, name, status: 1 });
      };
    });
    service('components').then(async(res: any) => {
      await loadLibPromise;
      debugger;
      // await asyncJsxBuilder(res);
      // const material = creator.outputList();
      // setState({ material });
    })
  }, [])

  return (
    <>
      <HeaderView />
      {
        (state.status === 1) && <div className='container'>
          <ComponentStore>
            <Tree />
          </ComponentStore>
          <Editor />
          <Props />
        </div>
      }
      <div style={{ zoom: 0.5, zIndex: 9999 }}>
        <ToastContainer position='top-left' />
      </div>
      {/* <ComponentEditor /> */}
    </>
  );
};

export default Lego;