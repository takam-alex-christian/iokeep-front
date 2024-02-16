
import { liveDataContext } from "@/contexts/liveDataContext"
import { NoteItemDataType } from "@/types"
import { useContext } from "react"
import useSWR from "swr"


// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

type GenericJsonResponse = {
    success: boolean,
    data?: {_id: string}, //used only when creating note
    info: string,
    error: null | {message: string},
    timeStamp: number
}

async function createNote(noteData: { editorState: string, folderId: string }) {

    const cnHeaders = new Headers()
    cnHeaders.append("Content-Type", "application/json")

    const cnBody = JSON.stringify(noteData)

    const jsonResponse: GenericJsonResponse = await fetch(`be/notes`, {
        method: "POST",
        headers: cnHeaders,
        body: cnBody
    }).then((res) => res.json())

    return jsonResponse
}

function useNotes() { //relies on context data

    /** 
     * data below is of type {error: {message: string} | null, data: Array<Reduced notes>, timeStamp}
    */

    const {liveAppData} = useContext(liveDataContext)

    const { data, error, isLoading } = liveAppData.selectedFolderId? useSWR(`be/notes?folderId=${liveAppData.selectedFolderId}`, fetcher) : {data: {data: null}, isLoading: false, error: null}

    return {
        notesData: (!isLoading && !error ? data.data : []) as Array<NoteItemDataType>,
        isLoading,
        error
    }

}


async function updateNote({_id, editorState}: {_id: string, editorState: string}){

    const unHeaders = new Headers()
    unHeaders.append("Content-Type", "application/json");

    const unBody = JSON.stringify({editorState})

    const jsonResponse: GenericJsonResponse = await fetch(`be/notes/${_id}`, {
        method: "PATCH",
        headers: unHeaders,
        body: unBody,
    }).then(res=> res.json())

    return jsonResponse
}

async function deleteNote(_id: string){
    const dnHeaders = new Headers()
    dnHeaders.append("Content-Type", "application/json")

    return fetch(`be/notes/${_id}`, {
        method: "DELETE",
        headers: dnHeaders,
    }).then(res=>res.json())
}


export { createNote, useNotes, updateNote, deleteNote}