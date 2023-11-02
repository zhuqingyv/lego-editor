import FormRender, { useForm } from "form-render";
import { useEffect, useState } from "react";

const XRender = () => {
  const form = useForm();
  const [state, setState] = useState({
    schema: "",
    value: {}
  });

  const { schema, value } = state;

  window.onmessage = ({ data: event }) => {
    const { from, data: { schema, value } } = event || {};
    if (from === 'lego-editor') {
      setState({
        schema,
        value
      });

      form.setValues(value);
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
  const onChange = (data) => {
    parent.postMessage({
      from: 'x-render-iframe',
      data: {
        type: 'onChange',
        data
      }
    })
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
