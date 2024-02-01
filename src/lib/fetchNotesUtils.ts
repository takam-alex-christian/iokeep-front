

import useSWR from "swr"


// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

function useNotes({folderId}: {folderId: string}){

    const {data, isLoading, error} = useSWR(`${folderId}`, fetcher); //backend not yet implemented

    return {
        notes: data,
        isLoading,
        error
    }
}

function fetchEditorState({noteId}: {noteId: string}){
    const {data, isLoading, error} = useSWR(`${noteId}`, fetcher);

    return {
        editorState: data,
        isLoading,
        error
    }
}

function postNote(){ //passing note data including the editor data

    return {
        isSuccess: false
    }
}

function patchNote(){ //passing entries to be changed and their new values, must include and id

    return {
        isSuccess: false
    }
}

export {useNotes, fetchEditorState}