import HttpGitLabService from '../HttpGitLabService';
import { safeParse } from 'lib';
import uuid from 'react-uuid';

export const accessToken = 'ifQP5tyyi2DYvVfVhsq-';
export const projectId = '32879';
export const branch = 'feat-base';

const gitLabService = new HttpGitLabService({
  apiUrl:  'https://code.devops.xiaohongshu.com/api/v4',
  projectId,
  accessToken,
  branch
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

  // 设置组件
  'setComponent': async({ name, type, value, isDev } = {}) => {
    const path = isDev ? 'src-dev/components' : 'src/components';
  }
};


export default (key, ...arg) => {
  const fetchItem = config[key];
  if (fetchItem) return fetchItem(...arg);
};