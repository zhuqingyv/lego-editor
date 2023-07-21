class Http {
  map = new Map();

  constructor({ baseUrl = '' } = {}) {
    this.baseUrl = baseUrl;
  };

  get = (router = '', params = {}) => {
    const getUrl = () => {
      return Object.keys(params).reduce((pre, key) => {
        const value = params[key];
        return `${pre}${key}=${value}&`;
      }, `${this.baseUrl}/${router}?`);
    };

    const url = getUrl();
    return fetch(url, {
      method: 'GET',
    }).then(async(res) => await res.json());
  };

  post = (router = '', params = {}) => {
    return fetch(`${this.baseUrl}/${router}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(async(res) => await res.json());
  };

  use = ({ key, type, router }) => {
    this.map.set(key, { type, router });
  };

  fetch = (key, params = {}) => {
    const fetchItem = this.map.get(key);
    if (fetchItem) {
      const { type, router } = fetchItem;
      return this[type](router, params)
    };
  };
};

export default Http;