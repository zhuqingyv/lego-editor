import './Views';
import './HotKey';
import HeaderView from './Header';
import Editor from './Editor/index';
import ComponentStore from './ComponentStore';
import Props from './Props';
import Tree from './Tree';
import { createSignal } from 'react-use-signal';
import { ToastContainer } from 'react-toast'
import material from './material';
import './App.css';

const App = () => {
  const [state] = createSignal('app', { currentComponent: null, dsl: [], material });
  window.state = state;
  return (
    <>
      <HeaderView />
      <div className='container'>
        <ComponentStore>
          <Tree />
        </ComponentStore>
        <Editor />
        <Props />
      </div>
      <ToastContainer position='bottom-center' />
    </>
  );
};

export default App;