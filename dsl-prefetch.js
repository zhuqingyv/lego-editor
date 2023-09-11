// 方向一手动开无头像61
const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false // 设置为 false 表示不验证证书
});

const viewProtocol = "N4IglgJiBcIExwMyIIYFYVwLQAYCMcEWARsQBwBsWAnACwQCmWeaA7DqxYq63A1ABoQEAM4AbGAG1QAOxghxkBgCcQQkTFDEUAYwDWAc2UB7AK4yIAYWNjjq2AGIczl2RwgAvkJ1TZ8kToMMgxqCpogMigAtiGwgO/RgMnxgKaKgFzqgPZmgLAqgA+eoYEyAC4qABow+cqmDN5BhcoAmqXlDF4gPtDSEfIADsoMAGYM+ToAFqEa0KAonWDyAPSTYDNRKMp6A2AyBjMMAB4MOqb5YMYyAPoiZSiFBgCeM8A7ewdHMgCSEB6h2iIMAKoASgAZeRDfL5TrQGZbCBgfJDAB02zAKGMQ2OBhEQ1McJ0xiioXy106sRABgGoU6y2iY3aBKJ/jK6wMoQAbigxBVwr0THjYKZlBJ1PlLmAdAA1Nkc2ChLm4gDSDGu8ge+0OxzeniEq0VsGVTzVUA8AF0PF4/LBiAd8sdRuFdKq5OMQLTicFtvkNU6hgwYuFtPojGYLNZbPYQA4AGLhuC0WhwXI2OzyBy9FOfXSGEzmCAvJak+Qewpu8Ks9nEwDTXoBnZUAykaAAH1pcd8gBlMAAL1ieAozR6OndjuIdkYyj+KGhpjGtBwQn7oNxMDgFEnClbsV6bO+JtNHVgONMnWOWGCAHcbY7nfJiH07CEp+mA1mcyg87AQWCRBCZlMdCgRCJjFhzsKOgIkiKJohiWI4lEMz9FgnRiJcvR2FBOisPwFCsIgDA4GQDDodoZDUGQKDUMQaB7BAKAMDGvS0Lw1D9BQhA4HCnQbKESzKAY6wAELGDOPI4CaxoCGaIAqCYyiwY+15hI6YC5sSL6dG+kIAI7yQYwHIqiGzgdiuIzMy6x5PkWAjlE6wzHAZDEL0xDsDgyBwGw1A4GgcAXjGEDOGgOAQDoiBoGQtA6GgGAoZhHqtO0DogBaM5yOoto9s84RntutjfAWXo+n2t6ZkGCahsmvQuC48YhkmKa9Gm/oFdmCnAqCynvp+36/v+QqHEBiLaWBmL6VBMFwQhSFbI5OD8NQ3CBNQ1BoBAFAUKFOC9HgvTUBQECkCOHA4DovTICgiDMaxTLNIWvagCWkogPWBTNm2MCCUI3ZXXFA4qMOo5jBQU58VaPJ4NQeDqMuDQVEIh6QLCMAnUIXpgAYIJw4JQlGhjQA===";

const edit = () => {
  axios
    .put('https://hawkeye.devops.xiaohongshu.com/api/marketing/container_render_rule', {
      rule: {
        id: 67,
        name: '测试Prefetch',
        viewProtocol
      }
    }, { httpsAgent: agent })
    .then((res = {}) => {
      const { data = {} } = res;
      const { success } = data;
      if (success) console.log('测试盒子67成功!');
    })
    .catch((error) => {
      console.log('测试盒子67失败!', error);
    });
};

edit();

