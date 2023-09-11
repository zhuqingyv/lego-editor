// 方向一手动开56
const axios = require('axios');
const dsl = require('./dsl.json');

const viewProtocol = "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=";

const edit = () => {
  axios
    .put('https://hawkeye.devops.beta.xiaohongshu.com/api/marketing/container_render_rule', {
      rule: {
        id: 56,
        name: '给文杰',
        viewProtocol
      }
    })
    .then((res = {}) => {
      const { data = {} } = res;
      const { success } = data;
      if (success) console.log('编辑盒子【手动开】成功!');
    })
    .catch((error) => {
      console.log('编辑盒子【手动开】失败!', error);
    });
};

edit();

