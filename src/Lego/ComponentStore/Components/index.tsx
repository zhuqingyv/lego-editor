import { memo } from 'react';
import DragAble from '../DragAble';
import './styles.css';

const Components = ({ isDev, material, onClick }: any) => {
  if (!isDev || !material?.length) return null;
  return (
    <>
      <div className='ComponentStore-title'>组件</div>
      <div className='ComponentStore-list-container'>
        {
          material.map((item: any, index: number) => {
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
      </div>
    </>
  );
};

export default memo(Components);