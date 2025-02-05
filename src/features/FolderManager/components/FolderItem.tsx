"use client";

import React, { useState, useEffect, useContext } from "react";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

import { useAnimate, motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

import { liveDataContext } from "@/contexts/liveDataContext";
import { FolderDataType } from "@/types";
import { deleteFolder, useFolders } from "@/lib/folderUtils";
import FolderInput from "./FolderInput";
import SlidersHorizontalIcon from "@/assets/sliders-horizontal-stroke-rounded";
import MenuTwoLineIcon from "@/assets/menu-two-line-stroke-rounded";

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
      className={`relative flex flex-row ${
        itemState.isRenamed ? "my-3" : " pl-4"
      } cursor-pointer items-center justify-start rounded-xl min-h-10 overflow-visible transition-all ${
        props._id == liveAppData.selectedFolderId
          ? "bg-primary-50"
          : "bg-transparent"
      }`}
    >
      {!itemState.isRenamed && (
        <>
          <button
            onClick={folderItemPressHandler}
            className={` overflow-hidden w-full hover:bg-none focus-visible:outline-none`}
          >
            <div className=" flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faFolder} />

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
