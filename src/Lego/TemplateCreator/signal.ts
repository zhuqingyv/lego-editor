// @ts-ignore
import { createSignal } from 'react-use-signal';

const [_, setState] = createSignal('template-creator', {
  dsl: [],
  icon: '',
  name: '',
  show: false
}, 'key', false);