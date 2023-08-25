import jsZip from './jsZip';

interface StoreType {
  cache: Map<string,string>;
  add: (path: string) => void;
  find: (path: string) => any;
}

const store:StoreType = {
  cache: new Map([['https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js', jsZip]]),
  add(path: string) {
    if (!this.find(path)) this.cache.get(path);
  },
  find(path: string) {
    return this.cache.get(path);
  }
}

const buildScript = (url: string, resolve?: any, reject?: any) => {
  const script = document.createElement('script');
  script.setAttribute('id', url);
  script.setAttribute('crossorigin', 'true');
  script.onload = resolve || (() => null);
  script.onerror = reject || (() => null);
  document.body.appendChild(script);
  return script;
};

const scriptLoader = async(url: string = '', type?: string) => {
  // 存在DOM直接返回
  if (document.getElementById(url)) return Promise.resolve();

  // 存在code记录
  const has = store.find(url);
  if (has) {
    return new Promise((resolve, reject) => {
      const script = buildScript(url, resolve, reject);
      script.setAttribute('src', has);
    });
  };
  store.add(url);
  return new Promise((resolve, reject) => {
    const script = buildScript(url, resolve, reject)
    script.src = url;
    if (type) script.setAttribute('type', type);
  });
};

export default scriptLoader;