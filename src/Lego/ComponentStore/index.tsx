// @ts-ignore
import DragAble from './DragAble';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import './style.css';

const setMaterial = (material: any) => {
  return Object.keys(material).map((key) => material[key]);
};

const ComponentStore = ({ children }:any) => {
  const [state, setState] = useSignal('app');

  const { material: materialObject, isDev } = state;
  const material = setMaterial(materialObject);

  const onClick = (item: any, event: any) => {
    event.preventDefault();
    const { isDev } = state;
    if (isDev) {
      setState({ currentMaterial: item });
    };
  };

  return (
    <div className="ComponentStore-container">
      <div style={{ flex: 1 }}>
        <div className='ComponentStore-list-container'>
          {
            material.map((item, index) => <DragAble key={`component_store_${item.name}`} item={item} index={index} onClick={onClick} />)
          }
        </div>
      </div>
      { children }
    </div>
  )
};

export default ComponentStore;