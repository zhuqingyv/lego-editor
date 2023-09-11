import { memo } from 'react';
import DragAble from '../DragAble';
// @ts-ignore
import { toast, TypeEnum } from 'toast'
import { useParams } from 'react-router-dom'
// @ts-ignore
import service from '@service';
import './styles.css';

const AddComponentButton = ({ onAddComponent }: any) => {
  return (
    <div className='ComponentStore-add-component-button' onClick={onAddComponent}></div>
  )
};

const Components = ({ api, isDev, material, onClick }: any) => {
  const { pageId } = useParams();
  if (!isDev || !material?.length) return null;
  const onAddComponent = async() => {
    // componentsList
    const name = prompt('请输入组件名称(不能重复，且为英文)');

    if (name === null) return;

    const list = await service('componentsList');
    const has = list.find(({name: itemName}: any) => (itemName === name));

    if (has) {
      await toast('名称重复', TypeEnum.FAIL);
      setTimeout(() => onAddComponent(), 1000);
      return;
    };

    const _icon = prompt('请输入组件icon(http地址)');
    if (_icon === null) return;
    const icon = _icon || 'https://picasso-static.xiaohongshu.com/fe-platform/290df008fbd751248c04662111efa2de508c4bd4.png';
    
    const changeList = [
      {
        type: 'jsx',
        codeValue: `({
          icon: '${icon}',
          editorView: (props) => {
            const { schemaValue = {}, rectRegister } = props;
            const { text = '新组件' } = schemaValue;
            return (
              <div ref={rectRegister}>{ text }: ${name}</div>
            )
          }
        });`
      },
      {
        type: 'css',
        codeValue: ''
      },
      {
        type: 'schema',
        codeValue: `{
          "type": "object",
          "title": "${name}",
          "properties": {
             "text": {
                "type": "string",
                "title": "文本",
                "default": "新组件"
             }
          }
       }`
      }
    ];
    toast('正在添加组件!', TypeEnum.LOADING);
    service('createComponent', { name, value: changeList })
      .then(async() => {
        toast('组件添加成功，正在更新组件!', TypeEnum.LOADING);
        // 保存组件信息
        await api.components();

        toast('正在更新视图!', TypeEnum.LOADING);
        // 重新渲染数据
        await api.pageInfo(pageId);
        toast('更新成功!', TypeEnum.SUCCESS);
      });
  };
  return (
    <>
      <div className='ComponentStore-title'>组件</div>
      <div className='ComponentStore-list-container'>
        <AddComponentButton onAddComponent={onAddComponent} />
        {
          material.map((item: any, index: number) => {
            const { schema, name, id } = item;
            return (
              <DragAble
                key={`component_store_${item.name}`}
                data-component={JSON.stringify({ schema, name, id })}
                item={item}
                index={index}
                onClick={onClick}
              />
            )
          })
        }
      </div>
    </>
  );
};

export default memo(Components);