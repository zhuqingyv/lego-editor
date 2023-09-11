// @ts-ignore
import { useSignal } from 'react-use-signal';
import { Link } from 'react-router-dom'
// @ts-ignore
import service from '@service';
import './style.css';
// deletePage
const DeleteIcon = ({ id }:any) => {
  const onDelete = async(event: any) => {
    event.stopPropagation();
    event.preventDefault();
    await service('deletePage', id);
    window.location.reload();
  };
  return <img className='page-list-item-delete-icon' src="https://picasso-static.xiaohongshu.com/fe-platform/f9bd74a158d17635d3fdca85a0330d3f41e3bae6.png" onClick={onDelete} />
};

const PageItem = ({ name, icon, id }:any) => {
  const onLoad = () => {
    alert('onLoad')
  };
  return (
    <Link to={`page/${id}`} reloadDocument={true} style={{ textDecoration: 'none', cursor: 'default' }}>
      <div className='page-list-item-container'>
        <div className='page-list-item-icon-container'>
          <img className='page-list-item-icon' src={icon} />
        </div>
        <div className='page-list-item-info-container'>
          <span className='page-list-item-info-name'>{ name }</span>
          <span className='page-list-item-info-id'>ID: { id }</span>
        </div>
        <DeleteIcon id={id} />
      </div>
    </Link>
  )
};

const List = () => {
  const [state] = useSignal('pageList');
  const { pages = [] } = state;

  return (
    <div className='page-list-container'>
      {
        pages.map((page: any) => <PageItem { ...page } key={page.id} />)
      }
    </div>
  )
};

export default List;