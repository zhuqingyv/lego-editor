import { memo } from 'react';
import DragAble from '../DragAble';
import './styles.css'

const Templates = ({ allTemplate, onDeleteTemplate }: any) => {
  if (!allTemplate?.length) return null;

  return (
    <>
      <div className='ComponentStore-title'>模版</div>
      <div className='templates-container'>
        {
          allTemplate.map((template: any = {}, index: number) => {
            const { id, dsl, name, path, type } = template;
            return (
              <DragAble
                key={`component_store_template_${name}`}
                data-component={JSON.stringify({ dsl, name, id, path, type })}
                item={template}
                index={index}
                onDelete={onDeleteTemplate}
              />
            );
          })
        }
      </div>
    </>
  )
};

export default memo(Templates);