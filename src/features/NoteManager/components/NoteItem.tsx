"use client"

import { useContext } from "react"
import { Button } from "@nextui-org/react"
import { liveDataContext } from "@/contexts/liveDataContext"

type NoteItemProps = {
    noteId: string,
    description: string[],
    creationDate: {
        day: number | string, //better be a number
        month: number | string,
        year: number | string,
        hour: number | string,
        minute: number | string,
        second: number | string
    }
}

export default function NoteItem(props: NoteItemProps) {

    const {liveAppData,liveAppDataDispatch} = useContext(liveDataContext)

    function notePressHandler(){
        liveAppDataDispatch({type: "changedSelectedNote", payload: {noteId: props.noteId}})
    }

    return (
        <Button onPress={notePressHandler} key={props.noteId} className={`flex flex-row justify-start text-left h-fit px-0 py-2 w-full ${liveAppData.selectedNoteId == props.noteId? "bg-default/45" :"bg-transparent"}`} >
            <div className="flex flex-col gap-0 p-3 rounded-lg bg-none w-full ">

                <div className="text-base py-0 font-semibold text-default-600 overflow-hidden overflow-ellipsis">{props.description[0]}</div>


                <div className="flex flex-col gap-1 ">
                    {/* {peak first p after heading} */}
                    <p className="overflow-hidden overflow-ellipsis flex-grow text-default-400"> {props.description[1]}</p>
                    {/* date p */}
                    <p className="text-sm text-default-400">{props.creationDate.day} {props.creationDate.month} {props.creationDate.year}</p>
                </div>
            </div>

        </Button>
    )
}