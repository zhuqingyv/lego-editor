// const apiUrl = 'https://code.devops.xiaohongshu.com/api/v4';
const projectId = '32879'; // 替换为你的项目ID
// const repositoryId = '456'; // 替换为你的仓库ID
// const filePath = 'data.json'; // 替换为你的JSON文件路径
// const accessToken = 'pBswwqes3n2eomCVbsU_';
// const branch = 'feat-base';

const axios = require('axios');
const fileList = [];

// GitLab API的基本URL
const baseURL = 'https://gitlab.example.com/api/v4';

// 获取指定仓库下指定分支的文件树结构
async function getTree(projectId, branch) {
  const url = `${baseURL}/projects/${projectId}/repository/tree?ref=${branch}&recursive=true`;
  const response = await axios.get(url);
  return response.data;
}

// 获取文件内容
async function getFileContent(projectId, branch, filePath) {
  const url = `${baseURL}/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}/raw?ref=${branch}`;
  const response = await axios.get(url);
  return response.data;
}

// 递归地读取文件树并输出树形结构
async function printFileTree(projectId, branch, path = '', indent = '') {
  const tree = await getTree(projectId, branch);
  for (const item of tree) {
    const itemType = item.type === 'blob' ? '文件' : '文件夹';
    console.log(`${indent}${itemType}: ${item.name}`);
    if (item.type === 'blob') {
      const filePath = `${path}${item.name}`;
      const content = await getFileContent(projectId, branch, filePath);
      console.log(`${indent}内容: ${content}`);
      console.log(`${indent}路径: ${filePath}`);
    } else {
      await printFileTree(projectId, branch, `${path}${item.name}/`, `${indent}  `);
    }
  }
}

// 执行函数，传入仓库ID、分支名称以及可选的根路径
printFileTree('32879', 'feat-base', '/components/');