// @ts-ignore
import { creator } from 'creator';
import schema from './schema';
import View from './index';

creator.create({
  name: 'button',
  icon: 'https://picasso-static.xiaohongshu.com/fe-platform/77231a722df4e2bb5254ea5c1aae6487fbce0904.png',
  schema,
  editorView: () => View,
  view: () => View,
});