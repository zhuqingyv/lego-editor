// 方向一手动开56
const axios = require('axios');
const dsl = require('./dsl.json');

const viewProtocol = "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";

const edit = () => {
  axios
    .put('https://hawkeye.devops.beta.xiaohongshu.com/api/marketing/container_render_rule', {
      rule: {
        id: 72,
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

