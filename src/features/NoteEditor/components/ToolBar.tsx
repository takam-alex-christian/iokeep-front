"use client";
import { useContext, useReducer, useRef, useState } from "react";

import {usePathname} from "next/navigation"

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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";

//font awesome lib imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBold,
  faItalic,
  faUnderline,
  faRotateBackward,
  faRotateForward,
} from "@fortawesome/free-solid-svg-icons";

import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";

//lexical imports
import {
  FORMAT_TEXT_COMMAND,
  //   CLEAR_EDITOR_COMMAND,
  //   CAN_UNDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  //   CAN_REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  //   CLEAR_HISTORY_COMMAND,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $setBlocksType } from "@lexical/selection";

import { $createHeadingNode } from "@lexical/rich-text";
import { liveDataContext } from "@/contexts/liveDataContext";

import { createNote, updateNote, useNotes } from "@/lib/noteUtils";
import { useSelectedNote } from "../libs/customHooks";
import Share01Icon from "@/assets/share-01-stroke-rounded";

import Copy01Icon from "@/assets/copy-01-stroke-rounded";
import { NoteItemDataType } from "@/types";
import { useFolders } from "@/lib/folderUtils";

function ToolButton(props: ButtonProps) {
  return (
    <Button
      className=""
      isIconOnly={true}
      variant="light"
      //   size="sm"
      color={props.color ? props.color : "default"}
      {...props}
    />
  );
}

interface CustomEditorStateType {
  description: string[];
  isNoteDeleted: boolean;
}

// customToolBarReducer
//

type ToolBarStateType = {
  heading: {
    visible: boolean;
  };
};

type ToolBarActionType =
  | { type: "show_heading_list" }
  | { type: "hide_heading_list" };
function toolBarReducer(
  prevState: ToolBarStateType,
  action: ToolBarActionType
): ToolBarStateType {
  switch (action.type) {
    case "show_heading_list": {
      return {
        ...prevState,
        heading: { ...prevState.heading, visible: true },
      };
    }
    case "hide_heading_list": {
      return {
        ...prevState,
        heading: { ...prevState.heading, visible: false },
      };
    }
  }
}
function CustomToolBar(props: {
  _id?: string;
  customEditorState: CustomEditorStateType;
}) {
  const [toolBarState, toolBarDispatch] = useReducer(toolBarReducer, {
    heading: { visible: false },
  });
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

  // const pathName = usePathname()

  const baseOrigin = window.location.origin;

  function boldButtonHandler() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }

  function italicButtonHandler() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }

  function underlineButtonHandler() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }

  function headingButtonHandler(headingCat: "h1" | "h2" | "h3") {
    editor.update(() => {
      const editorSelection = $getSelection();

      if ($isRangeSelection(editorSelection)) {
        $setBlocksType(editorSelection, () => $createHeadingNode(headingCat));
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

          //mutate notes
          let indexOfPublishedNote = notesData.findIndex((eachNote) => {
            return eachNote._id == props._id;
          });

          if (indexOfPublishedNote) {
            let copiedNotesData = notesData;
            copiedNotesData[indexOfPublishedNote].isPublic = true;

            mutateNotesData(copiedNotesData);
          }
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
        <div className="flex flex-row gap-0 items-center bg-default/20 rounded-xl">
          <ToolButton onPress={undoButtonHandler}>
            <FontAwesomeIcon icon={faRotateBackward} />
          </ToolButton>
          <ToolButton onPress={redoButtonHandler}>
            <FontAwesomeIcon icon={faRotateForward} />
          </ToolButton>
        </div>

        <div className="flex flex-row gap-0 flex-grow ">
          <div>
            <Popover classNames={{ content: "px-1 rounded-lg" }}>
              <PopoverTrigger>
                <Button
                  //   size="sm"
                  variant="light"
                  isIconOnly
                  className="font-bold"
                >
                  H
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-1">
                  {["h1", "h2", "h3"].map((eachHstring) => {
                    return (
                      <Button
                        key={eachHstring}
                        size="sm"
                        variant="light"
                        onPress={() => {
                          //@ts-ignore
                          headingButtonHandler(eachHstring);
                        }}
                        isIconOnly
                      >
                        {eachHstring.toUpperCase()}
                      </Button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
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
                        You can share this link with your friends. They&apos;ll
                        probably enjoy reading through this note
                      </p>
                      <div className="bg-primary-50 p-2 w-full rounded-xl">
                        <input
                          ref={shareInputRef}
                          className="min-w-20 w-full bg-transparent focus:outline-none"
                          readOnly
                          value={`${(new URL("notes/" + props._id, baseOrigin)).toString() }`}
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

export default CustomToolBar;

export { type CustomEditorStateType };
