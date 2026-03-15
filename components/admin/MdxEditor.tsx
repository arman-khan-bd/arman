'use client';

import type { ForwardedRef } from 'react';
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
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {

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
