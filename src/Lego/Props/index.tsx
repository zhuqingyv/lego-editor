// @ts-ignore
import { useSignal } from 'react-use-signal';
// @ts-ignore
import { events } from 'events';
// @ts-ignore
import { EVENTS } from 'const';
import FormRender, { useForm } from 'form-render';
import './style.css';
import { useEffect, useRef } from 'react';

const getSchema = (name: string = '', state: any) => {
  const { material } = state;
  const componentModel = material[name];

  if (componentModel?.schema) return componentModel.schema;
  return {}
};

const Props = () => {
  const timer = useRef(setTimeout(() => null));
  const [state] = useSignal('app');
  const form = useForm();
  const { currentComponent } = state;

  const onFinish = (formData: any) => {
    const { id } = currentComponent;
    events.emit(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, { id, value: formData });
  };

  const onChange = (allValues: any) => {
    if (timer?.current) clearTimeout(timer?.current);

    timer.current = setTimeout(() => {
      const { id } = currentComponent;
      events.emit(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, { id, value: allValues });
    }, 800);
  };

  useEffect(() => {
    if (currentComponent) {
      if (currentComponent.schemaValue) {
        form.setValues(currentComponent.schemaValue);
        return;
      };
      const defaultValue = form.getValues();
      form.setValues(defaultValue);
      const { id } = currentComponent;
      events.emit(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, { id, value: defaultValue });
    };
  }, [currentComponent]);

  return (
    <div className="props-container" style={{ maxHeight: window.innerHeight - 50 }}>
      <span className='props-title'>{ currentComponent?.name ? `◉ ${currentComponent?.name}` : '◌ 未选中组件' }</span>
      <div className='props-form-container'>
        <FormRender
          id={currentComponent?.id}
          form={form}
          schema={currentComponent?.schema || getSchema(currentComponent?.name, state) || {}}
          onFinish={onFinish}
          watch={{
            '#': onChange
          }}
          // footer={true}
          column={1}
        />
      </div>
    </div>
  )
};

export default Props