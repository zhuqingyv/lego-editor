import { memo, useState, useEffect } from 'react';
// @ts-ignore
import { useSignal } from 'react-use-signal';
// @ts-ignore
import DropAble from '../DropAble';
import LottieZipSourceLoader from '../../base/LottieZipSourceLoader';
import update from '../Update';

// @ts-ignore
const EditorView = memo(({ item, rectRegister, material }: any) => {
  const [updater, setState] = useState(() => () => null) as any;
  update.create(item.id, setState);

  useEffect(() => {
    () => {
      update.delete(item.id)
    };
  }, []);

  useEffect(() => {
    if (updater) updater();
  }, [updater]);

  if (!item?.schemaValue) return null;

  if (item?.editorView) {
    const ItemEditorView = item.editorView();
    return (
      <ItemEditorView
        lottieZipLoader={LottieZipSourceLoader}
        rectRegister={(ref: any) => rectRegister(item, ref)}
        componentInstance={item}
        key={item.id}
        DropAble={DropAble}
        {...item}
      >
        {!!(item?.children?.length) && <Engine dsl={item.children} />}
      </ItemEditorView>
    )
  };

  if (item?.name && material[item.name]) {
    const ItemEditorView = material[item.name]?.editorView();
    return (
      <ItemEditorView
        lottieZipLoader={LottieZipSourceLoader}
        rectRegister={(ref: any) => rectRegister(item, ref)}
        componentInstance={item}
        key={item.id}
        DropAble={DropAble}
        {...item}
      >
        {!!(item?.children?.length) && <Engine dsl={item.children} />}
      </ItemEditorView>
    );
  };

  return null;
}, (props1: any, props2: any) => {
  return props1.item === props2.item && JSON.stringify(props1) === JSON.stringify(props2)
});
// @ts-ignore
const Engine = ({ dsl: currentDSL }: any) => {
  const [dsl] = useSignal('app', 'dsl');
  const [rectRegister] = useSignal('app', 'rectRegister');
  const [material] = useSignal('app', 'material');

  if (!dsl?.length) return null;
  // @ts-ignore
  return (
    <>
      {
        [...(currentDSL || dsl)].map((item: any, i: number) => <EditorView item={item} rectRegister={rectRegister} material={material} key={`engine-${item.id || item.i}`} />)
      }
    </>
  );
};

export default Engine;