const scriptLoader = async(url = '') => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute('crossorigin', true);
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export default scriptLoader;