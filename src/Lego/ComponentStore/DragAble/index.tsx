import './style.css';

const getLinkType = (link: string): string => {
  if (link.startsWith("data:image/svg+xml")) {
    return "svg";
  } else if (link.startsWith("http://") || link.startsWith("https://")) {
    return "http";
  } else if (link.startsWith("data:image/")) {
    return "base64";
  } else {
    return "unknown";
  }
}

const Icon = ({ source }: { source: string }) => {
  const type = getLinkType(source);

  switch (type) {
    case 'base64':
    case 'http':
      {
        return <img className='drag-able-icon' src={source} draggable={false} />
      }
    case 'svg': {
      return <div className='drag-able-icon' dangerouslySetInnerHTML={{ __html: source }}></div>
    }
    default: {
      return null;
    }
  }
};

const DragAble = (props: any) => {
  const {
    item,
    ['data-component']: data,
    onClick = () => null,
    onDelete
  } = props;
  const { icon, name } = item;

  const onDragStart = (event: any) => {
    event.stopPropagation();
    const componentString = event.target.dataset.component;
    if (componentString) {
      event.dataTransfer.setData('text/plain', event.target.dataset.component);
    };
  };

  const _onDelete = (event: any) => {
    if (onDelete) onDelete({ item, data, event });
  };
  // drag-able-icon-alpha-container
  return (
    <div className='drag-able-container' draggable={true} data-component={data} onDragStart={onDragStart} onClick={(event) => onClick(item, event)}>
      {(!!onDelete) && <img src='https://picasso-static.xiaohongshu.com/fe-platform/953f231540463c0b3f3029c9b471e93864082068.png' onClick={_onDelete} />}
      <div className={`drag-able-icon-container ${onDelete ? 'drag-able-icon-alpha-container' : ''}`}>
        <Icon source={icon} />
      </div>
      <div className='drag-able-name' draggable={false}>{name}</div>
    </div>
  )
};

export default DragAble;