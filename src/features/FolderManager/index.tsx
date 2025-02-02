"use client";

import { useReducer, useContext, useEffect } from "react";

import { Accordion, AccordionItem, Button } from "@nextui-org/react";

import { AnimatePresence, motion } from "framer-motion";

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

function folderManagerReducer(
  prevState: FolderManagerStateType,
  action: FolderManagerReducerActionType
): FolderManagerStateType {
  switch (action.type) {
    case "changedSelectedFolder":
      return { ...prevState, selectedFolderId: action.payload.folderId };
    case "toggledFolderInput":
      return { ...prevState, showFolderInput: !prevState.showFolderInput };
    default:
      return prevState;
  }
}

export default function () {
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const [folderManagerState, folderManagerDispatch] = useReducer(
    folderManagerReducer,
    { showFolderInput: false, selectedFolderId: null }
  );

  const { folderData, isLoading } = useFolders();

  useEffect(() => {
    if (!isLoading && folderData) {
      if (folderData.length > 0)
        liveAppDataDispatch({
          type: "changedSelectedFolder",
          payload: { folderId: folderData[0]._id },
        });
    }
  }, [isLoading]);

  function toggleFolderInputHandler() {
    folderManagerDispatch({ type: "toggledFolderInput" });
  }

  return (
    <div className="px-0 py-0">
      <Accordion defaultExpandedKeys={["0"]}>
        <AccordionItem
          // classNames={{ title: "" }}
          key={0}
          isCompact={false}
          title={"Folders"}
          classNames={{ heading: "px-2" }}
        >
          <div className="flex flex-col gap-2 px-2">
            <div>
              <AnimatePresence>
                {/* display loading component here when isLoading */}

                {!isLoading && folderData && (
                  <motion.div
                    key={"folderItems"}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ul className="flex flex-col gap-0">
                      {folderData.map((eachFolder, i) => {
                        return (
                          <li key={i}>
                            <FolderItem key={i} {...eachFolder} />
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}

                {folderManagerState.showFolderInput && (
                  <motion.div
                    key={"newFolderForm"}
                    initial={{ opacity: 0, y: -40, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 40 }}
                    exit={{ opacity: 0, y: -40, height: 0 }}
                  >
                    <FolderInput create={{ folderManagerDispatch }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <Button
                onPress={toggleFolderInputHandler} //toggle folder input component
                color={"success"}
                startContent={<FontAwesomeIcon icon={faPlus} />}
              >
                New Folder
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
