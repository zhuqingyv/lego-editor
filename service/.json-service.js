const { v4: uuid } = require('uuid');

module.exports = () => {
  const url = 'data.json';
  const port = 5711;

  return {
    url,
    port,
    service: {
      // 获取页面列表
      '/get-page-list': {
        methods: 'get',
        handle: ({ json, res }) => {
          res.status(200).json(json);
        }
      },
      // 根据ID获取页面信息
      '/get-page': {
        methods: 'get',
        handle: ({ json, params = {}, res, req }) => {
          const { pages = [] } = json;
          const { id } = params;

          const page = pages.find((page) => page?.id === id) || null;
          res.status(200).json(page)
        }
      },
      // 修改某一个页面
      '/set-page': {
        methods: 'post',
        handle: ({ json, params = {}, res, req, updateJson }) => {
          const { pages = [] } = json;
          const { page = {} } = params;

          const hasChange = pages.find((p, i) => {
            const isCurrent = p.id === page.id;

            if (isCurrent) {
              Object.assign(p, { ...page });
              return true;
            };
          });

          if (hasChange) {
            updateJson(json);
            return res.status(200).json(page);
          }

          return res.status(400).json(page);
        }
      },
      // 新增一个页面
      '/add-page': {
        methods: 'get',
        handle: ({ json, params = {}, res, req, updateJson }) => {
          const page = {
            id: uuid(),
            name: '页面名称',
            dsl: [],
            ...params
          };
          json.pages.push(page);
          res.status(200).json(updateJson(json));
        }
      },
      // 删除一个页面
      '/delete-page': {
        methods: 'get',
        handle: ({ json, params = {}, res, req, updateJson }) => {
          const { pages = [] } = json;
          const { id } = params;

          const hasChange = pages.find((p, i) => {
            const isCurrent = p.id === id;

            if (isCurrent) {
              pages.splice(i, 1);
              return true;
            };
          });

          if (hasChange) {
            updateJson(json);
            return res.status(200).json(json);
          }

          return res.status(400).json(page);
        }
      },
      '/get-components': {
        methods: 'get',
        handle: ({ json, res }) => {
          res.status(200).json(json?.components || []);
        }
      }
    }
  };
};