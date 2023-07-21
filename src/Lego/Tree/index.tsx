// @ts-ignore
import { useSignal } from 'react-use-signal';
import './style.css';

const TreeItem = ({item, onClick, index, current}: any) => {
  const [state] = useSignal('app');
  const { material } = state;
  const model = material[item.name];
  if (!model) return null;
  const { icon } = model;
  const { name, children = [] } = item;
  const isCurrent = current?.id === item.id;
  return (
    <>
      <div className={`${isCurrent ? 'tree-item-container-active' : 'tree-item-container'}`} style={{ marginLeft: `${index * 12}px` }} onClick={() => onClick(item)}>
        <img src={icon} />
        <span>{ name }</span>
      </div>
      { children.map((item: any) => <TreeItem item={item} key={`tree_item_${item.id}`} index={index + 1} onClick={onClick} current={current} />) }
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