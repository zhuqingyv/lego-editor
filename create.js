const axios = require('axios');
const dsl = require('./dsl.json');

const edit = () => {
  axios
    .post('https://hawkeye.devops.xiaohongshu.com/api/marketing/container_render_rule', {
      rule: {
        name: '给文杰',
        viewProtocol: dsl
      }
    })
    .then((res = {}) => {
      debugger;
      const { data = {}, success } = res.data;
      const { containerRenderRule = {} } = data;
      const { id } = containerRenderRule;
      if (success) console.log('新怎盒子成功!', id);
    })
    .catch((error) => {
      debugger;
      console.log('编辑盒子【手动开】失败!', error);
    });
};

edit();

