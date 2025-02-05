import React, { useState, useEffect, SetStateAction, useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import {} from "@fortawesome/free-solid-svg-icons";

import {
  Button,
  Input,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spacer,
} from "@heroui/react";
import { createFolder, renameFolder, useFolders } from "@/lib/folderUtils";
import { FolderManagerReducerActionType } from "../types";
import { FolderItemType } from "./FolderItem";
import { liveDataContext } from "@/contexts/liveDataContext";

type FormStateType = {
  foldername: {
    value: string;
    isEngaged: boolean;
    isInvalid: boolean;
    errorMessage: string;
  };
};

interface FolderInputProps {
  create?: {
    folderManagerDispatch: React.Dispatch<FolderManagerReducerActionType>;
  };
  rename?: {
    _id: string;
    initialValue: string;
    setCallerItemState: React.Dispatch<SetStateAction<FolderItemType>>;
  };
}

export default function (props: FolderInputProps) {
  const [formState, setFormState] = useState<FormStateType>({
    foldername: {
      value: props.rename ? props.rename.initialValue : "",
      isEngaged: false,
      isInvalid: false,
      errorMessage: "",
    },
  });

  const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext);

  const { folderData, isLoading, mutate: mutateFolders } = useFolders();

  useEffect(() => {
    if (formState.foldername.isEngaged) validateFolderName();
  }, [formState.foldername.value]);

  function folderNameChangeHandler(value: string) {
    setFormState((prevState) => {
      return {
        ...prevState,
        foldername: { ...prevState.foldername, value, isEngaged: true },
      };
    });
  }

  function validateFolderName() {
    let isInvalid: boolean = false;
    let errorMessage: string = "";

    if (formState.foldername.value.length != 0) {
      if (
        !isLoading &&
        folderData.find(({ folderName }) => {
          return folderName == formState.foldername.value;
        })
      ) {
        isInvalid = true;
        errorMessage = "foldername unavailable!";
      }
    } else {
      isInvalid = true;
      errorMessage = "empty folder name";
    }

    setFormState((prevState) => {
      return {
        ...prevState,
        foldername: { ...prevState.foldername, isInvalid, errorMessage },
      };
    });
  }

  function folderSubmitHandler(e: React.FormEvent) {
    e.preventDefault();

    /** Todo
     * Display loading state
     * clear formState
     */
    if (props.create) {
      createFolder(formState.foldername.value).then((jsonResponse) => {
        if (!jsonResponse.error) {
          if (jsonResponse.success) {
            //mutate folders
            mutateFolders([
              ...folderData,
              {
                _id: jsonResponse.data.folderId,
                folderName: formState.foldername.value,
              },
            ]); //empties first, to be fixed

            //hide folderInput
            props.create?.folderManagerDispatch({ type: "toggledFolderInput" });
          } else {
            alert("failed");
          }
        } else {
          setFormState((prevState) => {
            return {
              ...prevState,
              foldername: {
                ...prevState.foldername,
                errorMessage: jsonResponse.error!.message,
                isInvalid: true,
              },
            };
          });
        }
      });
    }

    if (props.rename) {
      renameFolder(props.rename._id, formState.foldername.value).then(
        (jsonResponse) => {
          console.log(jsonResponse);
          if (!jsonResponse.error) {
            if (jsonResponse.success) {
              //mutate updated folder
              let foldersCopy = [...folderData];
              let updatedFolderId = foldersCopy.findIndex((eachFolder) => {
                return eachFolder._id == props.rename?._id;
              });

              foldersCopy[updatedFolderId].folderName =
                formState.foldername.value;

              mutateFolders(foldersCopy);

              //cause a rerender by setting selected folder
              liveAppDataDispatch({
                type: "changedSelectedFolder",
                payload: { folderId: liveAppData.selectedFolderId! },
              }); //solved the issue of none changing display foldernames

              props.rename?.setCallerItemState((prevState) => {
                return { ...prevState, isRenamed: false };
              });
            } else {
            }
          } else {
            setFormState((prevState) => {
              return {
                ...prevState,
                foldername: {
                  ...prevState.foldername,
                  errorMessage: jsonResponse.error!.message,
                  isInvalid: true,
                },
              };
            });
          }
        }
      );
    }
  }

  return (
    <form onSubmit={folderSubmitHandler} className="w-full">
      <div className="flex flex-row gap-2 items-center  w-full">
        <Tooltip
          placement="right"
          isOpen={formState.foldername.isInvalid}
          offset={20}
          showArrow={true}
          content={
            <div className="h-10 flex justify-center items-center">
              {formState.foldername.errorMessage}
            </div>
          }
          color="default"
        >
          <Input
            autoFocus
            value={formState.foldername.value}
            onValueChange={folderNameChangeHandler}
            isRequired
            isInvalid={
              formState.foldername.isInvalid && formState.foldername.isEngaged
            }
            // errorMessage={formState.foldername.errorMessage}

            startContent={
              <FontAwesomeIcon className="text-base" icon={faFolder} />
            }
            placeholder="folder name"
            variant="flat"
            color="primary"
            classNames={{
              input: "",
              inputWrapper: "pl-4",
              innerWrapper: "flex flex-row gap-1",
            }}
          />
        </Tooltip>

        {/* <Button isIconOnly size={"sm"} variant="flat" color={"primary"}><FontAwesomeIcon icon={faPlus} /></Button> */}
      </div>
    </form>
  );
}
