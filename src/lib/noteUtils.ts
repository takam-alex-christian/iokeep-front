
import { NoteItemDataType } from "@/types"
import useSWR from "swr"


// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

async function createNote(noteData: {editorState: string, folderId: string}){

    const cnHeaders = new Headers()
    cnHeaders.append("Content-Type", "application/json")

    const cnBody = JSON.stringify(noteData)

    const jsonResponse: {success: boolean,data: {_id: string}, error: null | {message: string}, timeStamp: number} = await fetch(`be/notes`, {
        method: "POST",
        headers: cnHeaders,
        body: cnBody
    }).then((res)=> res.json())

    return jsonResponse
}

function useNotes(folderId: string){

    /** 
     * data below is of type {error: {message: string} | null, data: Array<Reduced notes>, timeStamp}
    */
   
    const {data, error, isLoading} = useSWR(`be/notes?folderId=${folderId}`, fetcher)

    return {
        notesData: (!isLoading && !error? data.data : []) as Array<NoteItemDataType>,
        isLoading,
        error
    }

}


export {createNote, useNotes}