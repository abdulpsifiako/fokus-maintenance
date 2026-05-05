import { useEffect, useRef } from "react";
import hljs from "highlight.js";

import "highlight.js/styles/atom-one-dark.css";

function Preview({ html }) {
  const previewRef = useRef(null);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightAuto(block);
      });
    }
  }, [html]);

  return (
    <div
      ref={previewRef}
      className="ql-editor"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default Preview;