export interface CreateParams {
  name: string;
  icon?: string;
  defaultValue: any;
  schema: object;
  editorView: () => any;
  view: () => any;
};

class ComponentCreator {
  static getUuid = () => {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  }
  components = new Map();

  create = ({ name, icon, schema, defaultValue, editorView, view }: CreateParams) => {
    // 查重
    if (this.components.get(name)) {
      console.warn(`『${name}』is repeat!`);
      return;
    };

    const component = {
      name,
      icon,
      schema,
      editorView,
      view
    }

    // 存入
    this.components.set(name, component);
  };

  build = ({ name }: { name: string }) => {
    const componentModel = this.components.get(name);

    if (!componentModel) {
      console.warn(`No component named ${name}`);
      return;
    };

    const id = ComponentCreator.getUuid();
    const { schema } = componentModel;

    return {
      children: [],
      ...componentModel,
      schema: JSON.parse(JSON.stringify({ ...schema, path: id })),
      id
    }
  };

  outputList = () => {
    return Array.from(this.components).reduce((pre, cur) => {
      const [key, component] = cur;
      // @ts-ignore
      pre[key] = component;
      return pre;
    }, {})
  };

};

export default ComponentCreator;

export const creator = new ComponentCreator();

