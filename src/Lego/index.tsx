import { useEffect } from 'react';
import './InjectModel';
import { useParams } from 'react-router-dom'
// @ts-ignore
import { useSignal } from 'react-use-signal';

import ToastContainer from './Toast';

import { HotKey } from './base/HotKey';
import HeaderView from './Header';
import Editor from './Editor/index';
import ComponentStore from './ComponentStore';
import Props from './Props';
import Tree from './Tree';
import ComponentEditor from './ComponentEditor';
import TemplateCreator from './TemplateCreator';
// @ts-ignore
import service from '@service';
import './api';

import './style.css';

service('userInfo');

const Lego = () => {
  const [api] = useSignal('app', 'api');
  const { pageId } = useParams();

  useEffect(() => {
    const { components, pageInfo, allTemplate } = api;
    // 获取组件
    components();
     // 获取页面信息
    allTemplate();
    // 获取所有模版
    pageInfo(pageId);
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
      <div id='screenShot-container'></div>
    </>
  );
};

export default Lego;
