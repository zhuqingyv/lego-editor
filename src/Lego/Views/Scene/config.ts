// @ts-ignore
import { creator } from 'creator';
import schema from './schema';
import View from './index';

creator.create({
  name: 'scene',
  icon: 'https://picasso-static.xiaohongshu.com/fe-platform/87356b9b67048aeb986b43eb8460d7f35c561eff.png',
  schema,
  editorView: () => View,
  view: () => View,
  children: []
});