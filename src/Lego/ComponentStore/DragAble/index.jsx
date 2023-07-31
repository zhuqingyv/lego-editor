import './style.css';

const DragAble = (props) => {
  const {
    item,
    ['data-component']: data,
    onClick = () => null
  } = props;
  const { icon, name } = item;

  const onDragStart = (event) => {
    event.stopPropagation();
    const componentString = event.target.dataset.component;
    if (componentString) {
      event.dataTransfer.setData('text/plain', event.target.dataset.component);
    };
  };

  return (
    <div className='drag-able-container' draggable={true} data-component={data} onDragStart={onDragStart} onClick={(event) => onClick(item, event)}>
      <div className='drag-able-icon-container'>
        <img className='drag-able-icon' src={icon} draggable={false} />
      </div>
      <div className='drag-able-name' draggable={false}>{ name }</div>
    </div>
  )
};

export default DragAble;