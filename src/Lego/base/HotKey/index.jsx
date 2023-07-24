import { useEffect } from 'react';
import { events } from 'events';
import { EVENTS } from 'const';
import { creator } from 'creator';
import { useSignal } from 'react-use-signal';

class HotKeyCore {
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

    document.addEventListener('keyup', () => {
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
      this.current = truthy;
      event.preventDefault();
    };
  };

  get current() {
    return this._current;
  };

  set current(value) {
    this._current = value;
    if (this.onUpdate) this.onUpdate(this._current);
  };
};

class HotKeys extends HotKeyCore {
  constructor(...arg) {
    super(...arg);
  };
  onUpdate = (hotKey) => {
    if (this.callback) this.callback({
      hotkeys: hotKey,
      value: hotKey.join('+')
    })
  };
};

const hotKey = new HotKeys(
  [['Meta', 's'], ['Meta', 'Backspace'], ['Meta', 'c'], ['Meta', 'v']],
  () => null
);

export const HotKey = () => {
  const [state, setState] = useSignal('app');

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

  const hotKeyCallback = async({ value }) => {
    switch(value) {
      case 'Meta+Backspace': {
        events.emit(EVENTS.DELETE_COMPONENT_INSTANCE);
        break;
      }
      case 'Meta+s': {
        events.emit(EVENTS.SAVE);
        break;
      }
      case 'Meta+c': {
        const { currentComponent } = state;
        if (currentComponent) {
          setState({ copyComponent: currentComponent })
        };
        break;
      }
      case 'Meta+v': {
        const { copyComponent } = state;
        if (copyComponent) {
          const componentInstance = buildComponentInstance(copyComponent);
          await addComponent(componentInstance);
          events.emit(EVENTS.SAVE);
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