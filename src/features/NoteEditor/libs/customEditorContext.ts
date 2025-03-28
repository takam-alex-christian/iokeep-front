import { ActionDispatch, createContext, Dispatch, SetStateAction } from "react";

import { NoteSyncState } from "./types";




type CustomNoteEditorStateType = {
    syncState: NoteSyncState,
}

type CustomEditorDispatchActions = {type: "sync_state_changed", payload: NoteSyncState}

const initialCustomNoteEditorState: CustomNoteEditorStateType = {
    syncState: "idle",
}

const CustomNoteEditorContext = createContext<{
    customNoteEditorState: CustomNoteEditorStateType,
    customNoteEditorDispatch: Dispatch<CustomEditorDispatchActions>
}>({
    customNoteEditorState: initialCustomNoteEditorState,
    customNoteEditorDispatch: () => {}
})

function customEditorReducer(state: CustomNoteEditorStateType, action: CustomEditorDispatchActions): CustomNoteEditorStateType {
    switch (action.type) {
        case "sync_state_changed":
            return { ...state, syncState: action.payload }
        default:
            return state
    }
}


export {CustomNoteEditorContext, customEditorReducer, initialCustomNoteEditorState}