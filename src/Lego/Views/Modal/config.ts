// @ts-ignore
import { creator } from 'creator';
import schema from './schema';
import View from './index';

creator.create({
  name: 'modal',
  icon: 'https://picasso-static.xiaohongshu.com/fe-platform/f8210c606c2d221668cb2974c0e721006d34e333.png',
  schema,
  editorView: () => View,
  view: () => View,
});