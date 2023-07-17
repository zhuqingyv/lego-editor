import { useSignal } from 'react-use-signal';
import DropAble from '../DropAble';

const getEditorView = (item, state) => {
  const { material } = state;

  if (item?.editorView) {
    const EditorView = item.editorView();
    return (
      <EditorView componentInstance={item} { ...item } key={item.id} DropAble={DropAble}>
        <Engine dsl={item.children} />
      </EditorView>
    )
  };

  if (item?.name && material[item.name]) {
    const EditorView = material[item.name]?.editorView;
    return (
      <EditorView componentInstance={item} { ...item } key={item.id} DropAble={DropAble}>
        <Engine dsl={item.children} />
      </EditorView>
    );
  };

  return null;
};

const Engine = (props) => {
  const { dsl } = props;
  const [state] = useSignal('app');

  if (!dsl?.length) return null;

  return dsl.map((item) => getEditorView(item, state));
};

export default Engine;