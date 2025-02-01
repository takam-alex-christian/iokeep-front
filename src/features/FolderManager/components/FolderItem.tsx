"use client";

import React, { useState, useEffect, useContext } from "react";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import { useAnimate, motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

import { liveDataContext } from "@/contexts/liveDataContext";
import { FolderDataType } from "@/types";
import { deleteFolder, useFolders } from "@/lib/folderUtils";
import FolderInput from "./FolderInput";

type FolderItemType = {
  isHovered: boolean;
  isRenamed: boolean;
};

export default function (props: FolderDataType) {
  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const { folderData, isLoading, error, mutate: mutateFolders } = useFolders();

  const [folderItemScope, animateFolderItem] = useAnimate();

  const [optionButtonScope, animateOptionButton] = useAnimate(); //as in animate option button scrope

  const [itemState, setItemState] = useState<FolderItemType>({
    isHovered: false,
    isRenamed: false,
  });

  useEffect(() => {
    if (!itemState.isRenamed) {
      if (itemState.isHovered)
        animateOptionButton(
          optionButtonScope.current,
          { opacity: 1 },
          { duration: 0.4 }
        );
      else
        animateOptionButton(
          optionButtonScope.current,
          { opacity: 0 },
          { duration: 0.4 }
        );
    }
  }, [itemState.isHovered]);

  function folderRenameHandler() {
    setItemState((prevState) => {
      return { ...prevState, isRenamed: true };
    });
  }

  function folderDeleteHandler() {
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
            mutateFolders(
              folderData.filter((eachFolder) => {
                return eachFolder._id != props._id;
              })
            );
          });

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
      className={`relative flex flex-row items-center rounded-xl h-10 pl-4  hover:bg-surface transition-all ${
        props._id == liveAppData.selectedFolderId
          ? "bg-surface"
          : "bg-transparent"
      }`}
    >
      {!itemState.isRenamed && (
        <>
          <button
            onClick={folderItemPressHandler}
            className={`w-full hover:bg-none focus-visible:outline-none`}
          >
            <div className="flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faFolder} />

              <div>{props.folderName}</div>
            </div>
          </button>

          <motion.div>
            <div className="flex items-center justify-center text-xs w-8 py-1 px-2 bg-surface rounded-xl">
              {props.size && <span>{props.size}</span>}
            </div>
          </motion.div>

          <div className="">
            <Dropdown>
              <DropdownTrigger>
                <Button className="" size={"sm"} variant="light" isIconOnly>
                  <FontAwesomeIcon
                    className="opacity-0"
                    ref={optionButtonScope}
                    icon={faEllipsisVertical}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="folder menu">
                <DropdownItem key={"edit"} onPress={folderRenameHandler}>
                  Rename
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

export type { FolderItemType };
