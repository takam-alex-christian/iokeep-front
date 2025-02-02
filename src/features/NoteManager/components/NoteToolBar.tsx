"use client";
import React, { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { Button, Skeleton } from "@nextui-org/react";
import { liveDataContext } from "@/contexts/liveDataContext";
import { deleteNote, useNotes } from "@/lib/noteUtils";
import { NoteItemDataType } from "@/types";
import { useFolders } from "@/lib/folderUtils";
import { AnimatePresence, motion } from "framer-motion";

export default function NoteToolBar() {
  const { isLoading: isFolderLoading, folderData } = useFolders();
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);
  const { notesData, mutate } = useNotes();

  function addButtonHandler() {
    // console.log("create new note button")
    liveAppDataDispatch({
      type: "changedSelectedNote",
      payload: { noteId: "" },
    });
  }

  function deleteButtonHandler() {
    if (liveAppData.selectedNoteId) {
      deleteNote(liveAppData.selectedNoteId).then((jsonResponse) => {
        if (!jsonResponse.error) {
          if (jsonResponse.success) {
            // display something to infor the user that not is successfully deleted

            //mutate to remove selectedFolder id
            mutate(
              notesData.filter((eachNote) => {
                return eachNote._id != liveAppData.selectedNoteId;
              })
            ).then((newData: Array<NoteItemDataType>) => {
              if (newData.length > 0) {
                liveAppDataDispatch({
                  type: "changedSelectedNote",
                  payload: { noteId: newData[0]._id },
                });
              } else {
                //inform user this folder is empty
                liveAppDataDispatch({
                  type: "changedSelectedNote",
                  payload: { noteId: "" },
                });
              }
            });
            //select new not in the list
          } else {
            // inform the user that note was not deleted
          }
          console.log(jsonResponse.info);
        } else {
          console.log(
            `Server found Error & says-> ${jsonResponse.error.message}}`
          );
        }
      });
    }
    console.log(liveAppData.selectedNoteId ? "yes" : "no");
    console.log("delete button pressed");
  }
  return (
    <div className="px-2">
      <div className="flex flex-row justify-between items-center">
        <div className="relative flex w-full items-center">
          <AnimatePresence>
            {isFolderLoading && liveAppData.selectedFolderId == null && (
              <motion.div
                key={"loadingFolderSkeleton"}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className=" absolute flex w-full h-10"
              >
                <Skeleton key={0} className=" w-full h-full rounded-xl" />
              </motion.div>
            )}

            {!isFolderLoading && liveAppData.selectedFolderId && (
              <motion.div
                key={"LoadedFolderName"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <span className=" text-xl font-semibold">
                  {
                    folderData[
                      folderData.findIndex(({ _id }) => {
                        return _id == liveAppData.selectedFolderId;
                      })
                    ].folderName
                  }
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-row justify-between">
          <Button
            className="bg-transparent hover:bg-surface"
            isIconOnly
            onPress={addButtonHandler}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <Button
            variant="light"
            onPress={deleteButtonHandler}
            isIconOnly
            isDisabled={liveAppData.selectedNoteId ? false : true}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </Button>
        </div>
      </div>
    </div>
  );
}
