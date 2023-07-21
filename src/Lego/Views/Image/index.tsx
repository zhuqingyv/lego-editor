import './index.css';

const Button = (props: any) => {
  const { schemaValue = {} } = props;
  const { source } = schemaValue;

  return (
    <img src={source} />
  );
};

export default Button;