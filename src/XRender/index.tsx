import FormRender, { useForm } from "form-render";
import { useEffect, useState } from "react";

const XRender = () => {
  const form = useForm();
  const [state, setState] = useState({
    schema: "",
    value: {},
    id: ''
  });

  const { schema, value, id } = state;

  console.log(schema, value);

  window.onmessage = ({ data: event }) => {
    const { from, data: { schema, value, id } } = event || {};
    
    if (from === 'lego-editor') {
      setState({
        schema,
        value,
        id
      });

      form.setValues(value);

      setTimeout(() => {
        const data = form.getValues();
        if (data !== value) {
          onChange(id);
        }
        form.setValues(data);
      }, 100);
    };
  };

  const onFinish = (event) => {
    parent.postMessage({
      from: 'x-render-iframe',
      data: {
        type: 'onFinish',
        data: {}
      }
    })
  };

  const onChange = (id: string) => {
    setTimeout(() => {
      const data = form.getValues()
      parent.postMessage({
        from: 'x-render-iframe',
        data: {
          type: 'onChange',
          data: data,
          id
        }
      })
    }, 200);
  };

  return (
    <div>
      <FormRender
        form={form}
        schema={schema}
        onFinish={onFinish}
        watch={{
          "#": onChange,
        }}
        column={1}
        defaultValue={value}
        initialValues={value}
      />
    </div>
  );
};

export default XRender;
