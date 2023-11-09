// @ts-ignore
import { useSignal } from "react-use-signal";
// @ts-ignore
import { events } from "events";
// @ts-ignore
import { EVENTS } from "const";
// import FormRender, { useForm } from "form-render";
import "./style.css";
import { useEffect, useRef } from "react";
import FormRender, { useForm } from "form-render";

const getSchema = (name: string = "", state: any) => {
  const { material } = state;
  const componentModel = material[name];

  if (componentModel?.schema) return componentModel.schema;
  return {};
};

const Props = () => {
  const timer = useRef(setTimeout(() => null));
  const [state, setState] = useSignal("app");
  const form = useForm();
  const { currentComponent } = state;
  const onClickForm = () => {
    setState({ copyComponent: null });
  };

  const onFinish = (formData: any) => {
    const { id } = currentComponent;
    events.emit(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, { id, value: formData });
  };

  const onChange = (allValues: any) => {
    if (timer?.current) clearTimeout(timer?.current);

    timer.current = setTimeout(() => {
      if (
        JSON.stringify(currentComponent.schemaValue) !==
        JSON.stringify(allValues)
      ) {
        const { id } = currentComponent;
        events.emit(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, {
          id,
          value: allValues,
        });
      }
    }, 500);
  };

  useEffect(() => {
    // 当
    if (currentComponent) {
      if (currentComponent.schemaValue) form.setValues(currentComponent.schemaValue);
    };
  }, [currentComponent]);

  return (
    <div
      className="props-container"
      style={{ maxHeight: window.innerHeight - 50 }}
    >
      <span className="props-title">
        {currentComponent?.name
          ? `◉ ${currentComponent?.name}`
          : "◌ 未选中组件"}
      </span>
      <div className="props-form-container" onClick={onClickForm}>
        <FormRender
          form={form}
          schema={getSchema(currentComponent?.name, state)}
          watch={{
            '#': onChange
          }}
          onFinish={onFinish}
        />
      </div>
    </div>
  );
};

export default Props;
