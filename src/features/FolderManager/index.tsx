"use client";

import { useReducer, useContext, useEffect } from "react";

import { Accordion, AccordionItem, Button } from "@heroui/react";

import { AnimatePresence, motion } from "motion/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import FolderItem from "./components/FolderItem";

import {
  FolderManagerReducerActionType,
  FolderManagerStateType,
} from "./types";

// import folderTestData from "@/data/test/folders.json";
import FolderInput from "./components/FolderInput";

import { liveDataContext } from "@/contexts/liveDataContext";
import { useFolders } from "@/lib/folderUtils";
import FoldersSkeleton from "./components/FoldersSkeleton";
import { useNotes } from "@/lib/noteUtils";

function folderManagerReducer(
  prevState: FolderManagerStateType,
  action: FolderManagerReducerActionType
): FolderManagerStateType {
  switch (action.type) {
    case "toggledFolderInput":
      return { ...prevState, showFolderInput: !prevState.showFolderInput };
    default:
      return prevState;
  }
}

export default function FolderManager() {
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const [folderManagerState, folderManagerDispatch] = useReducer(
    folderManagerReducer,
    { showFolderInput: false }
  );

  const { folderData, isLoading } = useFolders();
  const { notesData, isLoading: areNotesLoading } = useNotes();

  useEffect(() => {
    //when selectedFolder changes, we persist it with an effect
    if (
      liveAppData.selectedFolderId != null &&
      liveAppData.selectedFolderId !=
        window.localStorage.getItem("persistedFolderId")
    ) {
      //persist when folder matches selected note

      if (!liveAppData.selectedNoteId) {
        window.localStorage.setItem(
          "persistedFolderId",
          liveAppData.selectedFolderId ? liveAppData.selectedFolderId : ""
        );
      }
    }
  }, [liveAppData.selectedFolderId]);

  useEffect(() => {
    if (!isLoading && folderData) {
      //get persisted folderid
      let persistedFolderId = window.localStorage.getItem("persistedFolderId");

      if (folderData.length > 0) {
        liveAppDataDispatch({
          type: "changedSelectedFolder",
          payload: {
            folderId: persistedFolderId ? persistedFolderId : folderData[0]._id,
          },
        });
      }
    }
  }, [isLoading]);

  function toggleFolderInputHandler() {
    folderManagerDispatch({ type: "toggledFolderInput" });
  }

  return (
    <div className="custom-container rounded-3xl p-2">
      <Accordion defaultExpandedKeys={["0"]}>
        <AccordionItem
          // classNames={{ title: "" }}
          key={0}
          isCompact={false}
          title={"Folders"}
          classNames={{ heading: "px-2" }}
        >
          <div className="flex flex-col gap-2 ">
            <div className="relative flex flex-col w-full h-fit">
              <AnimatePresence>
                {/* display loading component here when isLoading */}
                {isLoading && !folderData && (
                  <motion.div
                    key={"foldersSkeleton"}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      position: "absolute",
                    }}
                  >
                    <FoldersSkeleton />
                  </motion.div>
                )}

                {!isLoading && folderData && (
                  <motion.div
                    key={"folderItems"}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <ul className="flex flex-col gap-0">
                      {folderData.map((eachFolder, i) => {
                        return (
                          <li key={eachFolder._id}>
                            <FolderItem key={eachFolder._id} {...eachFolder} />
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}

                {folderManagerState.showFolderInput && (
                  <motion.div
                    key={"newFolderForm"}
                    // className=""
                    initial={{
                      opacity: 0,
                      y: -40,
                      height: 0,
                      margin: "0px 0px",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      height: 40,
                      margin: "12px 0px",
                    }}
                    exit={{ opacity: 0, y: -40, height: 0, margin: "0px 0px" }}
                  >
                    <FolderInput create={{ folderManagerDispatch }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <Button
                onPress={toggleFolderInputHandler} //toggle folder input component
                color={"primary"}
                startContent={<FontAwesomeIcon icon={faPlus} />}
              >
                {folderManagerState.showFolderInput
                  ? "Cancel Creation"
                  : "Create Folder"}
                {/* New Folder */}
              </Button>
            </div>
          </div>
        </AccordionItem>
      </Accordion>

      {/* list folders */}
      {/* toggled visibity folder creation form */}
    </div>
  );
}
