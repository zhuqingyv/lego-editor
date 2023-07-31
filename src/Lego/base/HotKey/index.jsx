import { useEffect } from 'react';
import { events } from 'events';
import { EVENTS } from 'const';
import { creator } from 'creator';
import { useSignal } from 'react-use-signal';
import { toast, TypeEnum } from 'toast'
import { zipDSL } from 'lib';

class HotKeyCore {
  event = null;
  cacheKey = [];
  _current = null;

  constructor(hotkey = [], callback) {
    document.addEventListener('keydown', (event) => {
      const { key } = event;
      if (!this.cacheKey.includes(key)) {
        this.cacheKey.push(key);
        this.check(event);
      }
    });

    document.addEventListener('keyup', (event) => {
      const { key } = event;
      if (this.cacheKey.includes(key)) {
        this.cacheKey.splice(this.cacheKey.indexOf(key), 1);
        this.check();
      }
      this.cacheKey = [];
    });

    this.hotkey = hotkey;
    this.callback = callback;
  };

  check = (event) => {
    const { cacheKey, hotkey } = this;
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
    if (this.onUpdate) this.onUpdate(this._current, this.event);
  };
};

class HotKeys extends HotKeyCore {
  constructor(...arg) {
    super(...arg);
  };
  onUpdate = (hotKey, event) => {
    if (this.callback) this.callback({
      event,
      hotkeys: hotKey,
      value: hotKey.join('+')
    })
  };
};

const hotKey = new HotKeys(
  [['Meta', 's'], ['Meta', 'Backspace'], ['Meta', 'c'], ['Meta', 'v'], ['Meta', 'g']],
  () => null
);

export const HotKey = () => {
  const [state, setState] = useSignal('app');
  const [templateCreatorState] = useSignal('template-creator');

  const buildComponentInstance = (component) => {
    const componentInstance = creator.build({ name: component.name });
    const { schemaValue } = component;
    Object.assign(componentInstance, { schemaValue });
    return componentInstance;
  };

  const addComponent = (component) => {
    if (state.currentComponent) {
      state.currentComponent.children.push(component);
    } else {
      state.dsl.push(component);
    };
    return setState({ dsl: state.dsl });
  };

  const hotKeyCallback = async({ value, event }) => {
    switch(value) {
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

        // 当开启dev，并且正在编辑某一个组件时
        if (isDev && currentMaterial) {
          alert('编辑组件!');
          return;
        };

        events.emit(EVENTS.SAVE);
        break;
      }
      // 复制元素
      case 'Meta+c': {
        const { isDev, currentComponent } = state;
        if (!isDev) return toast('只有开发环境才允许「复制」元素!', TypeEnum.FAIL);
        if (currentComponent) {
          event.preventDefault();
          setState({ copyComponent: currentComponent })
        };
        break;
      }
      // 粘贴元素
      case 'Meta+v': {
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
          const dsl = zipDSL([currentComponent]);
          setShow({ dsl, show: true });
        };
        break;
      }
    }
  };

  useEffect(() => {
    hotKey.callback = hotKeyCallback
  }, [])

  return null;
};

export default hotKey;