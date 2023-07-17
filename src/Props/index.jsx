import { useSignal } from 'react-use-signal';
import { events } from 'events';
import { EVENTS } from 'const';
import FormRender, { connectForm } from 'form-render';
import './style.css';
import { useEffect } from 'react';

const Props = ({ form }) => {
  const [state] = useSignal('app');

  const { currentComponent } = state;

  const onFinish = (formData) => {
    const { id } = currentComponent;
    events.emit(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, { id, value: formData });
  };

  useEffect(() => {
    if (currentComponent) {
      form.setValues(currentComponent.schemaValue);
    };
  }, [currentComponent]);

  return (
    <div className="Props-container">
      <span className='Props-title'>{ currentComponent?.name }</span>
      {
        !!(currentComponent?.schema) && (
          <FormRender
            id={currentComponent.id}
            form={form}
            schema={currentComponent.schema}
            onFinish={onFinish}
            footer={true}
          />
        )
      }
    </div>
  )
};

export default connectForm(Props);