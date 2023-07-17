import './index.css';

const Scene = (props) => {
  const { schemaValue = {}, DropAble, componentInstance, children } = props;
  const { centerX, centerY } = schemaValue;

  if (centerX || centerY) {
    return (
      <div className='scene-item-container'>
        <div className='scene-item-center-container' style={{ justifyContent: centerY ? 'center' : 'flex-start', alignItems: centerX ? 'center' : 'flex-start' }}>
          { children }
        </div>
      </div>
    )
  }

  return (
    <div className='scene-item-container'>
      { children }
    </div>
  );
};

export default Scene;