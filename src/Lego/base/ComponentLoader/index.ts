import AsyncCssBuilder from '../AsyncCssBuilder';
// @ts-ignore
import { safeParse } from 'lib';

enum Type {
  TREE = 'tree',
  BLOB = 'blob'
};

enum AssetName {
  MAIN = 'index.jsx',
  SCHEMA = 'schema.json',
  CSS = 'style.css'
};

type AssetsType = {
  name: AssetName;
  path: string;
  type: Type;
  contentValue: string;
};

type ComponentType = {
  name: string;
  path: string;
  type: Type;
  children: AssetsType[];
};

type ComponentModel = {
  name: string;
  icon?: string;
  editorView?: any;
};

const componentLoader = (component: ComponentType) => {
  const { Babel } = window as any;
  if (!Babel) return;

  const { name, children = [] } = component;
  const componentModel:ComponentModel = {
    name,
  };

  children.forEach((asset) => {
    const { type, name, contentValue = '' } = asset;

    if (type !== Type.BLOB) return;
    switch(name) {
      case AssetName.MAIN: {
        const { code } = Babel.transform(contentValue, {
          presets: ['es2015', 'react']
        });

        const { icon, editorView } = eval(code) || {};
        componentModel.icon = icon;
        componentModel.editorView = () => editorView;
        break;
      }
      case AssetName.SCHEMA: {
        const schema = safeParse(contentValue, {});
        componentModel.schema = schema;
        break;
      }
      case AssetName.CSS: {
        AsyncCssBuilder(contentValue);
        break;
      }
      default: break;
    };
  });

  return componentModel
};


export default componentLoader;