// @ts-ignore
import { useSignal } from "react-use-signal";
// @ts-ignore
import { events } from "events";
// @ts-ignore
import { EVENTS } from "const";
import FormRender, { useForm } from "form-render";
import "./style.css";
import { useEffect, useRef } from "react";
import IframeContainer from "./Iframe";

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
    if (currentComponent) {
      if (currentComponent.schemaValue) {
        const currentValue = form.getValues();
        if (
          JSON.stringify(currentValue) !==
          JSON.stringify(currentComponent.schemaValue)
        ) {
          setTimeout(() => {
            form.setValues(currentComponent.schemaValue);
          });
        }
        return;
      }
      const defaultValue = form.getValues();
      form.setValues(defaultValue);
      const { id } = currentComponent;
      events.emit(EVENTS.UPDATE_COMPONENT_SCHEMA_VALUE, {
        id,
        value: defaultValue,
      });
    }
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
        <IframeContainer
          src="https://local.xiaohongshu.com:8080/#/x-render"
          schema={state?.currentComponent?.schema ||  getSchema(currentComponent?.name, state)}
          onFinish={onFinish}
          onChange={onChange}
          value={state?.currentComponent?.schemaValue}
          id={state?.currentComponent?.id}
        />
      </div>
    </div>
  );
};

export default Props;
