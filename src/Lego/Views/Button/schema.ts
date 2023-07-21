export default {
  type: 'object',
  properties: {
    action: {
      type: 'object',
      title: '点击行为',
      properties: {
        type: {
          type: 'string',
          title: '类型',
          tooltip: '单项选择',
          widget: 'select',
          enum: [
            'next',
            'link'
          ],
          enumNames: [
            '下一步',
            '跳转'
          ],
          default: 'next'
        },
        link: {
          type: 'string',
          title: '链接',
          widget: 'urlInput',
          hidden: "{{ formData.action.type !== 'link' }}"
        }
      }
    },
    theme: {
      type: 'object',
      title: '主题',
      properties: {
        backgroundColor: {
          title: '背景颜色',
          type: 'string',
          widget: 'Color',
          minWidth: 1000,
          default: '#f00'
        },
        color: {
          title: '字体颜色',
          type: 'string',
          widget: 'Color',
          minWidth: 1000,
          default: '#fff'
        },
        backgroundImage: {
          title: '背景图',
          type: 'string',
          format: 'image',
          default: ''
        },
      }
    },
    text: {
      type: 'object',
      title: '文本',
      properties: {
        value: {
          title: '文本',
          type: 'string',
          labelWidth: 1000,
          default: '按钮文本'
        },
        fontSize: {
          type: 'number',
          title: '字号',
          description: '字体大小',
          maxWidth: 60,
          default: 12
        }
      }
    },
    rect: {
      type: 'object',
      title: '位置与形状',
      properties: {
        borderRadius: {
          type: 'number',
          title: '圆角',
          description: '向下移动距离',
          maxWidth: 60,
          default: 6
        },
        bottom: {
          type: 'number',
          title: '下间距',
          default: 0
        }
      }
    }
  },
};