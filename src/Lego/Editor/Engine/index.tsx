import { memo } from 'react';
// @ts-ignore
import { useSignal } from 'react-use-signal';
// @ts-ignore
import DropAble from '../DropAble';
// @ts-ignore
const EditorView = memo(({ item, rectRegister, material }) => {
  if (!item?.schemaValue) return null;

  if (item?.editorView) {
    const ItemEditorView = memo(item.editorView());
    return (
      <ItemEditorView rectRegister={(ref:any) => rectRegister(item, ref)} componentInstance={item} { ...item } key={item.id} DropAble={DropAble}>
        { !!(item?.children?.length) && <Engine dsl={item.children} /> }
      </ItemEditorView>
    )
  };

  if (item?.name && material[item.name]) {
    const ItemEditorView = memo(material[item.name]?.editorView());
    return (
      <ItemEditorView rectRegister={(ref:any) => rectRegister(item, ref)} componentInstance={item} { ...item } key={item.id} DropAble={DropAble}>
        { !!(item?.children?.length) && <Engine dsl={item.children} /> }
      </ItemEditorView>
    );
  };

  return null;
});
// @ts-ignore
const Engine = ({ dsl: currentDSL }) => {
  const [ dsl ] = useSignal('app', 'dsl');
  const [ rectRegister ] = useSignal('app', 'rectRegister');
  const [ material ] = useSignal('app', 'material');
  if (!dsl?.length) return null;
  // @ts-ignore
  return (currentDSL || dsl).map((item: any, i: number) => <EditorView item={item} rectRegister={rectRegister} material={material} key={`engine-${i}`} />);
};

export default Engine;