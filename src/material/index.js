import { creator } from 'creator';

const material = Array.from(creator.components).reduce((pre, cur) => {
  const [key, component] = cur;
  pre[key] = component;
  return pre;
}, {});

export default material;