interface SchemaProps {
  title: string;
  icon: string;
};

export default (props: SchemaProps) => {
  const { title, icon } = props;
  return {
    type: 'object',
    title,
    properties: {
      name: {
        type: 'string',
        title: '模版名称',
        required: true
      },
      icon: {
        type: 'string',
        title: '模版图标',
        format: 'image',
        default: icon
      }
    }
  }
};