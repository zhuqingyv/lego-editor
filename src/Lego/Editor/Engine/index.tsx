// @ts-ignore
import { useSignal } from 'react-use-signal';
// @ts-ignore
import DropAble from '../DropAble';
// @ts-ignore
const getEditorView = (item, state) => {
  const { material } = state;
  if (!item?.schemaValue) return null;

  if (item?.editorView) {
    const EditorView = item.editorView();
    return (
      <EditorView componentInstance={item} { ...item } key={item.id} DropAble={DropAble}>
        { !!(item?.children?.length) && <Engine dsl={item.children} /> }
      </EditorView>
    )
  };

  if (item?.name && material[item.name]) {
    const EditorView = material[item.name]?.editorView();
    return (
      <EditorView componentInstance={item} { ...item } key={item.id} DropAble={DropAble}>
        { !!(item?.children?.length) && <Engine dsl={item.children} /> }
      </EditorView>
    );
  };

  return null;
};
// @ts-ignore
const Engine = ({ dsl }) => {
  const [state] = useSignal('app');

  if (!dsl?.length) return null;

  return dsl.map((item: any) => getEditorView(item, state));
};

export default Engine;