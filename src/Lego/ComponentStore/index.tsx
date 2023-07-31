// @ts-ignore
import DragAble from './DragAble';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import './style.css';

const setMaterial = (material: any) => {
  return Object.keys(material).map((key) => material[key]);
};

const ComponentStore = ({ children }:any) => {
  const [isDev] = useSignal('app', 'isDev');
  const [materialObject] = useSignal('app', 'material');
  const [_, setState] = useSignal('app', );

  const material = setMaterial(materialObject);

  const onClick = (item: any, event: any) => {
    event.preventDefault();
    if (isDev) {
      setState({ currentMaterial: item });
    };
  };

  return (
    <div className="ComponentStore-container">
      <div style={{ flex: 1 }}>
        <div className='ComponentStore-list-container'>
          {/* 基础组件 */}
          {
            !!isDev && material.map((item, index) => {
              const { schema, name, id } = item;
              return (
                <DragAble
                  key={`component_store_${item.name}`}
                  data-component={JSON.stringify({ schema, name, id })}
                  item={item}
                  index={index}
                  onClick={onClick}
                />
              )
            })
          }
          {/* 模版组件 */}

        </div>
      </div>
      { children }
    </div>
  )
};

export default ComponentStore;