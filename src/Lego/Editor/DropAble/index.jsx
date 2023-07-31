import { cloneElement, useState } from 'react';
import { creator } from 'creator';
import { useSignal } from 'react-use-signal';
import uuid from 'react-uuid'

import SchemaDefaultValueGetter from '../SchemaGetter';
import './style.css';

const forEachUuid = (oldDSL = []) => {
  const loop = (array = []) => {
    array.forEach((item) => {
      const id = uuid();
      const { children = [] } = item;
      item.id = id;

      if (children?.length) {
        loop(children);
      };
    })
  };

  loop(oldDSL);
  return oldDSL;
};

const DropAble = ({ children, target, onDrop }) => {
  const [newComponentInstance, setNewComponentInstance] = useState(null);
  const [state, setState] = useSignal('app');

  const { dsl, currentComponent: current } = state;
  const currentComponent = target || current;

  const buildComponentInstance = (component) => {
    const {type} = component;
    switch(type) {
      case 'template': {
        const { dsl = [] } = component;
        const newDSL = forEachUuid(dsl);
        return newDSL;
      }
      default: {
        return creator.build({ name: component.name });
      }
    }
  };

  const addComponent = (component) => {
    const push = (target) => {
      if (component instanceof Array) {
        target.push(...component);
      } else {
        target.push(component);
      }
    };
    if (currentComponent) {
      push(currentComponent.children);
    } else {
      push(dsl);
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
      setNewComponentInstance(componentInstance);
      // 这里做拦截
      if (onDrop) {
        onDrop({ componentInstance, state, setState });
      } else {
        // 新增组件
        addComponent(componentInstance);
        // 选中组件
        if (!currentComponent) setState({ currentComponent: componentInstance });
      };
    };
  };

  return (
    <>
      {
        cloneElement(children, {
          onDragOver,
          onDrop: _onDrop
        })
      }
      <SchemaDefaultValueGetter componentInstance={newComponentInstance} />
    </>
  )
};

export default DropAble;