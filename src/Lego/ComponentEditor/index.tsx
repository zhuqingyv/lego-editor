import { useSignal } from 'react-use-signal';
import DragMoveContainer from '../base/DragMoveContainer';
import './common';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import JsxEditor from './jsxEditor';
import CssEditor from './cssEditor';
import SchemaEditor from './schemaEditor';

const ComponentEditor = () => {
  const [isDev] = useSignal('app', 'isDev');
  const [currentMaterial] = useSignal('app', 'currentMaterial');

  const onChange = (event: { type: string, value: string }) => {
    const { type, value } = event;
    console.log({ type, value });
  };

  if (!isDev || !currentMaterial) return null;

  return (
    <DragMoveContainer show={true} title="组件编辑">
      <Tabs style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <TabList>
          <Tab>index.jsx</Tab>
          <Tab>style.css</Tab>
          <Tab>schema.json</Tab>
        </TabList>
        <TabPanel style={{ flex: 1, overflow: 'scroll' }}>
          <JsxEditor onChange={onChange} />
        </TabPanel>
        <TabPanel style={{  flex: 1, overflow: 'scroll' }}>
          <CssEditor onChange={onChange} />
        </TabPanel>
        <TabPanel style={{  flex: 1, overflow: 'scroll' }}>
          <SchemaEditor onChange={onChange} />
        </TabPanel>
      </Tabs>
    </DragMoveContainer>
  )
};

export default ComponentEditor;