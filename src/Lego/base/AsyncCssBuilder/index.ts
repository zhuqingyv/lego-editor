interface StoreType {
  cache: string[];
  add: (css: string) => void;
  find: (css: string) => boolean
}

const store:StoreType = {
  cache: [],
  add(css: string) {
    if (!this.find(css)) this.cache.push(css);
  },
  find(css: string) {
    return this.cache.includes(css);
  }
};

const AsyncCssBuilder = (cssString: string | string[] = '') => {
  const cssBuilder = (css: string) => {
    // 查重
    if (store.find(css)) return;
    store.add(css);
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerText = css;
    document.head.appendChild(style);
  };

  if (typeof cssString === 'string') {
    cssBuilder(cssString);
    return;
  };

  if (cssString instanceof Array) {
    cssString.forEach((css) => cssBuilder(css));
    return;
  };
};

export default AsyncCssBuilder;