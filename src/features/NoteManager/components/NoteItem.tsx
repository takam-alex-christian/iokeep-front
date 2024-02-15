"use client"

import { useContext } from "react"
import { Button } from "@nextui-org/react"
import { liveDataContext } from "@/contexts/liveDataContext"
import { NoteItemDataType } from "@/types"

export default function NoteItem(props: NoteItemDataType) {

    const {liveAppData,liveAppDataDispatch} = useContext(liveDataContext)

    const noteCreationDate = new Date(props.creationDate)

    function notePressHandler(){
        liveAppDataDispatch({type: "changedSelectedNote", payload: {noteId: props._id}})
    }

    return (
        <Button onPress={notePressHandler} key={props._id} className={`flex flex-row justify-start text-left h-fit px-0 py-2 w-full ${liveAppData.selectedNoteId == props._id? "bg-default/45" :"bg-transparent"}`} >
            <div className="flex flex-col gap-0 p-3 rounded-lg bg-none w-full ">

                <div className="text-base py-0 font-semibold text-default-600 overflow-hidden overflow-ellipsis">{}</div>


                <div className="flex flex-col gap-1 ">
                    {/* {peak first p after heading} */}
                    <p className="overflow-hidden overflow-ellipsis flex-grow text-default-400"> {}</p>
                    {/* date p */}
                    <p className="text-sm text-default-400">{noteCreationDate.getDate()} {noteCreationDate.getMonth()} {noteCreationDate.getFullYear()}</p>
                </div>
            </div>

        </Button>
    )
}