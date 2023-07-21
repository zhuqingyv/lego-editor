// @ts-ignore
import DragAble from './DragAble';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import './style.css';

const setMaterial = (material: any) => {
  return Object.keys(material).map((key) => material[key]);
};

const ComponentStore = ({ children }:any) => {
  const [state] = useSignal('app');

  const { material: materialObject } = state;
  const material = setMaterial(materialObject);

  return (
    <div className="ComponentStore-container">
      <div style={{ flex: 1 }}>
        <div className='ComponentStore-list-container'>
          {
            material.map((item, index) => <DragAble key={`component_store_${item.name}`} item={item} index={index} />)
          }
        </div>
      </div>
      { children }
    </div>
  )
};

export default ComponentStore;