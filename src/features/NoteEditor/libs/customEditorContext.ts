import { ActionDispatch, createContext, Dispatch, SetStateAction } from "react";






type CustomNoteEditorStateType = {
    isSyncing: boolean,
    isIdle: boolean,
}

type CustomEditorDispatchActions = {type: "sync_state_changed", payload: {isSyncing: boolean}}

const initialCustomNoteEditorState: CustomNoteEditorStateType = {
    isSyncing: false,
    isIdle: true,
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
            return { ...state, isSyncing: action.payload.isSyncing }
        default:
            return state
    }
}


export {CustomNoteEditorContext, customEditorReducer, initialCustomNoteEditorState}