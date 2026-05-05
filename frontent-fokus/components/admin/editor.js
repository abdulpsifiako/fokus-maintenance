"use client";

import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";
import hljs from 'highlight.js';

const Editor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const quillInstanceRef = useRef(null);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      if (quillInstanceRef.current) return;

      const initQuill = async () => {
        const Quill = (await import("quill")).default;
        let Size = Quill.import("formats/size");

        // 2. Ganti daftar ukuran font yang diizinkan
        Size.whitelist = ["small", "medium", "large", "huge",false];
        Quill.register(Size, true);

        const container = containerRef.current;
        container.innerHTML = "";

        const editorContainer = document.createElement("div");
        container.appendChild(editorContainer);

        const quill = new Quill(editorContainer, {
          modules: {
            syntax: { hljs },
            toolbar: [
              [{font:[]}],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ size: Size.whitelist }], 
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
              [{ script: "super" }, { script: "sub" }, { direction: "rtl" }],
              [{ align: [] }, { color: [] }, { background: [] }],
              [ "link","image", "video"],
              ["blockquote", "code-block"],
              ["formula", "clean"],
            ],
          },
          placeholder: "Tulis sesuatu...",
          theme: "snow",
        });

        quill.enable(!readOnly);

        quillInstanceRef.current = quill;
        if (ref) ref.current = quill;

        if (defaultValueRef.current) {
          quill.root.innerHTML = defaultValueRef.current;
        }

        quill.on("text-change", () => {
          const html = quill.root.innerHTML;
          onTextChangeRef.current?.(html);
        });

        quill.on("selection-change", (...args) => {
          onSelectionChangeRef.current?.(...args);
        });
      };

      initQuill();
      const container = containerRef.current;

      return () => {
        if (ref) ref.current = null;
        quillInstanceRef.current = null;
        if (container) container.innerHTML = "";
      };
    }, [ref, readOnly]);
    return (
      <>
        <div id="editor-container" ref={containerRef}></div>
      </>
    );
  }
);

Editor.displayName = "Editor";

export default Editor;
