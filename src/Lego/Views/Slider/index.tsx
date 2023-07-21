import './index.css';


const Slider = (props: any) => {
  const { schemaValue = {}, children } = props;
  const { backgroundColor } = schemaValue;

  return (
    <div className='slider-container' style={{ backgroundColor }}>
      { children }
    </div>
  )
};

export default Slider;