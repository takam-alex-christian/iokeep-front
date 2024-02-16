"use client"

import { Divider } from "@nextui-org/react"

import { liveDataContext } from "@/contexts/liveDataContext"
import { useFolders } from "@/lib/folderUtils"
import { useNotes } from "@/lib/noteUtils"
import { useContext } from "react"

import NoteItem from "./NoteItem"


export default function () {


    const {notesData, isLoading, error} = useNotes() //because this componenet renders its content only when folders are done loading
    
    return (
        <div className="py-2 flex flex-col gap-0">
            {!isLoading && notesData?.map((eachNote, i) => {
                return (
                    <div key={eachNote._id}>
                        <NoteItem key={eachNote._id} {...eachNote} />
                        {notesData.length - 1 != i && <div className="px-3"><Divider className="bg-default/40" orientation="horizontal" /></div>}

                    </div>
                )
            })}
        </div>
        // <></>
    )
}