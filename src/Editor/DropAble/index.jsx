import { cloneElement } from 'react';
import { creator } from 'creator';
import { useSignal } from 'react-use-signal';
import { events } from 'events';
import { EVENTS } from 'const';
import './style.css';

const DropAble = ({ children, target, onDrop }) => {
  const [state, setState] = useSignal('app');
  const { dsl, currentComponent: current } = state;
  const currentComponent = target || current;

  const buildComponentInstance = (component) => {
    return creator.build({ name: component.name });
  };

  const addComponent = (component) => {
    if (currentComponent) {
      currentComponent.children.push(component);
    } else {
      dsl.push(component);
    };
    setState({ dsl });
    return component;
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const _onDrop = (event) => {
    event.preventDefault();
    const componentString = event.dataTransfer.getData('text/plain');
    if (componentString) {
      const component = JSON.parse(componentString);
      // 创建Instance
      const componentInstance = buildComponentInstance(component);
      // 这里做拦截
      if (onDrop) {
        onDrop({ componentInstance, state, setState });
      } else {
        // 新增组件
        addComponent(componentInstance);
        // 选中组件
        if (!currentComponent) setState({ currentComponent: componentInstance });
      };
      events.emit(EVENTS.CHECK_COMPONENT, componentInstance);
    };
  };

  return cloneElement(children, {
    onDragOver,
    onDrop: _onDrop
  })
};

export default DropAble;