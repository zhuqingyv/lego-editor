import { useEffect, useState, memo } from 'react';
import { useSignal, createSignal, initSingalManager } from 'react-use-signal';
import './style.css';

const TreeItem = ({item, onClick, index, current}) => {
  const { name, icon, children = [] } = item;
  const isCurrent = current?.id === item.id;
  return (
    <>
      <div className={`${isCurrent ? 'tree-item-container-active' : 'tree-item-container'}`} style={{ marginLeft: `${index * 6}px` }} onClick={() => onClick(item)}>
        <img src={icon} />
        <span>{ name }</span>
      </div>
      { children.map((item) => <TreeItem item={item} key={`tree_item_${item.id}`} index={index + 1} onClick={onClick} current={current} />) }
    </>
  )
};

const Tree = () => {
  const [state, setState] = useSignal('app');

  const { dsl, currentComponent:current } = state;

  const onClick = (componentInstance) => {
    setState({ currentComponent: componentInstance })
  };

  return (
    <div className='tree-container'>
      {
        dsl.map((item) => <TreeItem item={item} current={current} key={`tree_item_${item.id}`} index={1} onClick={onClick} />)
      }
    </div>
  )
};

export default Tree;