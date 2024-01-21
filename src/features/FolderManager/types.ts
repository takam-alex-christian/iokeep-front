
type FolderManagerStateType = {
    selectedFolderId: string,
    showFolderInput: boolean
}

type FolderManagerReducerActionType = {type: "changedSelectedFolder", payload: {folderId: string}} 
                                    | {type: "toggledFolderInput"}

interface FolderItemProps {
    folderId: string,
    name: string,
    isSelected: boolean,
    creationDate?: Date,
    folderManagerDispatch: React.Dispatch<FolderManagerReducerActionType>

}

export type {FolderManagerReducerActionType, FolderManagerStateType, FolderItemProps}