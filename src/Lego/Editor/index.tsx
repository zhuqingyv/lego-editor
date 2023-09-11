import { useEffect, useCallback, useState } from 'react';
// @ts-ignore
import { useSignal } from 'react-use-signal';
// @ts-ignore
import { EVENTS } from 'const';
// @ts-ignore
import { events } from 'events';
// @ts-ignore
import { toast, TypeEnum } from 'toast'
import Engine from './Engine';
// @ts-ignore
import DropAble from './DropAble';
// import RectInspect from './RectInspect';
import update from './Update';
// import TimeLine from './TimeLine';
// @ts-ignore
import service from '@service';
// @ts-ignore
import { safeParse, zipDSL } from 'lib';
import DragMoveContainer from '../base/DragMoveContainer';
import './style.css';

const Editor = () => {
  const [size, setSize] = useState({ width: 375, height: 812 });
  const [state, setState] = useSignal('app');

  const onClick = (event: any) => {
    if (event.target.className === 'editor-container') {
      setState({ currentComponent: null });
    };
  };

  const findDSLInstance = ({ id, ifDelete = false }: any, callback: (param: { list: [], item: any, i: number }) => any) => {
    let result;
    const findLoop = (list: any) => {
      return list.find((item: any, i: number) => {
        const isQualId = item.id === id;
        if (isQualId) {
          result = item;
          if (ifDelete) list.splice(i, 1);
          callback({ list, item, i });
          return true;
        }
        if (item?.children?.length) {
          return findLoop(item.children);
        };
      });
    };
    findLoop(state.dsl);

    return result
  };

  const updateComponentInstance = async ({ id }: { id: string }) => {
    if (id === '#') {
      await setState({ dsl: safeParse(JSON.stringify(state.dsl), {}) });
      const { message } = await service('setPage', state);
      toast(message || '更新成功!', TypeEnum.SUCCESS);
      return;
    };

    const updater = update.find(id);
    if (updater) {
      updater(() => async () => {
        const { id, name, rnVersion, icon } = state;
        const newDsl = zipDSL(state.dsl, true);
        const { message } = await service('setPage', { id, name, dsl: newDsl, rnVersion, icon });
        toast(message || '更新成功!', TypeEnum.SUCCESS);
      });
    };
  };

  const updateComponentSchemaValue = useCallback(({ id, value }: any) => {
    if (state.status < 1) return;
    findDSLInstance({ id }, ({ item }) => {
      // @ts-ignore
      if (JSON.stringify(item.schemaValue) === JSON.stringify(value)) return;
      item.schemaValue = value;
      updateComponentInstance({ id: item.id });
    });
  }, []);

  const onDeleteComponentInstance = () => {
    if (state.status < 1) return;
    if (state.currentComponent) {
      findDSLInstance({ id: state?.currentComponent?.id, ifDelete: true }, async () => {
        await setState({ currentComponent: null, dsl: state.dsl });
        await service('setPage', state);
        toast('更新成功!', TypeEnum.SUCCESS);
      });
    }
  };

  useEffect(() => {
    events.on(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, updateComponentSchemaValue);
    events.on(EVENTS.DELETE_COMPONENT_INSTANCE, onDeleteComponentInstance);
    () => {
      events.off(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, updateComponentSchemaValue);
      events.off(EVENTS.DELETE_COMPONENT_INSTANCE, onDeleteComponentInstance);
    }
  }, []);

  return (
    <>
      <div className="editor-container" onClick={onClick}>
        <DragMoveContainer show={true} title="预览" id="preview">
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <DropAble onAddComponent={updateComponentInstance} findDSLInstance={findDSLInstance}>
              <div className='editor-preview' onClick={() => null}>
                <Engine />
              </div>
            </DropAble>
            <div className='editor-preview-size-container'>
              <span>{size.width}</span>
              ×
              <span>{size.height}</span>
            </div>
          </div>
        </DragMoveContainer>
        <div style={{ flex: 1 }}></div>
        {/* <TimeLine /> */}
        {/* <RectInspect /> */}
      </div>
    </>
  );
};

export default Editor;