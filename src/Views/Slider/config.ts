import { creator } from 'creator';
import schema from './schema';
import View from './index';

creator.create({
  name: 'slider',
  icon: 'https://picasso-static.xiaohongshu.com/fe-platform/50d996744263c647a0973670eeaeb7a1404349dd.png',
  schema,
  editorView: () => View,
  view: () => View,
  defaultValue: {},
  children: []
});