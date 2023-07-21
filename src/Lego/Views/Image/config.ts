// @ts-ignore
import { creator } from 'creator';
import schema from './schema';
import View from './index';

creator.create({
  name: 'image',
  icon: 'https://picasso-static.xiaohongshu.com/fe-platform/08e6889ea8d8427752addc3399226edc97ab5d46.png',
  schema,
  editorView: () => View,
  view: () => View,
});