
//gobal types accessible accross features only

type LiveDataState = {
    selectedFolderId: string | null
    selectedNoteId: string | null
}

type LiveDataDispatchAction = {type: "changedSelectedFolder", payload: {folderId: string}} | {type: "changedSelectedNote", payload: {noteId: string}}



export type {LiveDataState, LiveDataDispatchAction}