
import {createNote, updateNote} from "@/lib/noteUtils"
import { Dispatch, useContext } from "react"
import { CustomEditorDispatchActions, CustomNoteEditorContext } from "./customEditorContext"
/*
    this file contains utility functions for the editor
*/

/**
 * 
 */



type CompulsoryEditorProps = {
    editorState: string, // stringified lexical editor state
    description: string[], // Text description of the note
}

type UpdateNoteProps = {noteId: string} & CompulsoryEditorProps

type CreateNoteProps = {folderId: string} & CompulsoryEditorProps

type SyncNoteUtilProps = UpdateNoteProps | CreateNoteProps

// this is how we can use the type
// let l: SyncNoteUtilProps = {noteId: "123", editorState: "123", description: ["123"]} //update note
// let b: SyncNoteUtilProps = {folderId: "123", editorState: "123", description: ["123"]} //create note


function syncNote(props: SyncNoteUtilProps): Promise<{success: boolean, error?: string}>{
    const {customNoteEditorDispatch} = useContext(CustomNoteEditorContext)

    return new Promise((resolve, reject) => {
        if ("noteId" in props){
            // update existing note
            customNoteEditorDispatch({type: "sync_state_changed", payload: {isSyncing: true}})
            //here we can set isSyncing to true
            updateNote({
                _id: props.noteId,
                editorState: props.editorState,
                description: props.description,
            }).then((jsonResponse)=>{
                //set isSyncing to false
                customNoteEditorDispatch({type: "sync_state_changed", payload: {isSyncing: false}})
                if (jsonResponse.success){
                    resolve({success: true})
                } else {
                    reject({success: false, error: jsonResponse.error})
                }
            })

        } else if("folderId" in props){
            // create new note
            customNoteEditorDispatch({type: "sync_state_changed", payload: {isSyncing: true}})
            createNote({
                folderId: props.folderId,
                editorState: props.editorState,
                description: props.description,
            }).then((jsonResponse)=>{
                customNoteEditorDispatch({type: "sync_state_changed", payload: {isSyncing: false}})
                if (jsonResponse.success){
                    resolve({success: true})
                } else {
                    reject({success: false, error: jsonResponse.error})
                }
            })
        } else {
            reject({success: false, error: "folderId or noteId must be provided"})
        }
    })
}

export {syncNote}