import HttpGitLabService from '../HttpGitLabService';
// @ts-ignore
import { safeParse, zipDSL } from 'lib';
import uuid from 'react-uuid';
import axios from 'axios';
import {
  compressToBase64,
} from 'lz-string';

export const accessToken = 'ifQP5tyyi2DYvVfVhsq-';
export const projectId = '32879';
export const branch = 'feat-base';

const gitLabService = new HttpGitLabService({
  apiUrl: 'https://code.devops.xiaohongshu.com/api/v4',
  projectId,
  accessToken,
  branch
});

const config: any = {
  // 获取所有页面
  'pageList': async (isDev = false) => {
    const path = isDev ? 'src-dev/pages' : 'src/pages';
    const pageList = await gitLabService.reduceFolderFile(path);
    // @ts-ignore
    return pageList.map((page) => {
      const { contentValue } = page;
      return safeParse(contentValue, []);
    });
  },

  // 添加页面
  'createPage': async (name = '页面名称', isDev = false) => {
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

  // 删除页面
  'deletePage': async (id: string, isDev = false) => {
    const basePath = isDev ? 'src-dev/pages' : 'src/pages';
    return gitLabService
      .deleteFile(`${basePath}/${id}.json`)
  },

  // 获取页面信息
  'pageInfo': async (id: string, isDev = false) => {
    const path = isDev ? 'src-dev/pages' : 'src/pages';
    return gitLabService.readFile(`${path}/${id}.json`);
  },

  // 修改页面信息
  'setPage': async (page: any, isDev = false) => {
    const { id, name, dsl, rnVersion, icon, status } = page;
    const path = isDev ? 'src-dev/pages' : 'src/pages';
    return gitLabService.writeFile(`${path}/${id}.json`, JSON.stringify({ id, name, dsl, rnVersion, icon, status }));
  },

  // 获取组件
  'components': async (callback = () => null, isDev = false) => {
    const path = isDev ? 'src-dev/components' : 'src/components';
    return gitLabService.reduceFolderFile(path, callback);
  },

  // 获取组件列表
  'componentsList': async (callback = () => null, isDev = false) => {
    const path = isDev ? 'src-dev/components' : 'src/components';
    return gitLabService.getFolderInfo(path, callback);
  },

  // 增加一个组件
  'createComponent': async ({ name, value = [], isDev = false }: any = {}) => {
    const basePath = isDev ? 'src-dev/components' : 'src/components';

    const getFilePath = (type: string) => {
      if (type === 'jsx') return 'index.jsx';
      if (type === 'css') return 'style.css';
      if (type === 'schema') return 'schema.json';
    };

    await gitLabService
      .createJsonFile(`${basePath}/${name}/${getFilePath(value[0].type)}`, value[0].codeValue);
    await gitLabService
      .createJsonFile(`${basePath}/${name}/${getFilePath(value[1].type)}`, value[1].codeValue);
    await gitLabService
      .createJsonFile(`${basePath}/${name}/${getFilePath(value[2].type)}`, value[2].codeValue);
    return Promise.resolve();
  },

  // 设置组件
  'setComponent': async ({ name, value = [], isDev }: any = {}) => {
    const path = isDev ? 'src-dev/components' : 'src/components';
    // 没有更新序列直接返回(一般是前置检测文件未变更)
    if (!value.length) return Promise.resolve();

    const allPromise = value.map(({ type, codeValue }: { type: string, codeValue: string }) => {
      switch (type) {
        case 'jsx': {
          return gitLabService.writeFile(`${path}/${name}/index.jsx`, codeValue);
        }
        case 'css': {
          return gitLabService.writeFile(`${path}/${name}/style.css`, codeValue);
        }
        case 'schema': {
          return gitLabService.writeFile(`${path}/${name}/schema.json`, codeValue);
        }
      }
    });

    return Promise.allSettled(allPromise);
  },

  // 新增模版
  'createTemplate': async ({ isDev, name, dsl = [], icon = 'https://picasso-static.xiaohongshu.com/fe-platform/a91e4d0f2e1701115bd59839b5b634cd4f3ea3cc.png' }: any) => {
    const basePath = isDev ? 'src-dev/template' : 'src/template';
    const id = uuid();
    const template = {
      id,
      name,
      dsl,
      rnVersion: 'dev',
      icon,
      status: -1
    };
    return gitLabService
      .createJsonFile(`${basePath}/${id}.json`, JSON.stringify(template, null, 2))
      .then((res) => res);
  },

  // 删除模版
  'deleteTemplate': async ({ id, isDev }: any) => {
    const basePath = isDev ? 'src-dev/template' : 'src/template';
    return gitLabService.deleteFile(`${basePath}/${id}.json`)
  },

  // 所有的模版
  'allTemplate': async (callback = () => null, isDev = false) => {
    const path = isDev ? 'src-dev/template' : 'src/template';
    return gitLabService.reduceFolderFile(path, callback);
  },

  // 保存到服务器
  'saveOnLine': async (params: { id: string, dsl: any, name: string }) => {
    if (!params) return;

    const { id, name, dsl } = params;

    const zipNoId = (dsl: any = []) => {
      return dsl.map((item: any) => {
        const { n, s, c } = item;
        const _c = zipNoId(c);
        return {
          n,
          s,
          c: _c?.length ? _c : undefined
        }
      })
    };

    const newZipNameDsl = zipDSL(dsl, true);
    const newZipNameIdDsl = zipNoId(newZipNameDsl);
    const stringZipId = compressToBase64(JSON.stringify({ id, dsl: newZipNameIdDsl }));

    fetch('https://hawkeye.devops.beta.xiaohongshu.com/api/marketing/container_render_rule', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      mode: "cors",
      body: JSON.stringify({
        rule: {
          name,
          viewProtocol: stringZipId
        }
      })
    })
      // .then((res) => {
      //     debugger;
      //   alert('给文杰成功')
      // })
      // .catch((error) => {
      //   alert('给文杰失败')
      // })
  
    // axios.post('https://hawkeye.devops.beta.xiaohongshu.com/api/marketing/container_render_rule', {
    //   rule: {
    //     name,
    //     viewProtocol: stringZipId
    //   }
    // })
    //   .then((res) => {
    //       debugger;
    //     alert('给文杰成功')
    //   })
    //   .catch((error) => {
    //     alert('给文杰失败')
    //   })

    // 查
    // fetch('https://hawkeye.devops.beta.xiaohongshu.com/39', {
    //   method: 'GET',
    //   mode: "no-cors"
    // })
    //   .then((res) => {
    //     debugger;
    //   })
    //   .catch((error) => {
    //     debugger;
    //   });
  }
};


export default (key: string, ...arg: any[]) => {
  const fetchItem = config[key];
  if (fetchItem) return fetchItem(...arg);
};

// 合并分支
// const response = await axios.post(
//   'https://gitlab.example.com/api/v4/projects/:projectId/merge_requests',
//   {
//     source_branch: 'feat-version-1',
//     target_branch: 'feat-base',
//     squash: true
//   },
//   {
//     headers: {
//       'Private-Token': 'your-private-token'
//     }
//   }
// );
