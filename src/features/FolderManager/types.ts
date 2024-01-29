
type FolderManagerStateType = {

    showFolderInput: boolean,
    folderItems: FolderItemType[]
}

type FolderManagerReducerActionType = {type: "folderItemsInitialized", payload: {folderItems: FolderItemType[]}} | {type: "toggledFolderInput"}

type FolderItemType = {folderId: string, name: string, creationDate: string}

interface FolderItemProps {
    folderId: string,
    name: string,
    creationDate?: Date,
    folderManagerDispatch: React.Dispatch<FolderManagerReducerActionType>

}

export type {FolderManagerReducerActionType, FolderManagerStateType, FolderItemProps, FolderItemType}