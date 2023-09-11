// 方向一手动开无头像61
const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false // 设置为 false 表示不验证证书
});

const viewProtocol = "N4IglgJiBcIOwGYBGcBsBGAZgQwLToCYI8ICAWAVlwtUyoIFNN0yBOADgNSIpABoQEAM4AbGAG1QAOxghRkBgCd+cmKCTYAxgGsA5ooD2AVykQAwgZEHlsAMQAGR0/b2QAXwGaJ02UM0MpBhUhNRApbABbINhAd+jAZPjAU0VALnVAezNAWBVAB88VfykAFyUADRhcxSMGTwD8xQBNYtKGDxAvaEkw2UsIXCQDAA9g0Pye3NlABtNAEb9AN7l3NwBdWfmgA=";

const edit = () => {
  axios
    .put('https://hawkeye.devops.xiaohongshu.com/api/marketing/container_render_rule', {
      rule: {
        id: 61,
        name: '给文杰',
        viewProtocol
      }
    }, { httpsAgent: agent })
    .then((res = {}) => {
      debugger;
      const { data = {} } = res;
      const { success } = data;
      if (success) console.log('编辑盒子【手动开】成功!');
    })
    .catch((error) => {
      debugger;
      console.log('编辑盒子【手动开】失败!', error);
    });
};

edit();

