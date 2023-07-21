import JsonServiceEditorCore from 'json-service-editor';

const serviceSDK = new JsonServiceEditorCore({
  baseUrl: 'http://localhost:5711',
  fileName: 'data.json'
});

export const { getValue, setValue } = serviceSDK;

