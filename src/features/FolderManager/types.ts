
type FolderManagerStateType = {
    selectedFolderId: string,
    showFolderInput: boolean
}

type FolderManagerReducerActionType = {type: "toggledFolderInput"}
// | {type: "changedSelectedFolder", payload: {folderId: string}} 

interface FolderItemProps {
    folderId: string,
    name: string,
    isSelected: boolean,
    creationDate?: Date,
    folderManagerDispatch: React.Dispatch<FolderManagerReducerActionType>

}

export type {FolderManagerReducerActionType, FolderManagerStateType, FolderItemProps}