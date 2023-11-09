// 方向一手动开无头像61
const axios = require('axios');
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false // 设置为 false 表示不验证证书
});

const viewProtocol = `N4IglgJiBcIOwCMBmBDADEgjADgLTZQBZNdMJCA2XJAVltyLsIE44BmCAYwCYaQAaEBADOAGxgBtUADsYIMZACmAJwHyYoBCk4BrAObKA9gFdpEAMKHRh1bADEaR0+xo1wzoumKA8gAcALmCGstCgxsKKMKiiEQC+sYKckjJy7p6RgsIaINIoALaRsIDv0YDJ8YCmioBc6oD2ZoCwKoAPnmoe0v4qABow/srGiomeLcoAmh1digkgSdBSOXLW/oGKuADukHqK/m7ZwibKHnIAFnO+wtAA9Ce+YJwowlu4wv4ogZwAdAAeYCiGe8F6wnvGz04hjy52UiggAE8Tpg0MQ0NwwGg2GhpABHJEjPKENAUVh7ABubGYiKcpKcyjQeggEEUxjUvlEKAhlmaRnEoRA1kMviiKBiPSEikZEJgaDG9whokKoF8hmEYECwWy/m5osEUqQ62gYsyYAAXtKQMsIP49jA2HAaII9oowHoDjBsJhuPFMk1DeFFABJMyKV68/nxBIpWAIYxzJWZbLaRUhUD+CG+Qo5P3rN3pAByxjyCBU5rGpsUBWyWl0BhMZks1lsIDsADE69xCIRuI0rDY5HYkN21KX9EZTBAvXkUKs5CAC6nsvi+d05IBpr0AzsqAZSNAAD6aiQwX8AGV9YVMBQxmDOFrNDYacoAEooCBgcIwbGCBCGCN5GDcChoXUG4bdQTG00YBwK0QBtO0HWgbEgwAXWDaZYDSLwNg5XJi2KcpqnqRo+jaX8BSafohmgTpujGCYphCTkX3mJYVjWZDQC2YwdmTA5/COU5zkua5bnuR5LjeD4vh+P4ASBEFfDBSFoVhGEESRFFlCbURlD0AocTxQliTJHTVM4MBfD0FB6WFFlOisbIuR5aBogiQQaWFUVxQTKVslleVY2VVVtXVRRNSc79DQAs1oAtECwPtLUnRdcV3WyT0fRpf0bL5OJXRDEAwwjWQow5GMgjjEAEyTOQvFedYCxtNDNG0fsKwsdsa3rRtm1bRJGs7bskF7Wry0HYdR2TCdBBacrp1nZNV0AYf1ADZTQBoOQ3Lddx/aADyPRQTxLc8VGvW970gr9Muo4F30/QK8P/SBANW7BwttSKHzFeJYJe2IgA=`
const dslId = 87;

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

