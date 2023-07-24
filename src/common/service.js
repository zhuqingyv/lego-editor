import HttpGitLabService from '../HttpGitLabService';
import { safeParse } from 'lib';
import uuid from 'react-uuid';

// const apiUrl = 'https://code.devops.xiaohongshu.com/api/v4';
// const projectId = '32879'; // 替换为你的项目ID
// const filePath = 'data.json'; // 替换为你的JSON文件路径
// const accessToken = 'ifQP5tyyi2DYvVfVhsq-';
// const branch = 'feat-base';

const gitLabService = new HttpGitLabService({
  apiUrl:  'https://code.devops.xiaohongshu.com/api/v4',
  projectId: '32879',
  accessToken: 'ifQP5tyyi2DYvVfVhsq-',
  branch: 'feat-base'
});

const config = {
  // 获取所有页面
  'pageList': async(isDev = false) => {
    const path = isDev ? 'src-dev/pages' : 'src/pages';
    const pageList = await gitLabService.reduceFolderFile(path);
    return pageList.map((page) => {
      const { contentValue } = page;
      return safeParse(contentValue, []);
    });
  },

  // 添加页面
  'createPage': async(name = '页面名称', isDev = false) => {
    const basePath = isDev ? 'src-dev/pages' : 'src/pages';
    const id = uuid();
    const page = {
      id,
      name,
      dsl: [],
      rnVersion: 'dev',
      icon: 'https://picasso-static.xiaohongshu.com/fe-platform/a91e4d0f2e1701115bd59839b5b634cd4f3ea3cc.png',
      status: -1
    };
    return gitLabService
      .createJsonFile(`${basePath}/${id}.json`, JSON.stringify(page, null, 2))
      .then((res) => res);
  },

  // 获取页面信息
  'pageInfo': async (id, isDev = false) => {
    const path = isDev ? 'src-dev/pages' : 'src/pages';
    return gitLabService.readFile(`${path}/${id}.json`);
  },

  // 修改页面信息
  'setPage': async (page, isDev = false) => {
    const { id, name, dsl, rnVersion, icon, status } = page;
    const path = isDev ? 'src-dev/pages' : 'src/pages';
    return gitLabService.writeFile(`${path}/${id}.json`, JSON.stringify({ id, name, dsl, rnVersion, icon, status }));
  },

  // 获取组件
  'components': async(callback = () => null, isDev = false) => {
    const path = isDev ? 'src-dev/components' : 'src/components';
    return gitLabService.reduceFolderFile(path, callback);
  },
};


export default (key, ...arg) => {
  const fetchItem = config[key];
  if (fetchItem) return fetchItem(...arg);
};