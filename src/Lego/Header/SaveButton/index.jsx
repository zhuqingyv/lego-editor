import { useSignal } from 'react-use-signal';
import { toast, TypeEnum } from 'toast';
import service from '@service';

import { events } from 'events';
import { EVENTS } from 'const';
import { useEffect } from 'react';

const zipDSL = (dsl = []) => {
  return dsl.reduce((pre, cur) => {
    const { children = [], name, id, schemaValue } = cur;
    const zip = {
      name,
      id,
      children: children?.length ? zipDSL(children) : [],
      schemaValue
    };
    pre.push(zip);
    return pre;
  }, []);
};

const SaveButton = () => {
  const [state] = useSignal('app');
  const { id, dsl } = state;

  const onSave = () => {
    const newDsl = zipDSL(state.dsl);
    const { id, name, rnVersion, icon, status } = state;

    if (status < 1) return;
    service('setPage', { id, name, dsl: newDsl, rnVersion, icon })
    .then(() => {
      toast('保存成功!', TypeEnum.SUCCESS);
    })
  };

  useEffect(() => {
    events.off(EVENTS.SAVE, onSave);
    events.on(EVENTS.SAVE, onSave);
    () => events.off(EVENTS.SAVE, onSave);
  }, [dsl, id]);

  return (
    <div className='header-save-button-container' onClick={onSave}>保存</div>
  )
};

export default SaveButton;