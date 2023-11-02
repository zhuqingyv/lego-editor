// 方向一手动开无头像61
const axios = require('axios');
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false // 设置为 false 表示不验证证书
});

const viewProtocol = `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`;
const dslId = 81;

const edit = () => {
  axios
    .put('https://hawkeye.devops.xiaohongshu.com/api/marketing/container_render_rule', {
      rule: {
        id: dslId,
        name: '',
        viewProtocol
      }
    }, { httpsAgent: agent })
    .then((res = {}) => {
      const { data = {} } = res;
      const { success } = data;
      if (success) console.log(`更新盒子${dslId}成功!`);
    })
    .catch((error) => {
      console.log(`更新盒子${dslId}失败!`, error);
    });
};

edit();

