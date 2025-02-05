import { FolderDataType } from "@/types";

type FolderManagerStateType = {
  showFolderInput: boolean;
  //   selectedFolderId: string | null;
};

type FolderManagerReducerActionType = { type: "toggledFolderInput" };

// type FolderItemType = {folderId: string, name: string, creationDate: string}

export type { FolderManagerReducerActionType, FolderManagerStateType };
