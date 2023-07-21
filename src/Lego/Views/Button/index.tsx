import './index.css';

const Button = (props: any) => {
  const { schemaValue = {} } = props;
  const { text, theme, rect } = schemaValue;
  const { backgroundImage, backgroundColor, color } = theme;
  const { fontSize, value } = text;
  const { borderRadius, bottom } = rect;

  return (
    <div className='button-container' style={{ bottom: `${bottom}px` }}>
      <div
        className='button-content'
        style={{
          backgroundColor,
          backgroundImage,
          borderRadius: `${borderRadius}px`,
          fontSize: `${fontSize}px`,
          color,
        }}
      >
        { value }
      </div>
    </div>
  );
};

export default Button;