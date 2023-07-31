import { useState } from 'react';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import './style.css';

const TreeItem = ({item, onClick, index, current}: any) => {
  const [open, setOpen] = useState(true);
  const [state] = useSignal('app');
  const { material } = state;
  const model = material[item.name];
  if (!model) return null;
  const { icon } = model;
  const { name, children = [] } = item;
  const isCurrent = current?.id === item.id;

  const hasIcon = children?.length;

  const onOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <div className={`${isCurrent ? 'tree-item-container-active' : 'tree-item-container'}`} style={{ marginLeft: `${index * 12}px` }} onClick={() => onClick(item)}>
        { (!!hasIcon) && <img
          src="https://picasso-static.xiaohongshu.com/fe-platform/897d21562d1ebaa53e17cd128ff50ef45ec9e508.png"
          onClick={onOpen}
          style={{ transform: `rotate(${open ? '0' : '-90'}deg)` }}
        /> }
        <img src={icon} />
        <span>{ name }</span>
      </div>
      { open && children.map((item: any) => <TreeItem item={item} key={`tree_item_${item.id}`} index={index + 1} onClick={onClick} current={current} />) }
    </>
  )
};

const Tree = () => {
  const [state, setState] = useSignal('app');

  const { dsl, currentComponent:current } = state;

  // @ts-ignore
  const onClick = (componentInstance) => {
    setState({ currentComponent: componentInstance })
  };

  return (
    <div className='tree-container'>
      {
        dsl.map((item: any) => <TreeItem item={item} current={current} key={`tree_item_${item.id}`} index={0} onClick={onClick} />)
      }
    </div>
  )
};

export default Tree;