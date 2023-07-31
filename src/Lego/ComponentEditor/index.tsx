// @ts-ignore
import { useSignal } from 'react-use-signal';
import DragMoveContainer from '../base/DragMoveContainer';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './common';
import JsxEditor from './jsxEditor';
import CssEditor from './cssEditor';
import SchemaEditor from './schemaEditor';

const ComponentEditor = () => {
  const [isDev] = useSignal('app', 'isDev');
  const [currentMaterial, setCurrentMaterial] = useSignal('app', 'currentMaterial');

  const onChange = (event: { type: string, value: string }) => {
    const { type, value } = event;
    console.log({ type, value });
  };

  const onClose = () => {
    setCurrentMaterial(null);
  };

  if (!isDev || !currentMaterial) return null;

  return (
    <DragMoveContainer show={true} title="组件编辑" onClose={onClose}>
      <Tabs style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <TabList>
          <Tab>index.jsx</Tab>
          <Tab>style.css</Tab>
          <Tab>schema.json</Tab>
        </TabList>
        <TabPanel style={{ flex: 1, overflow: 'scroll' }}>
          <JsxEditor onChange={onChange} currentMaterial={currentMaterial} />
        </TabPanel>
        <TabPanel style={{  flex: 1, overflow: 'scroll' }}>
          <CssEditor onChange={onChange} currentMaterial={currentMaterial} />
        </TabPanel>
        <TabPanel style={{  flex: 1, overflow: 'scroll' }}>
          <SchemaEditor onChange={onChange} currentMaterial={currentMaterial} />
        </TabPanel>
      </Tabs>
    </DragMoveContainer>
  )
};

export default ComponentEditor;