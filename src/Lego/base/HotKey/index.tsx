import { useEffect } from 'react';
// @ts-ignore
import { events } from 'events';
// @ts-ignore
import { EVENTS } from 'const';
// @ts-ignore
import { creator } from 'creator';
// @ts-ignore
import { useSignal } from 'react-use-signal';
// @ts-ignore
import { toast, TypeEnum } from 'toast'
// @ts-ignore
import { zipDSL } from 'lib';
// @ts-ignore
import service from '@service';

class HotKeyCore {
  event = null;
  cacheKey = [];
  _current = null;

  constructor(hotkey = [], callback = () => null) {
    document.addEventListener('keydown', (event) => {
      const { key } = event;
      // @ts-ignore
      if (!this.cacheKey.includes(key)) {
        // @ts-ignore
        this.cacheKey.push(key);
        this.check(event);
      }
    });

    document.addEventListener('keyup', (event) => {
      const { key } = event;
      // @ts-ignore
      if (this.cacheKey.includes(key)) {
        // @ts-ignore
        this.cacheKey.splice(this.cacheKey.indexOf(key), 1);
        // @ts-ignore
        this.check();
      };
      this.cacheKey = []
    });

    // @ts-ignore
    this.hotkey = hotkey;
    // @ts-ignore
    this.callback = callback;
  };

  // @ts-ignore
  check = (event) => {
    // @ts-ignore
    const { cacheKey, hotkey } = this;
    // @ts-ignore
    const truthy = hotkey.find((hotkeyGroup) => {
      const { length } = hotkeyGroup;
      if (cacheKey.length !== length) return false;

      const hasBreak = cacheKey.find((key) => {
        if (!hotkeyGroup.includes(key)) return true;
      });

      if (hasBreak) return false;
      return true;
    });

    if (truthy) {
      this.event = event;
      this.current = truthy;
    };
  };

  get current() {
    return this._current;
  };

  set current(value) {
    this._current = value;
    // @ts-ignore
    if (this.onUpdate) this.onUpdate(this._current, this.event);
  };
};

class HotKeys extends HotKeyCore {
  constructor(...arg: any[]) {
    super(...arg);
  };
  // @ts-ignore
  onUpdate = (hotKey, event) => {
    // @ts-ignore
    if (this.callback) this.callback({
      event,
      hotkeys: hotKey,
      value: hotKey.join('+')
    });
    this.cacheKey = [];
  };
};

const hotKey = new HotKeys(
  [['Meta', 's'], ['Meta', 'Backspace'], ['Meta', 'Shift', 'c'], ['Meta', 'Shift', 'v'], ['Meta', 'g'], ['Meta', 'f'], ['Meta', 'Shift', 's']],
  () => null
);

export const HotKey = () => {
  const [state, setState] = useSignal('app');
  const [templateCreatorState] = useSignal('template-creator');

  const buildComponentInstance = (component: any) => {
    debugger;
    const componentInstance = creator.build({ name: component.name });
    const { schemaValue } = component;
    Object.assign(componentInstance, { schemaValue });
    return componentInstance;
  };

  const addComponent = (component: any) => {
    if (state.currentComponent) {
      state.currentComponent.children.push(component);
    } else {
      state.dsl.push(component);
    };
    return setState({ dsl: state.dsl });
  };

  const hotKeyCallback = async({ value, event }:any) => {
    switch(value) {
      case 'Meta+Shift+s': {
        event.preventDefault();
        const { dsl, id, name } = state;
        service('saveOnLine', {
          id,
          dsl,
          name
        });
        break;
      }
      // 删除元素
      case 'Meta+Backspace': {
        const { isDev } = state;
        if (!isDev) return toast('只有开发环境才允许「删除」元素!', TypeEnum.FAIL);
        events.emit(EVENTS.DELETE_COMPONENT_INSTANCE);
        break;
      }
      // 保存元素
      case 'Meta+s': {
        event.preventDefault();
        const { isDev, currentMaterial } = state;

        // 当开启dev，并且正在编辑某一个组件时，保存组件
        if (isDev && currentMaterial) {
          events.emit(EVENTS.SAVE_COMPONENT);
          return;
        };

        // 这里是保存页面
        toast('保存中', TypeEnum.LOADING);  
        events.emit(EVENTS.SAVE);
        break;
      }
      // 复制元素
      case 'Meta+Shift+c': {
        const { isDev, currentComponent } = state;
        if (!isDev) return toast('只有开发环境才允许「复制」元素!', TypeEnum.FAIL);
        if (currentComponent) {
          event.preventDefault();
          setState({ copyComponent: currentComponent })
        };
        break;
      }
      // 粘贴元素
      case 'Meta+Shift+v': {
        const { copyComponent, isDev } = state;
        if (!isDev) return toast('只有开发环境才允许「粘贴」元素!', TypeEnum.FAIL);
        if (copyComponent) { 
          const componentInstance = buildComponentInstance(copyComponent);
          event.preventDefault();
          await addComponent(componentInstance);
          events.emit(EVENTS.SAVE);
        };
        break;
      }
      // 打包组
      case 'Meta+g': {
        event.preventDefault();
        const { currentComponent, isDev } = state;
        if (!isDev) return toast('只有开发环境才允许「新增」模版!', TypeEnum.FAIL);
        if (currentComponent) {
          event.preventDefault();
          const { setShow } = templateCreatorState;
          const { onScreenShot } = state;
          if (onScreenShot) {
            const icon = await onScreenShot();
            const dsl = zipDSL([currentComponent], true);
            setShow({ dsl, show: true, icon });
          } else {
            const dsl = zipDSL([currentComponent], true);
            setShow({ dsl, show: true });
          };
        };
        break;
      }
      case 'Meta+f': {
        event.preventDefault();
        break;
      }
    }
  };

  useEffect(() => {
    // @ts-ignore
    hotKey.callback = hotKeyCallback
  }, [])

  return null;
};

export default hotKey;