import { creator } from 'creator';
import schema from './schema';
import View from './index';

creator.create({
  name: 'mask',
  icon: 'https://picasso-static.xiaohongshu.com/fe-platform/e0790cf4b455eb9e243e01e8f96b3b07cf7aca0e.png',
  schema,
  editorView: () => View,
  view: () => View,
  defaultValue: {
    backgroundColor: '#00000080'
  }
});