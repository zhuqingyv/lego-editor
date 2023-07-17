import { creator } from 'creator';
import schema from './schema';
import View from './index';

creator.create({
  name: 'lottie',
  icon: 'https://picasso-static.xiaohongshu.com/fe-platform/7fc4e136baf4bc609c53daee846f11df3f087c17.png',
  schema,
  editorView: () => View,
  view: () => View,
  defaultValue: {
    source: 'https://lottie.host/f4642d11-5e62-4957-aac8-ca0f76c6b280/VPvpGjSxsJ.json',
    position: {
      top: 0,
      left: 0
    }
  }
});