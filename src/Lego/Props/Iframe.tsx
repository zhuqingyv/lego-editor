import { useEffect, useRef } from "react";

const IframeContainer = ({ src, schema, onFinish, onChange, value, id }) => {
  const iframeElement = () => {
    return document.querySelector("#x-render-iframe");
  };

  const onMessage = ({ data: event }) => {
    const { from, data = {} } = event || {};

    if (from === "x-render-iframe") {
      const { type, id: messageId } = data;
      if (messageId !== id) return;

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
          id
        },
      },
      "*"
    );
  }
  window.onmessage = onMessage;

  const link = `${src}?time=${Date.now()}`;

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
