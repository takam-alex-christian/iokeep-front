"use client";

import React, { useState, useEffect, useContext } from "react";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

import {HugeiconsIcon} from "@hugeicons/react"
import {Folder01Icon, FolderShared02Icon} from "@hugeicons/core-free-icons"

import { useAnimate, motion } from "framer-motion";
//
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFolder } from "@fortawesome/free-regular-svg-icons";
// import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

import { liveDataContext } from "@/contexts/liveDataContext";
import { FolderDataType } from "@/types";
import { deleteFolder, updateFolder, useFolders } from "@/lib/folderUtils";
import FolderInput from "./FolderInput";
import SlidersHorizontalIcon from "@/assets/sliders-horizontal-stroke-rounded";
import MenuTwoLineIcon from "@/assets/menu-two-line-stroke-rounded";
import { updateNote, useNotes } from "@/lib/noteUtils";
import { mutateArrayUtil } from "@/lib/utils";

type FolderItemInternalStateType = {
  isHovered: boolean;
  isRenamed: boolean;
  isDragEntered: boolean;
};

export default function FolderItem(props: FolderDataType) {
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const { folderData, isLoading, error, mutate: mutateFolders } = useFolders();
  const {
    notesData,
    isLoading: areNotesDataLoading,
    mutate: mutateNotes,
  } = useNotes();

  const [folderItemScope, animateFolderItem] = useAnimate();

  const [optionButtonScope, animateOptionButton] = useAnimate(); //as in animate option button scrope

  const [itemState, setItemState] = useState<FolderItemInternalStateType>({
    isHovered: false,
    isRenamed: false,
    isDragEntered: false,
  });

  const isFolderSelected = props._id == liveAppData.selectedFolderId;

  useEffect(() => {
    if (!itemState.isRenamed) {
      if (itemState.isHovered)
        animateOptionButton(
          optionButtonScope.current,
          { opacity: 1, x: 0, width: "fit-content" },
          { duration: 0.4 }
        );
      else
        animateOptionButton(
          optionButtonScope.current,
          { opacity: 0, x: 50, width: 0 },
          { duration: 0.4 }
        );
    }
  }, [itemState.isHovered]);

  function folderRenameHandler() {
    setItemState((prevState) => {
      return { ...prevState, isRenamed: true };
    });
  }
  useEffect(() => {
    console.log(folderData);
  }, [folderData]);

  function folderPublishHandler() {
    updateFolder(props._id, { isPublic: !props.isPublic }).then(
      (jsonResponse) => {
        if (!jsonResponse.error) {
          mutateArrayUtil<FolderDataType>(
            props._id,
            mutateFolders,
            folderData,
            {
              isPublic: !props.isPublic,
            }
          );
        } else {
          // mutateArrayUtil<FolderDataType>(
          //   props._id,
          //   mutateFolders,
          //   folderData,
          //   { isPublic: !props.isPublic }
          // );
          // inform user of failure to publish note
        }
      }
    );
  }

  function folderDeleteHandler() {
    //select the next folder inline
    // if the selected folder is the deleted folder,  select another folder then delete
    //posibility
    if (props._id == liveAppData.selectedFolderId) {
      liveAppDataDispatch({
        type: "changedSelectedFolder",
        payload: { folderId: folderData ? folderData[0]._id : "" },
      });
    }

    deleteFolder(props._id).then((jsonResponse) => {
      if (!jsonResponse.error) {
        if (jsonResponse.success) {
          //animate current item
          animateFolderItem(
            folderItemScope.current,
            { opacity: 0, y: -16, height: 0 },
            { duration: 0.4 }
          ).then(() => {
            //mutate folderData
          });

          const indexOfFolder = folderData.findIndex((eachFolder) => {
            return eachFolder._id == liveAppData.selectedFolderId;
          });

          const newSelectedFolderIndex = indexOfFolder == 0 ? 1 : 0;

          mutateFolders(
            folderData.filter((eachFolder) => {
              return eachFolder._id != props._id;
            })
          );

          if (liveAppData.selectedFolderId == props._id) {
            if (folderData.length > 1) {
              liveAppDataDispatch({
                type: "changedSelectedFolder",
                payload: {
                  folderId: folderData[newSelectedFolderIndex]._id,
                },
              });
            }
          }

          //animate presence
        } // remove folder from folderData
        else alert("failed");
      } else {
        console.log(jsonResponse.error.message);
      }
    });
  }

  function folderItemPressHandler() {
    liveAppDataDispatch({
      type: "changedSelectedFolder",
      payload: { folderId: props._id },
    });

    console.log("folderManagerSelectedId changed to a new id");
  }

  async function onNoteDropHandler(e: React.DragEvent) {
    const draggedNoteId = e.dataTransfer.getData("text/plain");

    setItemState((prevState) => {
      return { ...prevState, isDragEntered: false };
    });

    await updateNote({
      _id: draggedNoteId,
      folderId: props._id,
    }).then((jsonResponse) => {
      if (!jsonResponse.error) {
        if (jsonResponse.success) {
          const originFolderIndex = folderData.findIndex((eachFolder) => {
            return eachFolder._id == liveAppData.selectedFolderId;
          });
          const destFolderIndex = folderData.findIndex((eachFolder) => {
            return eachFolder._id == props._id;
          });

          const folderDataCopy = folderData;
          if (originFolderIndex) folderDataCopy[originFolderIndex].size! -= 1;
          if (destFolderIndex) folderDataCopy[originFolderIndex].size! += 1;

          if (!isLoading && folderData.length > 0) {
            // const receiverFolderIndex

            mutateFolders(folderDataCopy);
          }

          if (!areNotesDataLoading && notesData.length > 0) {
            mutateNotes([
              ...notesData.filter((eachNote) => {
                return eachNote._id != draggedNoteId;
              }),
            ]);
          }

          if (liveAppData.selectedNoteId == draggedNoteId) {
            // open the receiving folder insted

            liveAppDataDispatch({
              type: "changedSelectedFolder",
              payload: { folderId: props._id },
            });

            //persist newly selected folder folder
            window.localStorage.setItem("persistedFolderId", props._id);
          } else {
            //mutate note immediately to perceive visual change
          }
        }
      }
    });
  }

  function onNoteDragEnterHandler() {
    setItemState((prevState) => {
      return { ...prevState, isDragEntered: true };
    });

    console.log("drag hovering");
  }

  function onNoteDragLeaveHandler() {
    setItemState((prevState) => {
      return { ...prevState, isDragEntered: false };
    });
  }
  return (
    <div
      ref={folderItemScope}
      onMouseEnter={() => {
        setItemState((prevState) => {
          return { ...prevState, isHovered: true };
        });
      }}
      onMouseLeave={() => {
        setItemState((prevState) => {
          return { ...prevState, isHovered: false };
        });
      }}
      onDrop={onNoteDropHandler}
      className={`group relative flex flex-row ${
        itemState.isRenamed ? "my-3" : " pl-4"
      } cursor-pointer items-center justify-start rounded-xl min-h-10 overflow-visible ${
        itemState.isDragEntered
          ? " outline-dashed outline-1 outline-primary-800"
          : ""
      } hover:bg-primary-50 transition-colors ${
        props._id == liveAppData.selectedFolderId ? "bg-primary-50" : ""
      }`}
    >
      {/* this div is meant to overlay on folder item will be responsible for drag reception */}
      <div
        className="absolute group-focus-within:invisible group-hover:invisible z-50 bg-transparent inset-0"
        onDragOver={(e) => {
          e.preventDefault(); //allow element to accept drop
        }}
        onDragEnter={onNoteDragEnterHandler}
        onDragLeave={onNoteDragLeaveHandler}
      ></div>
      {!itemState.isRenamed && (
        <>

            <button
              onClick={folderItemPressHandler}
              className={` overflow-hidden w-full hover:bg-none focus-visible:outline-none`}
            >
              <div className=" flex flex-row items-center gap-2">
                {/*<FontAwesomeIcon icon={faFolder} />*/}
                <HugeiconsIcon icon={props.isPublic? FolderShared02Icon: Folder01Icon} size={24}/>




                <div className="flex flex-row w-full justify-between">
                  <span className="shrink text-ellipsis whitespace-nowrap overflow-hidden ">
                    {props.folderName}
                  </span>

                  <span className=" shrink-0 text-xs w-fit py-1 px-2">
                    {props.size && <span>{props.size}</span>}
                  </span>
                </div>
              </div>
            </button>

          {/* add modal to copy folder link */}

          {/* <motion.div></motion.div> */}

          <div className="" ref={optionButtonScope}>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className=""
                  size={"sm"}
                  color={`${isFolderSelected ? "primary" : "default"}`}
                  variant={`light`}
                  isIconOnly
                >
                  {/* <FontAwesomeIcon className="" icon={faEllipsisVertical} /> */}
                  <MenuTwoLineIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="folder menu"
                color="primary"
                variant="flat"
              >
                <DropdownItem key={"edit"} onPress={folderRenameHandler}>
                  Rename
                </DropdownItem>
                <DropdownItem key={"publish"} onPress={folderPublishHandler}>
                  {props.isPublic ? "Unpublish" : "Publish"}
                </DropdownItem>
                <DropdownItem
                  onPress={folderDeleteHandler}
                  className="text-danger"
                  key={"delete"}
                  color="danger"
                  variant="flat"
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </>
      )}

      {itemState.isRenamed && (
        <FolderInput
          rename={{
            _id: props._id,
            initialValue: props.folderName,
            setCallerItemState: setItemState,
          }}
        />
      )}
    </div>
  );
}

export type { FolderItemInternalStateType };
