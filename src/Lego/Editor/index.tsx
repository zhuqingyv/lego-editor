import { useEffect, useCallback } from 'react';
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
import RectInspect from './RectInspect';
import TimeLine from './TimeLine';
// @ts-ignore
import service from '@service';
import './style.css';

const Editor = () => {
  const [state, setState] = useSignal('app');

  const onClick = () => {
    setState({ currentComponent: null });
  };

  const findDSLInstance = ({ id, ifDelete = false }: any) => {
    let result;
    const findLoop = (list: any) => {
      return list.find((item: any, i: number) => {
        const isQualId = item.id === id;
  
        if (isQualId) {
          result = item;
          if (ifDelete) list.splice(i, 1);
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

  const updateComponentSchemaValue = useCallback(({ id, value }: any) => {
    if (state.status < 1) return;
    const dslInstance = findDSLInstance({ id });
    if (dslInstance) {
      // @ts-ignore
      if (JSON.stringify(dslInstance.schemaValue) === JSON.stringify(value)) return;
      // @ts-ignore
      dslInstance.schemaValue = value;
      setState({ dsl: state.dsl })
        .then(() => {
          toast('更新成功!', TypeEnum.SUCCESS);
          service('setPage', state);
        })
    };
  }, []);

  const onDeleteComponentInstance = () => {
    if (state.status < 1) return;
    if (state.currentComponent) {
      findDSLInstance({ id: state?.currentComponent?.id, ifDelete: true });
      setState({ currentComponent: null, dsl: state.dsl });
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
      <DropAble>
        <div className="editor-container" onClick={onClick}>
          <div className='editor-preview'>
            <Engine />
          </div>
          <div style={{ flex: 1 }}></div>
          {/* <TimeLine /> */}
          <RectInspect />
        </div>
      </DropAble>
    </>
  );
};

export default Editor;