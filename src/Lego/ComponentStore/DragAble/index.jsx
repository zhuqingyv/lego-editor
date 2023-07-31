import './style.css';

const DragAble = (props) => {
  const {
    item,
    ['data-component']: data,
    onClick = () => null,
    onDelete
  } = props;
  const { icon, name } = item;

  const onDragStart = (event) => {
    event.stopPropagation();
    const componentString = event.target.dataset.component;
    if (componentString) {
      event.dataTransfer.setData('text/plain', event.target.dataset.component);
    };
  };

  const _onDelete = (event) => {
    onDelete({item, data, event});
  };

  return (
    <div className='drag-able-container' draggable={true} data-component={data} onDragStart={onDragStart} onClick={(event) => onClick(item, event)}>
      { (!!onDelete) && <img src='https://picasso-static.xiaohongshu.com/fe-platform/f9bd74a158d17635d3fdca85a0330d3f41e3bae6.png' onClick={_onDelete} /> }
      <div className='drag-able-icon-container'>
        <img className='drag-able-icon' src={icon} draggable={false} />
      </div>
      <div className='drag-able-name' draggable={false}>{ name }</div>
    </div>
  )
};

export default DragAble;