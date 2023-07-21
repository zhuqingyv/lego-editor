import { useSignal } from 'react-use-signal';
import { toast } from 'react-toast';
import http from '@http';
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
    const page = zipDSL(dsl);
    
    http.fetch('setPage', { page: { id, dsl: page } })
    .then(() => {
      toast.hideAll();
      toast.success('保存成功!');
      setTimeout(() => toast.hideAll(), 1000)
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