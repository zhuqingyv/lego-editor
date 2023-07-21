export default {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: '标题',
      default: '标题'
    },
    centerX: {
      type: 'boolean',
      title: '水平居中',
      widget: 'switch',
      default: true
    },
    centerY: {
      type: 'boolean',
      title: '垂直居中',
      widget: 'switch',
      default: true
    }
  },
};