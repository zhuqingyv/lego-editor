// 方向一手动开无头像61
const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false // 设置为 false 表示不验证证书
});

const viewProtocol = "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";
// 原先73
const id = 84;
const edit = () => {
  axios
    .put('https://hawkeye.devops.xiaohongshu.com/api/marketing/container_render_rule', {
      rule: {
        id,
        name: '',
        viewProtocol
      }
    }, { httpsAgent: agent })
    .then((res = {}) => {
      const { data = {} } = res;
      const { success } = data;
      if (success) console.log(`编辑盒子【手动开无头像 - ${id}】成功!`);
    })
    .catch((error) => {
      console.log(`编辑盒子【手动开无头像 - ${id}】失败!`, error);
    });
};

edit();

