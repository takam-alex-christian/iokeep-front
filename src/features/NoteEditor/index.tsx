"use client";

import { SetStateAction, useContext, useEffect, useRef, useState } from "react";

import { liveDataContext } from "@/contexts/liveDataContext";

//lexical imports
import {
  FORMAT_TEXT_COMMAND,
  CLEAR_EDITOR_COMMAND,
  CAN_UNDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  CLEAR_HISTORY_COMMAND,
} from "lexical";

import { $setBlocksType } from "@lexical/selection";

import { HeadingNode, $createHeadingNode } from "@lexical/rich-text";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";

import { createNote, updateNote, useNotes } from "@/lib/noteUtils";
import { useSelectedNote } from "./libs/customHooks";
import Share01Icon from "@/assets/share-01-stroke-rounded";
import { AnimatePresence, motion } from "framer-motion";
import Copy01Icon from "@/assets/copy-01-stroke-rounded";
import { NoteItemDataType } from "@/types";
import { useFolders } from "@/lib/folderUtils";
import CustomToolBar, { CustomEditorStateType } from "./components/ToolBar";

//sub-component import
import EditorLoadingOverlay from "@/features/NoteEditor/components/EditorLoadingOverlay";

const theme = {
  heading: {
    h1: "text-3xl font-medium my-2",
    h2: "text-2xl font-medium my-2",
    h3: "text-xl font-medium my-2",
  },
  paragraph: "my-2",
  text: {
    bold: "font-bold",
    // code: '',
    italic: "italic",
    // strikethrough: '',
    // subscript: '',
    // superscript: '',
    underline: "underline",
    // underlineStrikethrough: '',
  },
};

function onError(error: Error) {
  console.error(error);
}

// function AutoLoadSelectedNoteIntoEditor() {

//     const [editorState] = useLexicalComposerContext()

//     const { liveAppData } = useContext(liveDataContext)

//     const { isLoading, noteData } = useSelectedNote()

//     if (!isLoading && noteData != null) {
//         editorState.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
//         editorState.setEditorState(editorState.parseEditorState(noteData.editorState))
//     }

//     return null

// }

/**
 * custom lexical plugin that updates description
 * @return null
 */

function UpdateNoteDescription(props: {
  setCustomEditorState: React.Dispatch<SetStateAction<CustomEditorStateType>>;
}): null {
  const [editorState] = useLexicalComposerContext();

  editorState.registerTextContentListener((editorTextContent) => {
    //we can set the description of the current note on create

    const editorTextArray = editorTextContent.split("\n").filter((eachText) => {
      return eachText.length > 0;
    });

    props.setCustomEditorState((prevState) => {
      return { ...prevState, description: editorTextArray.slice(0, 2) };
    });
  });

  return null;
}

function AutoClearEditorOnDelete() {
  const { liveAppData } = useContext(liveDataContext);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!liveAppData.selectedNoteId) {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
    }
  }, [liveAppData.selectedNoteId]);

  return null;
}

function TextEditor(props: {
  editorState?: string;
  _id?: string;
  isPublic?: boolean;
  isEditable?: boolean;
}) {
  const [customEditorState, setCustomEditorState] =
    useState<CustomEditorStateType>({
      //used to ensure inter communication of data between my custom plugins
      description: [],
      isNoteDeleted: false,
    });

  const initialConfig = {
    editorState: props.editorState,
    editable: props.isEditable != undefined ? props.isEditable : true,
    namespace: "TextEditor",
    theme,
    onError,
    nodes: [HeadingNode],
  };

  return (
    <div className="custom-container rounded-3xl overflow-hidden flex flex-col flex-grow  ">
      {/* lexical editor */}
      <LexicalComposer initialConfig={initialConfig}>
        {props.isEditable && (
          <CustomToolBar
            _id={props._id}
            customEditorState={customEditorState}
          />
        )}
        <div className=" flex-grow flex overflow-y-auto  flex-col gap-0 shadow-sm rounded-xl">
          {/* <Divider orientation="horizontal" /> */}
          {/* <Divider orientation="horizontal" /> */}
          <div className=" relative flex flex-col flex-grow py-2 px-6">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className=" focus-within:outline-none flex-grow py-4" />
              }
              placeholder={
                <div className="absolute top-8 left-6 z-10 text-neutral-400">
                  Don&apos;t stop writing...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>

        {props.isEditable && (
          <>
            <HistoryPlugin />
            <UpdateNoteDescription
              setCustomEditorState={setCustomEditorState}
            />
            <ClearEditorPlugin />
            <AutoClearEditorOnDelete />
          </>
        )}
      </LexicalComposer>
    </div>
  );
}

function ReadOnlyEditor(props: NoteItemDataType & { isEditable: boolean }) {
  return (
    <TextEditor
      key={props._id}
      _id={props._id}
      editorState={props.editorState}
      isEditable={props.isEditable}
    />
  );
}

export { NoteEditor, ReadOnlyEditor };

export default function NoteEditor() {
  const { noteData, isLoading: isSelectedNoteLoading } = useSelectedNote();

  return (
      <>

    <TextEditor
      key={noteData?._id}
      _id={noteData?._id}
      isEditable={true}
      editorState={noteData?.editorState}
      isPublic={noteData?.isPublic}
    />
        <EditorLoadingOverlay isLoading={isSelectedNoteLoading} />
      </>
  );
}
