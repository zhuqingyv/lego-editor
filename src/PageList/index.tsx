// @ts-ignore
import { createSignal } from 'react-use-signal';
import HeaderView from './Header';
import List from './List';
// @ts-ignore
import service from '@service';

const PageList = () => {
  // 初始化数据
  const [_, setState] = createSignal('pageList', () => {
    service('pageList').then((pages: any[]) => {
      setState({
        pages
      });
    })
    return {
      pages: [],
      components: []
    }
  });

  return (
    <div>
      <HeaderView />
      <List />
    </div>
  )
};

export default PageList;