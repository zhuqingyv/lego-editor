// 方向二自动开
const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false // 设置为 false 表示不验证证书
});

const viewProtocol = "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="

const edit = () => {
  axios
    .put('https://hawkeye-cwj.devops.sl.beta.xiaohongshu.com/api/marketing/container_render_rule', {
      rule: {
        id: 74,
        name: '给文杰',
        viewProtocol
      }
    }, { httpsAgent: agent })
    .then((res = {}) => {
      debugger;
      const { data = {} } = res;
      const { success } = data;
      if (success) console.log('编辑盒子【自动开】成功!');
    })
    .catch((error) => {
      debugger;
      console.log('编辑盒子【自动开】失败!', error);
    });
};

edit();

