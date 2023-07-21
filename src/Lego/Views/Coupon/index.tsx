import './index.css';

const Mask = (props: any) => {
  const { children, schemaValue = {} } = props;
  const { backgroundColor } = schemaValue;
  return (
    <div className='mask' style={{ backgroundColor }}>
      { children }
    </div>
  );
};

export default Mask;