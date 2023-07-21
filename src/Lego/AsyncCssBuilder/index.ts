const AsyncCssBuilder = (cssString: string | string[] = '') => {
  const cssBuilder = (css: string) => {
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