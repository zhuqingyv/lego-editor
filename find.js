const axios = require('axios');
// const dsl = require('./dsl.json');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false // 设置为 false 表示不验证证书
});


const findBox = () => {
  axios
    .get(`https://hawkeye-cwj.devops.sl.beta.xiaohongshu.com/api/marketing/container_render_rule/58`, { httpsAgent: agent })
    .then((res = {}) => {
      debugger;
      const { data = {} } = res;
      const { success } = data;
      if (success) console.log('查找盒子成功!');
    })
    .catch((error) => {
      debugger;
      console.log('查找盒子失败!', error);
    });
};

findBox();

