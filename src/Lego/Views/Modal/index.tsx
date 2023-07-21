import './index.css';

const Mask = (props: any) => {
  const { children } = props;

  return (
    <div className='modal-container'>
      <div className='modal-bored-container'>
        { children }
      </div>
    </div>
  );
};

export default Mask;