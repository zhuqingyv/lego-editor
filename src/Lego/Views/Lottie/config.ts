// @ts-ignore
import { creator } from 'creator';
import schema from './schema';
import View from './index';

creator.create({
  name: 'lottie',
  icon: 'https://picasso-static.xiaohongshu.com/fe-platform/7fc4e136baf4bc609c53daee846f11df3f087c17.png',
  schema,
  editorView: () => View,
  view: () => View,
});