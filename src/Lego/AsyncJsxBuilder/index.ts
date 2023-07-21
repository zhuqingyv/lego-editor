// @ts-ignore
import { creator } from 'creator';

interface AsyncJsx {
  icon: string;
  name: string;
  editorView: string;
};

const asyncJsxBuilder = (list: AsyncJsx[] = []) => {
  return new Promise((resolve, reject) => {
    // 超时
    const timer = setTimeout(() => {
      reject('timeout')
    }, 20000000000);
  
    const store = {
      map: new Map(),
      count: 0
    };

    // @ts-ignore
    window.register = (name: string, editorView: any) => {
      store.map.set(name, editorView);
      const { size } = store.map;

      if (size === store.count) {
        clearTimeout(timer);
        const componentsModel = list.map((item) => {
          const componentModel = {
            ...item,
            editorView: () => editorView,
          }
          creator.create(componentModel);

          return componentModel
        })
        resolve(componentsModel);
      };
    };

    list.forEach((jsx) => {
      const { editorView } = jsx;
      const script = document.createElement('script');
      script.type = 'text/babel';
      script.innerText = editorView;
      document.body.appendChild(script);
    });

    store.count = list.length;

    // @ts-ignore
    if (window.Babel) {
      // @ts-ignore
      Babel.transformScriptTags();
    };
  })
};

export default asyncJsxBuilder;