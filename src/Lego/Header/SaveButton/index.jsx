import { useSignal } from 'react-use-signal';
import { toast, TypeEnum } from 'toast';
import { useParams } from 'react-router-dom'
import service from '@service';

import { events } from 'events';
import { EVENTS } from 'const';
import { useEffect, useRef } from 'react';

// @ts-ignore
import { zipDSL } from 'lib';

const SaveButton = () => {
  const updater = useRef(null);
  const [state, setState] = useSignal('app');
  const { pageId } = useParams();

  const onSave = () => {
    const newDsl = zipDSL(state.dsl, true);
    const { id, name, rnVersion, icon, status } = state;

    if (status < 1) return;

    if (updater.current) return;

    updater.current = setTimeout(() => {
      service('setPage', { id, name, dsl: newDsl, rnVersion, icon })
        .then(({ message } = {}) => {
          toast(message || '保存成功!', TypeEnum.SUCCESS);
        })
        .finally(() => {
          updater.current = null;
        })
    }, 1000);
  };

  const onSaveComponent = () => { 
    const { currentMaterial, api } = state;

    const { name, jsxCode, cssCode, schemaCode } = currentMaterial;
    const changeList = [
      {
        type: 'jsx',
        codeValue: jsxCode
      },
      {
        type: 'css',
        codeValue: cssCode
      },
      {
        type: 'schema',
        codeValue: schemaCode
      }
    ];

    toast('正在保存代码!', TypeEnum.LOADING);
    service('setComponent', { name, value: changeList })
      .finally(async() => {
        toast('正在更新组件!', TypeEnum.LOADING);
        // 保存组件信息
        await api.components();

        toast('正在视图!', TypeEnum.LOADING);
        // 重新渲染数据
        await api.pageInfo(pageId);
        toast('更新成功!', TypeEnum.SUCCESS);
      })
  };

  useEffect(() => {
    events.off(EVENTS.SAVE);
    events.on(EVENTS.SAVE, onSave);

    events.off(EVENTS.SAVE_COMPONENT);
    events.on(EVENTS.SAVE_COMPONENT, onSaveComponent);
    () => {
      events.off(EVENTS.SAVE);
      events.off(EVENTS.SAVE_COMPONENT);
    }
  }, []);
  return null;
};

export default SaveButton;