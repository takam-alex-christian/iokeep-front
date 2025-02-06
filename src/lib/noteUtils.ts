import { liveDataContext } from "@/contexts/liveDataContext";
import { LiveDataState, NoteItemDataType } from "@/types";
import { useContext } from "react";
import useSWR from "swr";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

type GenericJsonResponse = {
  success: boolean;
  data?: { _id: string }; //used only when creating note
  info: string;
  error: null | { message: string };
  timeStamp: number;
};

type CreateJsonResponseType = Omit<GenericJsonResponse, "data"> & {
  data: Omit<NoteItemDataType, "editorState">;
};
function orderNotes(
  noteArr: Array<NoteItemDataType>,
  orderType: LiveDataState["noteOrder"]
): Array<NoteItemDataType> {
  if (!noteArr) {
    return noteArr;
  } else {
    const outputNoteArr: Array<NoteItemDataType> = noteArr;

    switch (orderType) {
      case "cd": {
        //algo to sort note by creation date
        console.log(
          outputNoteArr.sort((a, b) => {
            return (
              -new Date(a.creationDate).getTime() +
              new Date(b.creationDate).getTime()
            );
          })
        );
        break;
      }
      case "rcd": {
        outputNoteArr.sort((a, b) => {
          return (
            new Date(a.creationDate).getTime() -
            new Date(b.creationDate).getTime()
          );
        });
        break;
      }
      case "lmd": {
        outputNoteArr.sort((a, b) => {
          return (
            -new Date(a.lastModifiedDate).getTime() +
            new Date(b.lastModifiedDate).getTime()
          );
        });
        break;
      }
      case "rlmd": {
        outputNoteArr.sort((a, b) => {
          return (
            new Date(a.lastModifiedDate).getTime() -
            new Date(b.lastModifiedDate).getTime()
          );
        });
        break;
      }
      default: {
        break;
      }
    }

    return outputNoteArr;
  }
}

async function createNote(noteData: {
  editorState: string;
  folderId: string;
  description: string[];
}) {
  const cnHeaders = new Headers();
  cnHeaders.append("Content-Type", "application/json");

  const cnBody = JSON.stringify(noteData);

  const jsonResponse: CreateJsonResponseType = await fetch(`be/notes`, {
    method: "POST",
    headers: cnHeaders,
    body: cnBody,
  }).then((res) => res.json());

  return jsonResponse;
}

function useNotes() {
  //relies on context data

  /**
   * data below is of type {error: {message: string} | null, data: Array<Reduced notes>, timeStamp}
   * do not run if not totally sure that context has been initialized
   */

  const { liveAppData } = useContext(liveDataContext);

  const { data, error, isLoading, mutate } = useSWR(
    liveAppData.selectedFolderId
      ? `be/notes?folderId=${liveAppData.selectedFolderId}`
      : null,
    fetcher
  );

  //order notes here

  return {
    notesData: orderNotes(
      data,
      liveAppData.noteOrder
    ) as Array<NoteItemDataType>,
    mutate,
    isLoading,
    error,
  };
}

async function updateNote({
  _id,
  editorState,
  description,
  isPublic,
  folderId,
}: {
  _id: string;
  editorState: string;
  description: string[];
  isPublic?: boolean;
  folderId?: string;
}) {
  const unHeaders = new Headers();
  unHeaders.append("Content-Type", "application/json");

  const unBody = JSON.stringify({
    noteData: { editorState, description, isPublic, folderId },
  });

  const jsonResponse: GenericJsonResponse = await fetch(`be/notes/${_id}`, {
    method: "PATCH",
    headers: unHeaders,
    body: unBody,
  }).then((res) => res.json());

  return jsonResponse;
}

async function deleteNote(_id: string) {
  const dnHeaders = new Headers();
  dnHeaders.append("Content-Type", "application/json");

  const jsonResponse: GenericJsonResponse = await fetch(`be/notes/${_id}`, {
    method: "DELETE",
    headers: dnHeaders,
  }).then((res) => res.json());

  return jsonResponse;
}

export { createNote, useNotes, updateNote, deleteNote, orderNotes };
