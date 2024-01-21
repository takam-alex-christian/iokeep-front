
type FolderManagerStateType = {
    selectedFolderId: string
}

type FolderManagerReducerActionType = {type: "changedSelectedFolder", payload: {folderId: string}}

interface FolderItemProps {
    folderId: string,
    name: string,
    isSelected: boolean,
    creationDate?: Date,
    folderManagerDispatch: React.Dispatch<FolderManagerReducerActionType>

}

export type {FolderManagerReducerActionType, FolderManagerStateType, FolderItemProps}