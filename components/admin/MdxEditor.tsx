'use client';

import type { ForwardedRef } from 'react';
import React, { useState, useEffect } from 'react';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  CodeToggle,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  InsertImage,
  InsertTable,
} from '@mdxeditor/editor';
import { gitprofileConfig } from '../../gitprofile.config';


// This is the only place InitializedMDXEditor is used
function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Function to check and apply theme
    const checkTheme = () => {
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDark(isDarkMode);
    };

    // Initial check
    checkTheme();

    // Set up a MutationObserver to watch for changes in the data-theme attribute
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Clean up the observer on component unmount
    return () => observer.disconnect();
  }, []);

  const handleImageUpload = (image: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", gitprofileConfig.cloudinary.uploadPreset);
      data.append("cloud_name", gitprofileConfig.cloudinary.cloudName);

      fetch(`https://api.cloudinary.com/v1_1/${gitprofileConfig.cloudinary.cloudName}/image/upload`, {
        method: "post",
        body: data
      })
      .then(resp => resp.json())
      .then(data => {
        if (data.url) {
          resolve(data.url);
        } else {
          console.error("Cloudinary upload error:", data);
          reject(new Error('Upload failed. Response did not contain URL.'));
        }
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  };

  return (
    <MDXEditor
      className={isDark ? 'dark-theme' : ''}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        imagePlugin({
          imageUploadHandler: handleImageUpload
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <ListsToggle />
              <BlockTypeSelect />
              <CreateLink />
              <InsertImage />
              <InsertTable />
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}

export default InitializedMDXEditor;
