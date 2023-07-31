import axios from 'axios';

function decodeBase64String(base64String) {
  const binaryString = window.atob(base64String);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const decoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}

class HttpGitLabService {
  constructor(options = {}) {
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
  readFile = async (filePath, callback = () => null) => {
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
  writeFile = async (filePath, fileString) => {
    const { apiUrl, projectId, branch, accessToken } = this;
    await axios.put(`${apiUrl}/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`, {
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
  reduceFolderFile = async (path = '', callback = () => null) => {
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
          const result = [];
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