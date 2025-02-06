"use client";
import React, { useContext, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { Button, Select, SelectItem, Skeleton } from "@heroui/react";
import { liveDataContext } from "@/contexts/liveDataContext";
import { deleteNote, orderNotes, useNotes } from "@/lib/noteUtils";
import { LiveDataState, NoteItemDataType } from "@/types";
import { useFolders } from "@/lib/folderUtils";
import { AnimatePresence, motion } from "framer-motion";
import ArrangeByLettersAZIcon from "@/assets/arrange-by-letters-a-z-stroke-rounded";
import ArrangeByLettersZAIcon from "@/assets/arrange-by-letters-z-a-stroke-rounded";

export default function NoteToolBar() {
  const {
    isLoading: isFolderLoading,
    folderData,
    mutate: mutateFoldersData,
  } = useFolders();
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);
  const { isLoading: isNoteDataLoading, notesData, mutate } = useNotes();

  const noteOrderToText: { [k: string]: string } = {
    cd: "By Creation Date",
    rcd: "By Desc. Creation Date",
    lmd: "By Last Modified Date",
    rlmd: "By Desc. Last Modified",
  };

  // if !isFolderLoading
  const indexOfSelectedFolder = !isFolderLoading
    ? folderData.findIndex((eachFolder) => {
        return eachFolder._id == liveAppData.selectedFolderId;
      })
    : -1;
  const displayFolderName =
    indexOfSelectedFolder > -1
      ? folderData[indexOfSelectedFolder].folderName
      : "nothing";

  useEffect(() => {
    //noteOrder changed, reorder note by mutate
    console.log(liveAppData.noteOrder);
  }, [liveAppData.noteOrder]);

  function selectNoteOrderHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    liveAppDataDispatch({
      type: "changedNoteOrder",
      payload: { newNoteOrder: e.target.value as LiveDataState["noteOrder"] },
    });

    if (!isNoteDataLoading && notesData) {
      mutate([
        ...orderNotes(notesData, e.target.value as LiveDataState["noteOrder"]),
      ]);
    }
  }

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

            const foldersDataCopy = folderData;
            const folderIndex = folderData.findIndex((eachFolder) => {
              return eachFolder._id == liveAppData.selectedFolderId;
            });

            if (folderIndex) {
              foldersDataCopy[folderIndex].size! -= 1;
            }
            mutateFoldersData(foldersDataCopy);
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
    <div className=" px-4 py-2">
      <div className="flex flex-row justify-between items-center  rounded-xl">
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
                  {displayFolderName}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-row items-center justify-between pl-2 rounded-xl">
          <div className="relative mr-2">
            <div className="">
              <Select
                aria-label="Order"
                selectedKeys={
                  liveAppData.noteOrder ? [liveAppData.noteOrder] : undefined
                }
                startContent={
                  liveAppData.noteOrder == "rcd" ||
                  liveAppData.noteOrder == "rlmd" ? (
                    <ArrangeByLettersZAIcon />
                  ) : (
                    <ArrangeByLettersAZIcon />
                  )
                }
                classNames={{
                  popoverContent: "absolute w-fit",
                  listbox: "",
                  listboxWrapper: "w-fit",
                }}
                color="default"
                variant="flat"
                onChange={selectNoteOrderHandler}
              >
                {Object.keys(noteOrderToText).map((eachKey) => {
                  return (
                    <SelectItem color="primary" key={eachKey}>
                      {noteOrderToText[eachKey]}
                    </SelectItem>
                  );
                })}
              </Select>
            </div>
          </div>
          <Button
            className="bg-transparent hover:bg-surface"
            isIconOnly
            onPress={addButtonHandler}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <Button
            variant="light"
            // color="danger"
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
