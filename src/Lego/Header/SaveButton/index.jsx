import { useSignal } from 'react-use-signal';
import { toast, TypeEnum } from 'toast';
import service from '@service';

import { events } from 'events';
import { EVENTS } from 'const';
import { useEffect, useRef } from 'react';

// @ts-ignore
import { zipDSL } from 'lib';

const SaveButton = () => {
  const updater = useRef(null);
  const [state] = useSignal('app');

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

  useEffect(() => {
    events.off(EVENTS.SAVE);
    events.on(EVENTS.SAVE, onSave);
    () => {
      events.off(EVENTS.SAVE);
    }
  }, []);

  // return (
  //   <div className='header-save-button-container' onClick={onSave}>保存</div>
  // )
  return null;
};

export default SaveButton;