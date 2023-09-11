import axios from 'axios';
import './GitLabAPICache';

function decodeBase64String(base64String: string) {
  const binaryString = window.atob(base64String);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const decoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}

interface OptionsType {
  apiUrl: string;
  projectId: string;
  accessToken: string;
  branch: string;
};

const defaultOptions = {
  apiUrl: '',
  projectId: '',
  accessToken: '',
  branch: ''
};

class HttpGitLabService {
  apiUrl: string;
  projectId: string;
  accessToken: string;
  branch: string;

  constructor(options:OptionsType = defaultOptions) {
    const {
      apiUrl = 'https://code.devops.xiaohongshu.com/api/v4',
      projectId,
      accessToken,
      branch
    } = options;

    this.apiUrl = apiUrl;
    this.projectId = projectId;
    this.accessToken = accessToken;
    this.branch = branch;
  };

  // 读文件
  readFile = async (filePath: string, callback:any = () => null) => {
    const { apiUrl, projectId, accessToken, branch } = this;
    return axios.get(`${apiUrl}/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`, {
      headers: {
        'PRIVATE-TOKEN': accessToken
      },
      params: {
        ref: branch
      }
    })
      .then(async (response) => {
        callback({ type: '加载文件' });
        return decodeBase64String(response.data.content)
      })

  };

  // 写文件
  writeFile = async (filePath: string, fileString: string) => {
    const { apiUrl, projectId, branch, accessToken } = this;
    const fileOriginValue = await this.readFile(filePath);

    if (fileOriginValue === fileString) {
      return Promise.resolve({ code: -1, message: '文件未变更' });
    };
    return await axios.put(`${apiUrl}/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`, {
      branch,
      content: fileString,
      commit_message: `${new Date().toLocaleTimeString()}`
    }, {
      headers: {
        'PRIVATE-TOKEN': accessToken
      }
    });
  };

  // 删除文件
  deleteFile = async (filePath = '') => {
    const { apiUrl, projectId, accessToken, branch } = this;
    return axios({
      method: 'DELETE',
      url: `${apiUrl}/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`,
      headers: {
        'PRIVATE-TOKEN': accessToken
      },
      data: {
        branch,
        commit_message: 'Delete File'
      }
    })
  };

  // 获取文件夹下所有文件
  reduceFolderFile = async (path = '', callback:any = () => null) => {
    const { apiUrl, projectId, branch, accessToken } = this;
    return axios.get(`${apiUrl}/projects/${projectId}/repository/tree?path=${path}`, {
      headers: {
        'PRIVATE-TOKEN': accessToken
      },
      params: {
        ref: branch
      }
    })
      .then(async (response) => {
        return new Promise(async (resolve, reject) => {
          const fileList = response.data || [];
          const promiseAll = [];
          const result:any[] = [];
          let progress = 0;

          for (let i = 0; i < fileList?.length; i++) {
            const file = fileList[i]
            const { type, path, name } = file;

            // 如果是文件
            if (type === 'blob') {
              const promise = this.readFile(path);
              promise.finally(() => {
                progress += 1;
                callback({ type: '加载文件', progress, all: fileList.length });
              });
              promiseAll.push(promise)
              const contentValue = await promise;
              result.push({ path, name, type, contentValue });
              continue;
            };
            // 如果是文件夹
            if (type === 'tree') {
              const promise = this.reduceFolderFile(path);
              promise.finally(() => {
                progress += 1;
                callback({ type: '加载文件夹', progress, all: fileList.length });
              });
              promiseAll.push(promise);
              const children = await promise;
              result.push({ path, name, type, children });
              continue;
            };
          };

          Promise
            .all(promiseAll)
            .then(() => {
              resolve(result);
            })
            .catch((error) => reject(error));

        });
      })
  };

  // 获取文件夹下内容
  getFolderInfo = async (path = '', callback:any = () => null) => {
    const { apiUrl, projectId, branch, accessToken } = this;
    return axios.get(`${apiUrl}/projects/${projectId}/repository/tree?path=${path}`, {
      headers: {
        'PRIVATE-TOKEN': accessToken
      },
      params: {
        ref: branch
      }
    })
      .then(async (response) => {
        const fileList = response.data || [];
        if (callback) callback(fileList);
        return fileList;
      })
  };

  // 新增json文件
  createJsonFile = async (path = '', content = '') => {
    //`https://gitlab.com/api/v4/projects/${projectId}/repository/files`;
    const { apiUrl, projectId, branch, accessToken } = this;
    return axios.post(`${apiUrl}/projects/${projectId}/repository/files/${encodeURIComponent(path)}`, {
      branch,
      content,
      commit_message: 'Create file'
    },
      {
        headers: {
          'PRIVATE-TOKEN': accessToken
        }
      });
  };
};

export default HttpGitLabService;