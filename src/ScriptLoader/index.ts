interface StoreType {
  cache: string[];
  add: (path: string) => void;
  find: (path: string) => boolean;
}

const store:StoreType = {
  cache: [],
  add(path: string) {
    if (!this.find(path)) this.cache.push(path);
  },
  find(path: string) {
    return this.cache.includes(path);
  }
}

const scriptLoader = async(url: string = '', type?: string) => {
  if (store.find(url)) return Promise.resolve();
  store.add(url);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute('crossorigin', 'true');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    if (type) script.setAttribute('type', type);
    document.body.appendChild(script);
  });
};

export default scriptLoader;