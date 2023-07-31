export default {
  type: 'object',
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
      default: 'https://picasso-static.xiaohongshu.com/fe-platform/a91e4d0f2e1701115bd59839b5b634cd4f3ea3cc.png'
    }
  }
}