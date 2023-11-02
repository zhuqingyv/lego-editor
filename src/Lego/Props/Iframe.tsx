import { useEffect, useRef } from "react";

const IframeContainer = ({ src, schema, onFinish, onChange, value }) => {
  const iframeElement = () => {
    return document.querySelector("#x-render-iframe");
  };

  const onMessage = ({ data: event }) => {
    const { from, data = {} } = event || {};
    if (from === "x-render-iframe") {
      const { type } = data;

      switch (type) {
        case "onChange": {
          onChange(data.data);
          break;
        }
        case "onFinish": {
          onFinish(data.data);
          break;
        }
      }
    }
  };

  const iframe = iframeElement();
  if (iframe?.contentWindow && Object.keys(schema)?.length) {
    iframe.contentWindow.postMessage(
      {
        from: "lego-editor",
        data: {
          schema,
          value,
        },
      },
      "*"
    );
  }
  window.onmessage = onMessage;

  const link = `${src}?time=${Date.now()}`;

  console.clear();
  console.log(link);

  return (
    <iframe
      src={link}
      id="x-render-iframe"
      style={{
        display: "flex",
        border: "none",
        height: "100%",
        width: "100%",
      }}
    />
  );
};

export default IframeContainer;
