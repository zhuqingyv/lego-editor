import { useEffect, useCallback } from 'react';
import { useSignal } from 'react-use-signal';
import { EVENTS } from 'const';
import { events } from 'events';
import { toast } from 'react-toast'
import Engine from './Engine';
import DropAble from './DropAble';
import './style.css';

const Editor = () => {
  const [state, setState] = useSignal('app');
  const { dsl } = state;

  const findDSLInstance = ({ id, ifDelete = false }) => {
    let result;
    const findLoop = (list) => {
      return list.find((item, i) => {
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
    findLoop(dsl);
  
    return result
  };

  const updateComponentSchemaValue = useCallback(({ id, value }) => {
    const dslInstance = findDSLInstance({ id });
    if (dslInstance) {
      dslInstance.schemaValue = value;
      setState({ ...state })
        .then(() => {
          toast.hideAll();
          toast.success('更新成功!');
        })
    };
  }, []);

  const onDeleteComponentInstance = () => {
    if (state.currentComponent) {
      findDSLInstance({ id: state?.currentComponent?.id, ifDelete: true });
      events.emit(EVENTS.CHECK_COMPONENT, null);
      setState({ currentComponent: null });
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
    <DropAble>
      <div className="editor-container">
        <div className='editor-preview'>
          <Engine dsl={dsl} />
        </div>
      </div>
    </DropAble>
  )
};

export default Editor;