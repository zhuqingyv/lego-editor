import FormRender, { useForm } from 'form-render';
import { useEffect, memo } from 'react';
import { EVENTS } from 'const';
import { events } from 'events';

const SchemaDefaultValueGetter = ({ componentInstance }) => {
  const form = useForm();

  const onFinish = (formData) => {
    if (componentInstance) {
      events.emit(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, { id: componentInstance.id, value: formData });
    };
  };

  useEffect(() => {
    queueMicrotask(() => {
      form.submit();
    });
  }, [componentInstance]);

  return (
    <div style={{ display: 'none' }}>
      <FormRender
        form={form}
        schema={componentInstance?.schema || {}}
        onFinish={onFinish}
      />
    </div>
  )
};

export default memo(SchemaDefaultValueGetter);