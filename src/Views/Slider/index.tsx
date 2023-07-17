import './index.css';


const Slider = (props) => {
  const { schemaValue = {}, DropAble, componentInstance, children } = props;
  const { backgroundColor } = schemaValue;

  return (
    <div className='slider-container' style={{ backgroundColor }}>
      { children }
    </div>
  )
};

export default Slider;