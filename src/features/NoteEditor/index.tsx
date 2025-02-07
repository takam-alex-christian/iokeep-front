"use client";

import { SetStateAction, useContext, useEffect, useRef, useState } from "react";

import { liveDataContext } from "@/contexts/liveDataContext";

//nextui imports
import {
  Button,
  ButtonProps,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

//font awesome lib imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBold,
  faItalic,
  faHeading,
  faUnderline,
  faRotateBackward,
  faRotateForward,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";

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

interface CustomEditorStateType {
  description: string[];
  isNoteDeleted: boolean;
}

const theme = {
  heading: {
    h1: "text-lg font-semibold my-2",
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

function ToolButton(props: ButtonProps) {
  return (
    <Button
      className=""
      isIconOnly={true}
      variant="light"
      color={props.color ? props.color : "default"}
      {...props}
    />
  );
}

function CustomToolBar(props: {
  _id?: string;
  customEditorState: CustomEditorStateType;
}) {
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const { isLoading: isSelectedNoteLoading, noteData: selectedNoteData } =
    useSelectedNote();

  const {
    notesData,
    mutate: mutateNotesData,
    isLoading: areNotesLoading,
    error: useNotesError,
  } = useNotes();

  const {
    folderData,
    isLoading: areFoldersLoading,
    mutate: mutateFolders,
  } = useFolders();

  const shareInputRef = useRef<HTMLInputElement>(null);
  const [shareNoteState, setShareNoteState] = useState<{
    showPublicNoteLink: boolean;
    showCopiedAlert: boolean;
  }>({
    showPublicNoteLink: false,
    showCopiedAlert: false,
  });

  const [editor] = useLexicalComposerContext();

  const {
    isOpen: isShareModalOpen,
    onOpen: onShareModalOpen,
    onOpenChange: onShareModalOpenChange,
  } = useDisclosure();

  function boldButtonHandler() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }

  function italicButtonHandler() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }

  function underlineButtonHandler() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }

  function headingButtonHandler() {
    editor.update(() => {
      const editorSelection = $getSelection();

      if ($isRangeSelection(editorSelection)) {
        $setBlocksType(editorSelection, () => $createHeadingNode("h1"));
      }
    });
  }

  // useEffect(()=>{

  //     editor.registerCommand(CAN_UNDO_COMMAND, (payload)=>{
  //         console.log(`content of the can_undo_command payload ${payload}`)
  //         return false
  //     }, 1)
  // }, [editor])

  function undoButtonHandler() {
    //@ts-ignore
    editor.dispatchCommand(UNDO_COMMAND);
  }

  function redoButtonHandler() {
    //@ts-ignore
    editor.dispatchCommand(REDO_COMMAND);
  }

  function saveButtonHandler() {
    // console.log(editor.getEditorState())
    // const editorState = JSON.stringify(editor.getEditorState().toJSON()) //this version of the editor state can be stringified and stored

    const editorState = JSON.stringify(editor.getEditorState().toJSON()); //this version of the editor state can be stringified and stored

    if (liveAppData.selectedFolderId && !props._id) {
      console.log(
        `note create description ${props.customEditorState.description}`
      );
      createNote({
        editorState,
        folderId: liveAppData.selectedFolderId,
        description: props.customEditorState.description,
      }).then((jsonResponse) => {
        if (!jsonResponse.error) {
          if (jsonResponse.success) {
            //mutate useNotes
            mutateNotesData([
              ...notesData,
              {
                ...jsonResponse.data,
                editorState,
              } as Partial<NoteItemDataType>,
            ]);

            const folderDataCopy = folderData;
            const indexOfSelectedFolder = folderDataCopy.findIndex(
              (eachFolder) => {
                return eachFolder._id == liveAppData.selectedFolderId;
              }
            );

            folderDataCopy[indexOfSelectedFolder].size! += 1;
            mutateFolders(folderDataCopy);
            //set selectedNoteId to new note id
            liveAppDataDispatch({
              type: "changedSelectedNote",
              payload: { noteId: jsonResponse.data?._id! },
            });
            // alert("note created")
          } //noteId can be stored to current editor
          else alert("failed to save note");
        } else {
          console.log(jsonResponse.error.message);
        }
      });
    } else if (liveAppData.selectedFolderId && props._id) {
      console.log(
        `update editor description ${props.customEditorState.description}`
      );
      updateNote({
        _id: props._id,
        editorState,
        description: props.customEditorState.description,
      }).then((jsonResponse) => {
        if (!jsonResponse.error) {
          console.log(`server says: ${jsonResponse.info}`);

          //mutate useNotes
          let newNotes = [...notesData];
          let updatedNoteIndex = newNotes.findIndex((eachNote) => {
            return eachNote._id == props._id;
          });
          newNotes[updatedNoteIndex].description =
            props.customEditorState.description;

          mutateNotesData(newNotes);
        } else {
          console.log(
            `error while updating note \nserver says: ${jsonResponse.error.message}`
          );
        }
      });
    }

    // console.log(editorState)
  }

  function shareButtonHandler() {
    //change state to show link box

    const editorState = JSON.stringify(editor.getEditorState().toJSON()); //this version of the editor state can be stringified and stored

    if (isSelectedNoteLoading == false && selectedNoteData?._id) {
      updateNote({
        _id: selectedNoteData._id,
        editorState,
        description: props.customEditorState.description,
        isPublic: true,
      }).then((jsonResponse) => {
        if (!jsonResponse.error) {
          console.log(jsonResponse.info);
        } else {
          console.log(jsonResponse.success);
        }
      });
    }
    setShareNoteState((prevState) => {
      return { ...prevState, showPublicNoteLink: true };
    });

    onShareModalOpen();
  }

  function shareButtonCopyToClipboardHandler() {
    shareInputRef.current?.select();

    navigator.clipboard.writeText(
      shareInputRef.current?.value ? shareInputRef.current?.value : ""
    );
  }

  return (
    <div className="flex flex-row gap-2 justify-between p-2 bg-default/10 rounded-t-xl">
      <div className="flex flex-row flex-grow gap-6">
        <div className="flex flex-row gap-0 bg-default/20 rounded-xl">
          <ToolButton onPress={undoButtonHandler}>
            <FontAwesomeIcon icon={faRotateBackward} />
          </ToolButton>
          <ToolButton onPress={redoButtonHandler}>
            <FontAwesomeIcon icon={faRotateForward} />
          </ToolButton>
        </div>

        <div className="flex flex-row gap-2 flex-grow ">
          <div>
            <ToolButton onPress={headingButtonHandler}>
              <FontAwesomeIcon icon={faHeading} />
            </ToolButton>
          </div>
          {/* <Divider orientation="vertical" /> */}
          <div className="flex flex-row gap-0">
            <ToolButton onPress={italicButtonHandler}>
              <FontAwesomeIcon icon={faItalic} />
            </ToolButton>
            <ToolButton onPress={boldButtonHandler}>
              <FontAwesomeIcon icon={faBold} />
            </ToolButton>
            <ToolButton onPress={underlineButtonHandler}>
              <FontAwesomeIcon icon={faUnderline} />
            </ToolButton>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="relative flex flex-col gap-1">
          <ToolButton onPress={shareButtonHandler}>
            <Share01Icon />
          </ToolButton>
          <div className="relative">
            <Modal
              isOpen={isShareModalOpen}
              onOpenChange={onShareModalOpenChange}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader>Copy Link</ModalHeader>
                    <ModalBody>
                      <p>
                        You can share this link with your friends. They'll
                        probably enjoy reading through this note
                      </p>
                      <div className="bg-primary-50 p-2 w-full rounded-xl">
                        <input
                          ref={shareInputRef}
                          className="min-w-20 w-full bg-transparent focus:outline-none"
                          readOnly
                          value={`https://iokeep.com/notes/${props._id}`}
                        />
                      </div>
                      {/* <Button
                        onPress={shareButtonCopyToClipboardHandler}
                        isIconOnly
                        size="sm"
                      >
                        <Copy01Icon />
                      </Button> */}
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        startContent={<Copy01Icon />}
                        onPress={shareButtonCopyToClipboardHandler}
                        variant="solid"
                        color="primary"
                      >
                        Copy
                      </Button>
                      {/* <Button onPress={onClose} color="danger" variant="flat">
                        Close
                      </Button> */}
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>

        <ToolButton onPress={saveButtonHandler}>
          <FontAwesomeIcon className="text-lg" icon={faFloppyDisk} />
        </ToolButton>
      </div>
    </div>
  );
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
    <div className="custom-container rounded-3xl overflow-clip flex flex-col flex-grow  ">
      {/* lexical editor */}
      <LexicalComposer initialConfig={initialConfig}>
        <div className=" flex-grow flex flex-col gap-0 shadow-sm rounded-xl">
          {props.isEditable && (
            <CustomToolBar
              _id={props._id}
              customEditorState={customEditorState}
            />
          )}

          {/* <Divider orientation="horizontal" /> */}
          {/* <Divider orientation="horizontal" /> */}
          <div className=" relative flex flex-col flex-grow py-2 px-6">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className=" focus-within:outline-none flex-grow py-4" />
              }
              placeholder={
                <div className="absolute top-8 left-6 z-10 text-neutral-400">
                  Don't stop writing...
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
  const { noteData } = useSelectedNote();

  return (
    <TextEditor
      key={noteData?._id}
      _id={noteData?._id}
      isEditable={true}
      editorState={noteData?.editorState}
      isPublic={noteData?.isPublic}
    />
  );
}
