//gobal types accessible accross features only

type LiveDataState = {
  selectedFolderId: string | null;
  selectedNoteId: string | null;
  noteOrder?: "cd" | "rcd" | "lmd" | "rlmd" | null; // creation date and last modified date respectively
};

type LiveDataDispatchAction =
  | { type: "changedSelectedFolder"; payload: { folderId: string } }
  | { type: "changedSelectedNote"; payload: { noteId: string } }
  | {
      type: "changedNoteOrder";
      payload: { newNoteOrder: LiveDataState["noteOrder"] };
    }; // newNoteOrder type is a lookup type obtained from LiveDataState

type FolderDataType = {
  _id: string;
  folderName: string;
  creationDate: string;
  size?: number;
  isPublic: boolean;
};

type AuthJsonResponse = {
  // all auth requests
  success: boolean;
  info: string;
  error: null | { message: string };
  timeStamp: number;
};

interface NoteItemDataType {
  _id: string;
  folderId: string;
  editorState: string;
  description: Array<string>; // of size 2
  creationDate: string;
  lastModifiedDate: string;
  lastOpenedDate: string;
  isPublic: boolean;
}

export type {
  LiveDataState,
  LiveDataDispatchAction,
  AuthJsonResponse,
  FolderDataType,
  NoteItemDataType,
};
