export default {
  type: 'object',
  properties: {
    source: {
      title: 'source',
      type: 'string',
      default: 'https://lottie.host/f4642d11-5e62-4957-aac8-ca0f76c6b280/VPvpGjSxsJ.json'
    },
    showType: {
      type: 'boolean',
      title: '播放结束是否进入下一步',
      widget: 'switch',
      default: false
    },
    position: {
      title: '位置调整',
      type: 'object',
      properties: {
        top: {
          type: 'number',
          description: '向下移动距离',
          maxWidth: 60,
          column: 2,
          default: 0
        },
        left: {
          type: 'number',
          description: '向右移动距离',
          maxWidth: 60,
          column: 2,
          default: 0
        }
      }
    }
  }
};