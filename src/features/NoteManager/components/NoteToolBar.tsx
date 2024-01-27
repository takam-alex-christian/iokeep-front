

import React from "react"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import {faTrashCan} from "@fortawesome/free-regular-svg-icons"
import {faPlus} from "@fortawesome/free-solid-svg-icons"

import {Button} from "@nextui-org/react"

export default function NoteToolBar(){

    function addButtonHandler(){
        console.log("create new note button")
    }

    function deleteButtonHandler(){
        console.log("delete button pressed")
    }
    return (
        <div className="px-2">
            <div className="flex flex-row justify-between">
                <Button color="success" isIconOnly onPress={addButtonHandler}><FontAwesomeIcon icon={faPlus} /></Button>
                <Button  variant="light" onPress={deleteButtonHandler} isIconOnly><FontAwesomeIcon icon={faTrashCan} /></Button>
            </div>
        </div>
    )
}
