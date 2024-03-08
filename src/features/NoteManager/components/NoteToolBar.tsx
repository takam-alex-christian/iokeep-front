

import React, { useContext } from "react"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import {faTrashCan} from "@fortawesome/free-regular-svg-icons"
import {faPlus} from "@fortawesome/free-solid-svg-icons"

import {Button} from "@nextui-org/react"
import { liveDataContext } from "@/contexts/liveDataContext"
import { deleteNote, useNotes } from "@/lib/noteUtils"
import { NoteItemDataType } from "@/types"

export default function NoteToolBar(){

    const {liveAppData, liveAppDataDispatch} = useContext(liveDataContext)
    const {notesData, mutate} = useNotes()

    function addButtonHandler(){
        // console.log("create new note button")
        liveAppDataDispatch({type: "changedSelectedNote", payload: {noteId: ""}})
    }

    function deleteButtonHandler(){
        
        if (liveAppData.selectedNoteId){
            deleteNote(liveAppData.selectedNoteId).then((jsonResponse)=>{
                if (!jsonResponse.error){
                    if(jsonResponse.success) {
                        // display something to infor the user that not is successfully deleted

                        //mutate to remove selectedFolder id
                        mutate(notesData.filter((eachNote)=>{return eachNote._id != liveAppData.selectedNoteId})).then((newData: Array<NoteItemDataType>)=>{
                            if (newData.length > 0){
                                liveAppDataDispatch({type: "changedSelectedNote", payload: {noteId: newData[0]._id}})
                            }else {
                                //inform user this folder is empty
                                liveAppDataDispatch({type: "changedSelectedNote", payload: {noteId: ""}})
                            }
                        })
                        //select new not in the list

                    }else{
                        // inform the user that note was not deleted
                    }
                    console.log(jsonResponse.info)
                }else{
                    console.log(`Server found Error & says-> ${jsonResponse.error.message}}`)
                }
            })
        }
        console.log(liveAppData.selectedNoteId? "yes": "no")
        console.log("delete button pressed")
    }
    return (
        <div className="px-2">
            <div className="flex flex-row justify-between">
                <Button color="success" isIconOnly onPress={addButtonHandler}><FontAwesomeIcon icon={faPlus} /></Button>
                <Button  variant="light" onPress={deleteButtonHandler} isIconOnly isDisabled={liveAppData.selectedNoteId? false: true}><FontAwesomeIcon icon={faTrashCan} /></Button>
            </div>
        </div>
    )
}
