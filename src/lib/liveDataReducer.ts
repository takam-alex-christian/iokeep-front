import { LiveDataState, LiveDataDispatchAction } from "@/types";

export default function liveDataReducer(
  prevState: LiveDataState,
  action: LiveDataDispatchAction
): LiveDataState {
  switch (action.type) {
    case "changedSelectedFolder": {
      return { ...prevState, selectedFolderId: action.payload.folderId };
    }
    case "changedSelectedNote": {
      return { ...prevState, selectedNoteId: action.payload.noteId };
    }
    case "changedNoteOrder": {
      return { ...prevState, noteOrder: action.payload.newNoteOrder };
    }
    default:
      return prevState;
  }
}
