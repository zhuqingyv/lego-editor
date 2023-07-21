export default [
  // 页面列表
  {
    key: 'pageList',
    type: 'get',
    router: 'get-page-list'
  },
  // 单个页面数据
  {
    key: 'page',
    type: 'get',
    router: 'get-page'
  },
  // 新增页面
  {
    key: 'addPage',
    type: 'get',
    router: 'add-page'
  },
  // 修改一个page
  {
    key: 'setPage',
    type: 'post',
    router: 'set-page'
  },
  // 删除一个页面
  {
    key: 'deletePage',
    type: 'get',
    router: 'delete-page'
  },
  // 获取组件库
  {
    key: 'getComponents',
    type: 'get',
    router: 'get-components'
  }
];